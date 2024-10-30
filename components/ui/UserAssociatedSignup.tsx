import FormWrap from "./FormWrap.tsx";
import { useEffect, useState } from "preact/hooks";
import Image from "apps/website/components/Image.tsx";
import Icon from "./Icon.tsx";
import { invoke } from "../../runtime.ts";
import Loading from "../../components/daisy/Loading.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";

export type Association = {
  cnpj: string;
  logo_url: string;
  name: string;
};

function UserAssociatedSignup() {
  const [loading, setLoading] = useState(true);
  const [associationName, setAssociationName] = useState("");
  const [associationLogo, setAssociationLogo] = useState("");
  const [userName, setUserName] = useState("");
  let associationSignup = "";

  if (IS_BROWSER) {
    setUserName(localStorage.getItem("nameUserAssociationSignup") || "");
    associationSignup = localStorage.getItem("associationSignup") || "";
  }

  useEffect(() => {
    setLoading(true);
    try {
      invoke["deco-sites/ecannadeco"].actions
        .getAssociation({
          id: associationSignup,
        })
        .then((r) => {
          const resp = r as Association;
          setAssociationName(resp.name);
          setAssociationLogo(resp.logo_url);
          setLoading(false);
        });
    } catch (_e) {
      alert("Não foi possível carregar associação. Contacte o suporte.");
    }
  }, []); // Passando um array de dependências vazio

  const handleProceed = () => {
    if (IS_BROWSER) {
      localStorage.setItem("associationSignup", "");
    }
    window.location.href = "/entrar";
  };

  return (
    <FormWrap>
      {loading
        ? <Loading style="loading-spinner" size="loading-md" />
        : (
          <div class="flex flex-col items-center gap-4">
            <span class="text-2xl text-[#8b8b8b] font-semibold text-center my-4">
              Bem vindo, {userName}!
            </span>
            <div class="flex flex-col gap-4 ietms-center">
              <span>
                Reconhecemos que você possui vínculo com a{" "}
                <span class="font-bold">{associationName}</span>
              </span>
              <div class="flex justify-center">
                <Image
                  src={associationLogo}
                  alt={"logo associação"}
                  width={117}
                  height={32}
                />
              </div>
              <span>
                Por conta deste vínculo, você tem condições especiais para
                garantir sua segurança como paciente de cannabis medicinal.
              </span>
            </div>
            <div class="flex w-full">
              <ul class="flex flex-col gap-3 w-full">
                <li class="flex gap-3 items-center">
                  <Icon class="text-primary" id="CircleCheck" size={17} />
                  <span class="text-[10px]">Uso gratuito estendido</span>
                </li>
                <li class="flex gap-3 items-center">
                  <Icon class="text-primary" id="CircleCheck" size={17} />
                  <span class="text-[10px]">Carteirinha digital oficial</span>
                </li>
                <li class={`flex gap-3 items-center`}>
                  <Icon class="text-primary" id="CircleCheck" size={17} />
                  <span class="text-[10px]">
                    Upload ilimitado de documentos
                  </span>
                </li>
                <li class={`flex gap-3 items-center`}>
                  <Icon class="text-primary" id="CircleCheck" size={17} />
                  <span class="text-[10px]">
                    Suporte ilimitado do uso da plataforma
                  </span>
                </li>
              </ul>
            </div>
            <div class="flex flex-col gap-4">
              <span>
                Agora que o seu cadastro está feito, basta prosseguir para fazer
                o login, preencher seus dados e, caso queira, pedir sua via
                física.
              </span>
              <button
                onClick={handleProceed}
                class="btn btn-primary text-white w-full mt-2"
              >
                PROSSEGUIR
              </button>
            </div>
          </div>
        )}
    </FormWrap>
  );
}

export default UserAssociatedSignup;
