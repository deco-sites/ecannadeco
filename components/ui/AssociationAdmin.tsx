/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
// import { useUI } from "../../sdk/useUI.ts";
import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import { Plan } from "../../components/ui/Checkout.tsx";
import PageWrap from "../../components/ui/PageWrap.tsx";
import Icon from "../../components/ui/Icon.tsx";
import ModalConfirm from "../../components/ui/ModalConfirm.tsx";
import { SavedCreditCard } from "../../components/ui/CheckoutUpsellModal.tsx";
import CheckoutUpsellModal from "../../islands/CheckoutUpsellModal.tsx";
import Slider from "../../components/ui/Slider.tsx";
import type {
  AssociationAdmin,
  AssociationUsers,
} from "../../actions/adminGetAssociation.ts";
import { useUI } from "../../sdk/useUI.ts";
import SliderJS from "../../islands/SliderJS.tsx";
import Image from "apps/website/components/Image.tsx";
import { h } from "preact";

export type Address = {
  cep: string;
  number: string;
  complement: string;
  addressType: string;
};

function MyAccount() {
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [associationName, setAssociationName] = useState("");
  const [associationCnpj, setAssociationCnpj] = useState("");
  const [associationLogo, setAssociationLogo] = useState("");
  const [associationUsers, setAssociationUsers] = useState<AssociationUsers>();

  const handleUploadSelfie = async (
    event: h.JSX.TargetedEvent<HTMLInputElement, Event>,
  ) => {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files && fileInput.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "selfie_photo");

      try {
        const response = await fetch("http://localhost:3000/files", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: localStorage.getItem("AccessToken") || "",
            ContentType: "multipart/form-data",
          },
        });
        const r = await response.json();

        setAssociationLogo(r.url);
      } catch (e) {
        console.log({ e });
      }
    }
  };

  useEffect(() => {
    // Pega accessCode no localStorage para verificar se ainda está válida a sessão via api
    const accessToken = localStorage.getItem("AccessToken") || "";
    const associationAdmin = localStorage.getItem("AssociationAdmin") || "";

    if (accessToken === "" || associationAdmin === "") {
      window.location.href = "/";
    }

    try {
      setIsLoading(true);

      invoke["deco-sites/ecannadeco"].actions.adminGetAssociation({
        token: accessToken,
        id: associationAdmin,
      }).then((r) => {
        setAssociationName(r.name);
        setAssociationCnpj(r.cnpj);
        setAssociationLogo(r.logo_url);
        setAssociationUsers(r.association_users);
        setIsLoading(false);
      });
    } catch (e) {
      alert(
        "Não foi possível carregar dados da associação. Tente novamente mais tarde ou contecte o suporte.",
      );
      setIsLoading(false);
    }
  }, []); // Passando um array de dependências vazio

  const handleUpdate = () => {
    const accessToken = localStorage.getItem("AccessToken") || "";
    const associationAdmin = localStorage.getItem("AssociationAdmin") || "";

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
              <h2 class="text-[#8b8b8b] font-semibold mb-4 mt-10 w-full">
                Pacientes da Associação
              </h2>
              <div>
                <div class="flex pb-2 px-2 border-b border-[#cdcdcd] mb-4">
                  <div class="w-[32%] flex justify-start">
                    <span>Nome</span>
                  </div>
                  <div class="w-[32%] flex justify-start">
                    <span>Email</span>
                  </div>
                  <div class="w-[32%] flex justify-end">
                    <span>CPF</span>
                  </div>
                </div>
                <ul class="flex flex-col gap-2">
                  {associationUsers && associationUsers.map((u) => {
                    return (
                      <li class="p-3 bg-[#cacaca] flex gap-[2%] justify-between items-center rounded-md text-[10px] sm:text-xs md:text-sm">
                        <div class="w-[32%] flex justify-start">
                          <span>{u.cognito_data.name}</span>
                        </div>
                        <div class="w-[32%] flex justify-start">
                          <span>{u.email}</span>
                        </div>
                        <div class="w-[32%] flex justify-end">
                          <span>{u.cognito_data.cpf}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}
    </PageWrap>
  );
}

export default MyAccount;
