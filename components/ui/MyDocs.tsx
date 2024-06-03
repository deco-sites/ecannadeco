import Icon from "../../components/ui/Icon.tsx";
import Modal from "../../components/ui/Modal.tsx";
import PageWrap from "../../components/ui/PageWrap.tsx";
import Loading from "../../components/daisy/Loading.tsx";
import { useEffect, useState } from "preact/hooks";
import { useUI } from "../../sdk/useUI.ts";
import { h } from "preact";
import { invoke } from "../../runtime.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";

export interface DocListType {
  _id: string;
  title: string;
  file_url: string;
  created_at: Date;
  category: string;
  status: string;
}

const DocList = (
  { docs, onFinishDelete }: { docs: DocListType[]; onFinishDelete: () => void },
) => {
  const { displayNewDocModal, displayConfirmDeleteDoc } = useUI();
  const [isDeleting, setIsDeleting] = useState(false);
  const [_deleteId, setDeleteId] = useState("");

  const handleDelete = async ({ id }: { id: string }) => {
    setIsDeleting(true);

    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AccessToken") || "";
    }

    try {
      const r = await invoke["deco-sites/ecannadeco"].actions.deleteDocument({
        docId: id,
        token: accessToken,
      });

      const resp = r as { message?: string };

      if (resp.message) {
        alert(`Algo deu errado: ${resp.message}`);
      } else {
        onFinishDelete();
      }

      setIsDeleting(false);
    } catch (e) {
      console.log({ e });
      alert("Não foi possível apagar o documento. Tente mais tarde.");
      setIsDeleting(false);
    }
  };

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
                handleDelete({ id });
                displayConfirmDeleteDoc.value = false;
              }}
            >
              Deletar
            </button>
            <button
              class="btn btn-ghost"
              onClick={() => {
                setDeleteId("");
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

  if (docs.length) {
    return (
      <>
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
                {isDeleting
                  ? <Loading style="loading-spinner" size="loading-md" />
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
      </>
    );
  } else {
    return (
      <div
        class="flex flex-col rounded-md bg-[#E9932E] w-full px-5 p-4 items-center cursor-pointer gap-4 text-[#954409]"
        onClick={() => {
          displayNewDocModal.value = true;
        }}
      >
        <span class="font-semibold">
          Você ainda não tem documentos deste tipo. Clique para fazer upload
        </span>
        <Icon id="Upload" size={24} />
      </div>
    );
  }
};

const PlanLimitAlert = (
  { message, ctaText, ctaLink }: {
    message: string;
    ctaText: string;
    ctaLink: string;
  },
) => {
  const { displayPlanLimit } = useUI();

  return (
    <Modal
      loading="lazy"
      open={displayPlanLimit.value}
      onClose={() => displayPlanLimit.value = false}
    >
      <div class="p-10 bg-white flex flex-col justify-center items-center gap-10">
        <span class="text-center">{message}</span>
        <a class="btn btn-primary" href={ctaLink}>{ctaText}</a>
      </div>
    </Modal>
  );
};

const NewDocModal = ({ onFinishCreate }: { onFinishCreate: () => void }) => {
  const [file, setFile] = useState<File>();
  const [docTitle, setDocTitle] = useState("");
  const [docCategory, setDocCategory] = useState("");
  const { displayNewDocModal, displayPlanLimit } = useUI();
  const [isUploading, setIsUploading] = useState(false);

  const handleStoreDocument = (
    event: h.JSX.TargetedEvent<HTMLInputElement, Event>,
  ) => {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      setFile(fileInput.files[0]);
    }
  };

  const handleCreate = async () => {
    setIsUploading(true);

    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AccessToken") || "";
    }

    const formData = new FormData();

    formData.append("file", file!);
    formData.append("title", docTitle);
    formData.append("category", docCategory);

    try {
      const response = await fetch(
        "https://api.ecanna.com.br/documents",
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

      // console.log({ r });
      displayNewDocModal.value = false;

      setIsUploading(false);
      if (r.message === "You need to upgrade your plan to create documents") {
        displayPlanLimit.value = true;
      } else {
        //update uploadedFile flag state
        await invoke["deco-sites/ecannadeco"].actions.updateProfile({
          token: accessToken,
          body: { uploadedFile: true },
        });

        onFinishCreate();
        alert("Upload concluído");
      }
    } catch (e) {
      console.log({ erroUpload: e });
      setIsUploading(false);
    }
  };

  return (
    <Modal
      loading="lazy"
      open={displayNewDocModal.value}
      onClose={() => displayNewDocModal.value = false}
    >
      <div class="flex flex-col p-16 gap-3 bg-[#EDEDED] rounded-xl">
        <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
          Subir novo Documento
        </h3>
        <input
          class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3] bg-white"
          placeholder="Título do Documento"
          value={docTitle}
          onChange={(e) => {
            setDocTitle(e.currentTarget.value);
          }}
        />

        <select
          onChange={(e) => {
            setDocCategory(e.currentTarget.value);
          }}
          class="select select-primary w-full max-w-xs text-[#8b8b8b] border-none disabled:bg-[#e3e3e3] bg-white"
        >
          <option disabled selected>Tipo de Documento</option>
          <option value="habeas_corpus">Jurídico / Habeas Corpus</option>
          <option value="medical_prescription">Prescrição Médica</option>
          <option value="anvisa">Autorização Anvisa</option>
          <option value="identification">Documento de Identificação</option>
        </select>

        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Selecione um arquivo</span>
          </div>
          <input
            type="file"
            class="file-input file-input-primary w-full max-w-xs"
            onChange={(e) => handleStoreDocument(e)}
          />
        </label>

        <button class="btn btn-secondary text-white" onClick={handleCreate}>
          Subir Documento{"   "}{isUploading
            ? <span class="loading loading-spinner text-white"></span>
            : <Icon id="Upload" size={24} />}
        </button>
        <button
          onClick={() => {
            displayNewDocModal.value = false;
          }}
          class="btn btn-ghost uppercase font-medium"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

function MyDocs() {
  const { displayNewDocModal } = useUI();
  const [isLoading, setIsLoading] = useState(true);
  const [docs, setDocs] = useState<DocListType[]>([]);
  let accessToken = "";

  if (IS_BROWSER) {
    accessToken = localStorage.getItem("AccessToken") || "";
  }

  const getDocuments = () => {
    try {
      setIsLoading(true);

      invoke["deco-sites/ecannadeco"].actions.getDocs({
        token: accessToken,
      }).then((r) => {
        setDocs((r as { docs: DocListType[] }).docs);
        setIsLoading(false);
      });
    } catch (_e) {
      alert(
        "Não foi possível carregar os documentos. Tente novamente mais tarde ou contecte o suporte.",
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDocuments();
  }, []); // Passando um array de dependências vazio

  const medicalDocs = docs.filter((d) => d.category === "medical_prescription");
  const anvisaDocs = docs.filter((d) => d.category === "anvisa");
  const habeasDocs = docs.filter((d) => d.category === "habeas_corpus");
  const idDocs = docs.filter((d) => d.category === "identification");

  return (
    <PageWrap>
      <div class="flex justify-between gap-4 mb-10">
        <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
          Meus Documentos
        </h3>
        <button
          class="rounded-md bg-secondary h-8 w-[85px] flex items-center p-3 justify-between text-white"
          onClick={() => {
            displayNewDocModal.value = true;
          }}
        >
          <span class="text-sm font-medium">Subir</span>
          <Icon id="Upload" size={18} />
        </button>
        <NewDocModal onFinishCreate={() => window.location.reload()} />
        <PlanLimitAlert
          message="Seu plano permite upload de 2 documentos. Evolua seu plano para PREMIUM e suba mais documentos!"
          ctaLink="/"
          ctaText="Evoluir Plano"
        />
      </div>
      <div class="flex flex-col gap-3">
        <h2 class="text-[#8b8b8b] font-semibold mb-1 mt-10 w-full">
          Documentos de Anvisa
        </h2>
        {isLoading
          ? <span class="loading loading-spinner text-black"></span>
          : <DocList onFinishDelete={getDocuments} docs={anvisaDocs} />}
        <h2 class="text-[#8b8b8b] font-semibold mb-1 mt-10 w-full">
          Documentos Médicos
        </h2>
        {isLoading
          ? <span class="loading loading-spinner text-black"></span>
          : <DocList onFinishDelete={getDocuments} docs={medicalDocs} />}
        <h2 class="text-[#8b8b8b] font-semibold mb-1 mt-10 w-full">
          Documentos Judiciais
        </h2>
        {isLoading
          ? <span class="loading loading-spinner text-black"></span>
          : <DocList onFinishDelete={getDocuments} docs={habeasDocs} />}
        <h2 class="text-[#8b8b8b] font-semibold mb-1 mt-10 w-full">
          Documentos de Identificação
        </h2>
        {isLoading
          ? <span class="loading loading-spinner text-black"></span>
          : <DocList onFinishDelete={getDocuments} docs={idDocs} />}
      </div>
    </PageWrap>
  );
}

export default MyDocs;
