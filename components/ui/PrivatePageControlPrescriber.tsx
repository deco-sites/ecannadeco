/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
import { useUI } from "../../sdk/useUI.ts";
import { useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { invoke } from "../../runtime.ts";

export interface Props {
  redirectTo?: string;
}

function PrivatePageControl(_props: Props) {
  const { user } = useUI();

  async function isLogged({ accessToken }: { accessToken: string }) {
    if (accessToken === "") {
      window.location.href = "/";
    }

    try {
      const res = await invoke["deco-sites/ecannadeco"].actions
        .getUserPrescriber({
          token: accessToken,
        });

      // console.log({resPrivatePageControl: res})

      const r = res as {
        cognito_id: string;
      };
      const username = r.cognito_id;

      if (!username) {
        user.value = null;
        if (IS_BROWSER) {
          localStorage.setItem("PrescriberAccessToken", "");
        }
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      if (IS_BROWSER) {
        localStorage.setItem("PrescriberAccessToken", "");
      }
      window.location.href = "/";
    }
  }

  useEffect(() => {
    // Pega accessCode no localStorage para verificar se ainda está válida a sessão via api
    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("PrescriberAccessToken") || "";
    }

    isLogged({ accessToken });
  }, []); // Passando um array de dependências vazio

  return <></>;
}

export default PrivatePageControl;
