/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
// import { useUI } from "../../sdk/useUI.ts";
import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import PageWrap from "../../components/ui/PageWrap.tsx";
import Icon from "../../components/ui/Icon.tsx";
import AdminNewDocModal from "../../islands/AdminNewDocModal.tsx";
import PreSignupUsersModal from "../../islands/PreSignupUsersModal.tsx";
import type {
  AssociationUsers,
} from "../../actions/adminGetAssociationUsers.ts";
import { useUI } from "../../sdk/useUI.ts";
import Image from "apps/website/components/Image.tsx";
import { h } from "preact";
import Loading from "../../components/daisy/Loading.tsx";
import type { DocListType } from "../../components/ui/MyDocs.tsx";
import Modal from "../../components/ui/Modal.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";

export type Address = {
  cep: string;
  number: string;
  complement: string;
  addressType: string;
};

function MyAccount() {
  const [isLoading, setIsLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [emailSearch, setEmailSearch] = useState("");
  const [associationName, setAssociationName] = useState("");
  const [associationCnpj, setAssociationCnpj] = useState("");
  const [associationLogo, setAssociationLogo] = useState("");
  const [createType, setCreateType] = useState<"user" | "association">(
    "association",
  );
  const [limit, setLimit] = useState<number>();
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false);
  const [page, setPage] = useState<number>();
  const [totalPages, setTotalPages] = useState<number>();
  const [associationUsers, setAssociationUsers] = useState<AssociationUsers>();
  const [docs, setDocs] = useState<DocListType[]>([]);

  const {
    displayPreSignupUsersModal,
    displayAssociationAdminNewDoc,
    userToAdminCreateDoc,
    associationToAdminCreateDoc,
    displayConfirmDeleteDoc,
  } = useUI();

  function downloadFile(fileUrl: string, filename: string) {
    // Fetch the file data
    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a temporary anchor element
        const a = document.createElement("a");
        a.style.display = "none";

        // Set the download attribute and file URL
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);

        // Append the anchor to the body and trigger the download
        document.body.appendChild(a);
        a.click();

        // Clean up
        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  }

  const ModalConfirmDelete = ({ id }: { id: string }) => {
    return (
      <Modal
        open={displayConfirmDeleteDoc.value}
        onClose={() => displayConfirmDeleteDoc.value = false}
      >
        <div class="flex flex-col p-16 gap-3 bg-[#EDEDED] rounded-xl">
          <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
            Tem certeza que deseja deletar este documento?
          </h3>
          <div class="flex flex-col items-center gap-2">
            <button
              class="btn bg-red-500 text-white"
              onClick={() => {
                handleDeleteDoc({ id });
                displayConfirmDeleteDoc.value = false;
              }}
            >
              Deletar
            </button>
            <button
              class="btn btn-ghost"
              onClick={() => {
                displayConfirmDeleteDoc.value = false;
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const getDocuments = () => {
    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AdminAccessToken") || "";
    }

    try {
      setIsLoading(true);

      invoke["deco-sites/ecannadeco"].actions.getAssociationDocs({
        token: accessToken,
      }).then((r) => {
        setDocs((r as { docs: DocListType[] }).docs);
        setIsLoading(false);
      });
    } catch (e) {
      alert(
        "Não foi possível carregar os documentos. Tente novamente mais tarde ou contecte o suporte.",
      );
      setIsLoading(false);
    }
  };

  const handleUploadSelfie = async (
    event: h.JSX.TargetedEvent<HTMLInputElement, Event>,
  ) => {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files && fileInput.files[0];

    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AdminAccessToken") || "";
    }

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "selfie_photo");

      try {
        const response = await fetch(
          "http://localhost:3000/files",
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: accessToken,
              ContentType: "multipart/form-data",
            },
          },
        );
        const r = await response.json();

        setAssociationLogo(r.url);
      } catch (e) {
        console.log({ e });
      }
    }
  };

  useEffect(() => {
    // Pega accessCode no localStorage para verificar se ainda está válida a sessão via api
    let accessToken = "";
    let associationAdmin = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AdminAccessToken") || "";
      associationAdmin = localStorage.getItem("AssociationAdmin") || "";
    }

    if (accessToken === "" || associationAdmin === "") {
      window.location.href = "/";
    }

    try {
      setIsLoading(true);

      getDocuments();

      invoke["deco-sites/ecannadeco"].actions.adminGetAssociation({
        token: accessToken,
        id: associationAdmin,
      }).then((r) => {
        associationToAdminCreateDoc.value = {
          _id: r._id,
          name: r.name,
        };
        setAssociationName(r.name);
        setAssociationCnpj(r.cnpj);
        setAssociationLogo(r.logo_url);
        invoke["deco-sites/ecannadeco"].actions.adminGetAssociationUsers({
          token: accessToken,
        }).then((r) => {
          if (r.message) {
            throw new Error(r.message);
          }
          setPage(r.page);
          setTotalPages(r.totalPages);
          setLimit(r.limit);
          setHasNextPage(r.hasNextPage);
          setHasPrevPage(r.hasPrevPage);
          setAssociationUsers(r.docs);
          setIsLoading(false);
        });
      });
    } catch (e) {
      console.log({ e });
      alert(
        "Não foi possível carregar dados da associação. Tente novamente mais tarde ou contecte o suporte.",
      );
      setIsLoading(false);
    }
  }, []); // Passando um array de dependências vazio

  const handleUpdate = () => {
    let accessToken = "";
    let associationAdmin = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AdminAccessToken") || "";
      associationAdmin = localStorage.getItem("AssociationAdmin") || "";
    }

    setUpdating(true);

    try {
      invoke["deco-sites/ecannadeco"].actions.adminUpdateAssociation({
        body: {
          name: associationName,
          logo_url: associationLogo,
        },
        token: accessToken,
        id: associationAdmin,
      }).then((r) => {
        setUpdating(false);
        window.location.reload();
      });
    } catch (e) {
      alert(
        "Não foi possível Atualizar dados da associação. Tente novamente mais tarde ou contecte o suporte.",
      );
      setUpdating(false);
    }
  };

  const handleGetUsers = (pageParam: number, email?: string) => {
    let accessToken = "";
    let associationAdmin = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AdminAccessToken") || "";
      associationAdmin = localStorage.getItem("AssociationAdmin") || "";
    }
    setIsLoadingUsers(true);

    try {
      invoke["deco-sites/ecannadeco"].actions.adminGetAssociationUsers({
        token: accessToken,
        params: {
          email: emailSearch,
          page: pageParam,
          limit: limit || 25,
        },
      }).then((r) => {
        if (r.message) {
          throw new Error(r.message);
        }
        setPage(r.page);
        setTotalPages(r.totalPages);
        setLimit(r.limit);
        setHasNextPage(r.hasNextPage);
        setHasPrevPage(r.hasPrevPage);
        setAssociationUsers(r.docs);
        setIsLoadingUsers(false);
      });
    } catch (e) {
      alert(
        "Não foi possível carregar usuários. Tente novamente mais tarde ou contecte o suporte.",
      );
      setUpdating(false);
    }
  };

  const handleDeleteDoc = async ({ id }: { id: string }) => {
    setDeleting(true);

    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AccessToken") || "";
    }

    try {
      const r = await invoke["deco-sites/ecannadeco"].actions
        .deleteAssociationDocument({
          docId: id,
          token: accessToken,
        });

      const resp = r as { message?: string };

      if (resp.message) {
        alert(`Algo deu errado: ${resp.message}`);
      } else {
        getDocuments();
      }

      setDeleting(false);
    } catch (e) {
      console.log({ e });
      alert("Não foi possível apagar o documento. Tente mais tarde.");
      setDeleting(false);
    }
  };

  return (
    <PageWrap>
      {isLoading
        ? <span class="loading loading-spinner text-green-600"></span>
        : (
          <div class="flex flex-col gap-3 w-full">
            <div class="flex justify-center">
              <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
                Dados da Associação
              </h3>
            </div>
            <div class="flex flex-col gap-3">
              <div>
                <label for="selfieInput">
                  <div class="relative h-[32px] w-[117px] shadow-md cursor-pointer">
                    <div class="absolute h-5 w-5 flex justify-center items-center rounded-full bg-black bg-opacity-40 top-[4px] left-[93px]">
                      <div class="text-white">
                        <Icon id="Edit" size={12} />
                      </div>
                    </div>
                    <div class="h-[32px] w-[117px]flex justify-center items-center">
                      <Image
                        class="rounded-md"
                        src={associationLogo
                          ? associationLogo
                          : "http://drive.google.com/uc?export=view&id=1tSFTp0YZKVQVGJHOqzKaJw6SEe7Q8LL7"}
                        alt={"user selfie"}
                        width={117}
                        height={32}
                      />
                    </div>
                  </div>
                </label>
                <input
                  id="selfieInput"
                  type="file"
                  class="hidden"
                  onChange={(e) => handleUploadSelfie(e)}
                />
              </div>
              <div class="flex flex-col sm:flex-row sm:flew-wrap gap-2">
                <label class="form-control w-full">
                  <div class="label pb-1">
                    <span class="label-text text-xs text-[#585858]">
                      Nome da Associação
                    </span>
                  </div>
                  <input
                    placeholder="Nome da Associação"
                    class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3]"
                    name="associationName"
                    value={associationName}
                    onChange={(e) =>
                      e.target && setAssociationName(e.currentTarget.value)}
                  />
                </label>
                <label class="form-control w-full">
                  <div class="label pb-1">
                    <span class="label-text text-xs text-[#585858]">
                      CNPJ
                    </span>
                  </div>
                  <input
                    placeholder="CNPJ da Associação"
                    class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3]"
                    name="associationCnpj"
                    disabled
                    value={associationCnpj}
                  />
                </label>
              </div>
              <div class="w-full flex justify-end">
                <button
                  class="btn btn-secondary text-white"
                  onClick={handleUpdate}
                >
                  {updating ? "Atualizando..." : "Atualizar Dados"}
                </button>
              </div>
            </div>
            <div>
              <div class="flex justify-start gap-4 items-center mb-4 mt-10">
                <h2 class="text-[#8b8b8b] font-semibold">
                  Documentos da Associação
                </h2>
                <button
                  class="rounded-md bg-secondary h-8 w-[85px] flex gap-2 items-center p-3 justify-between text-white"
                  onClick={() => {
                    setCreateType("association");
                    displayAssociationAdminNewDoc.value = true;
                  }}
                >
                  <span class="text-sm font-medium">Subir</span>
                  <Icon id="Upload" size={18} />
                </button>
              </div>
              <div>
                <ul>
                  {docs.map((d) => {
                    return (
                      <li class="flex items-center gap-4">
                        <a class="w-full" href={d.file_url}>
                          <div class="flex justify-between rounded-md bg-[#C8C8C8] w-full px-5 h-10 items-center">
                            <div class="flex gap-2">
                              <span class="text-[#8F8D8D]">
                                <Icon id="Anexo" size={24} />
                              </span>
                              <span class="text-[#393939] font-semibold">
                                {d.title}
                              </span>
                            </div>
                            <span class="text-[#8F8D8D] flex justify-end w-6">
                              <Icon id="Download" height={19} />
                            </span>
                          </div>
                        </a>
                        <ModalConfirmDelete id={d._id} />
                        {deleting
                          ? (
                            <Loading
                              style="loading-spinner"
                              size="loading-md"
                            />
                          )
                          : (
                            <Icon
                              onClick={() => {
                                displayConfirmDeleteDoc.value = true;
                              }}
                              id="Trash"
                              size={24}
                            />
                          )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div>
              <h2 class="text-[#8b8b8b] font-semibold mb-4 mt-10 w-full">
                Pacientes da Associação
              </h2>
              <div class="flex flex-col sm:flex-row gap-4 justify-between mb-4">
                <input
                  placeholder="Pesquise por email"
                  class="input rounded-full text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3] sm:w-1/2 h-[35px] text-xs"
                  name="emailSearch"
                  value={emailSearch}
                  onChange={(e) => {
                    setEmailSearch(e.currentTarget.value);
                    if (e.currentTarget.value.length >= 3) {
                      handleGetUsers(page!, e.currentTarget.value);
                    }
                  }}
                />
                <div class="flex sm:w-1/2 justify-end">
                  <button
                    class="btn btn-sm btn-primary text-white"
                    onClick={() => {
                      displayPreSignupUsersModal.value = true;
                    }}
                  >
                    <Icon id="UserData" size={19} />Pré-cadastrar Pacientes
                  </button>
                </div>
              </div>
              <div>
                <div class="flex pb-2 px-2 border-b border-[#cdcdcd] mb-4">
                  <div class="w-[32%] flex justify-start">
                    <span class="text-xs">Nome</span>
                  </div>
                  <div class="w-[32%] flex justify-start">
                    <span class="text-xs">Email</span>
                  </div>
                  <div class="w-[32%] flex justify-end">
                    <span class="text-xs">CPF</span>
                  </div>
                </div>
                <PreSignupUsersModal
                  onFinish={() => console.log("on finish")}
                />
                <AdminNewDocModal createType={createType} />
                {isLoadingUsers
                  ? <span class="loading loading-spinner text-green-600"></span>
                  : (
                    <ul class="flex flex-col gap-2">
                      {associationUsers && associationUsers.map((u) => {
                        return (
                          <div class="dropdown dropdown-top dropdown-end">
                            <div tabindex={0} role="button" class="">
                              <div target="_blank">
                                <li class="p-3 bg-[#cacaca] flex gap-[2%] justify-between items-center rounded-md text-[10px] sm:text-xs md:text-sm">
                                  <div class="w-[32%] flex justify-start">
                                    <span>
                                      {u.cognito_data
                                        ? u.cognito_data.name
                                        : (
                                          <span class="badge text-xs font-bold">
                                            Cadastro Pendente
                                          </span>
                                        )}
                                    </span>
                                  </div>
                                  <div class="w-[32%] flex justify-start">
                                    <span>{u.email}</span>
                                  </div>
                                  <div class="w-[32%] flex justify-end">
                                    <span>
                                      {u.cognito_data
                                        ? u.cognito_data.cpf
                                        : (
                                          <span class="badge text-xs font-bold">
                                            Cadastro Pendente
                                          </span>
                                        )}
                                    </span>
                                  </div>
                                </li>
                              </div>
                            </div>
                            <ul
                              tabindex={0}
                              class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                            >
                              <span class="text-[10px] font-bold text-center">
                                {u.email}
                              </span>
                              <li>
                                <a
                                  href={`http://localhost:8000/ficha/${u._id}`}
                                  target="_blank"
                                  class="flex items-center"
                                >
                                  Ficha do Paciente
                                </a>
                              </li>
                              <li
                                onClick={() => {
                                  downloadFile(
                                    u.qrcode_url,
                                    `qrcode-${u.email}.png`,
                                  );
                                }}
                              >
                                <a>Baixar QR Code</a>
                              </li>
                              <li>
                                <a
                                  onClick={() => {
                                    setCreateType("user");
                                    displayAssociationAdminNewDoc.value = true;
                                    userToAdminCreateDoc.value = {
                                      _id: u._id,
                                      email: u.email,
                                    };
                                  }}
                                >
                                  Subir Documento
                                </a>
                              </li>
                            </ul>
                          </div>
                        );
                      })}
                    </ul>
                  )}
              </div>
              {/* pagination */}
              <div class="flex justify-center mt-4">
                <div>
                  {hasPrevPage && (
                    <Icon
                      onClick={() => handleGetUsers(page! - 1)}
                      id="ChevronLeft"
                      size={19}
                    />
                  )}
                </div>
                <div>
                  <span class="text-xs">
                    {`Página ${page}/${totalPages}`}
                  </span>
                </div>
                <div>
                  {hasNextPage && (
                    <Icon
                      onClick={() => handleGetUsers(page! + 1)}
                      id="ChevronRight"
                      size={19}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
    </PageWrap>
  );
}

export default MyAccount;
