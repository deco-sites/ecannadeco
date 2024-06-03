/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
import { useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { invoke } from "../../runtime.ts";

export interface Props {
  redirectTo?: string;
}

function PrivatePageControl(_props: Props) {
  async function isLogged({ accessToken }: { accessToken: string }) {
    if (accessToken === "") {
      window.location.href = "/";
    }

    try {
      const res = await invoke["deco-sites/ecannadeco"].actions
        .getUser({
          token: accessToken,
        });

      const r = res as {
        data: {
          UserAttributes: { Name: string; Value: string }[];
          Username: string;
        };
        dataProfile: {
          association: {
            _id: string;
            user: string;
          };
          updatedData: boolean;
          uploadedFile: boolean;
          email: string;
          plan: string;
        };
      };

      //control access in case patient is just treatment
      if (IS_BROWSER) {
        localStorage.setItem("currentPatientPlan", r.dataProfile.plan);
      }

      const currentPlan = r.dataProfile.plan;

      if (currentPlan === "TREATMENT") {
        const currentUrl = window.location.pathname;

        if (
          [
            "/minha-carteirinha",
            "/meus-documentos",
            "/meus-dados",
            "/meus-pedidos",
          ].includes(currentUrl)
        ) {
          window.location.href = "/tratamentos";
        }
      }

      if (currentPlan === "CARD") {
        if (!r.dataProfile.updatedData) {
          console.log("não fez updatedData");
          if (window.location.pathname !== "/meus-dados") {
            window.location.href = "/meus-dados";
          }
        } else if (!r.dataProfile.uploadedFile) {
          console.log("não fez uploadedFile");
          if (window.location.pathname !== "/meus-documentos") {
            window.location.href = "/meus-documentos";
          }
        }
      }

      const username = r.data.Username;

      if (!username) {
        throw new Error("Usuário não encontrado");
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      if (IS_BROWSER) {
        localStorage.setItem("AccessToken", "");
      }
      window.location.href = "/";
    }
  }

  useEffect(() => {
    // Pega accessCode no localStorage para verificar se ainda está válida a sessão via api
    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AccessToken") || "";
    }

    isLogged({ accessToken });
  }, []); // Passando um array de dependências vazio

  return <></>;
}

export default PrivatePageControl;
