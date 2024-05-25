/**
 * This component was made to control if user is logged in to access pages
 */

import { useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { invoke } from "../../runtime.ts";

export interface Props {
  redirectTo?: string;
}

function PublicPageControl(props: Props) {
  async function isLogged({ accessToken }: { accessToken: string }) {
    try {
      const r = await invoke["deco-sites/ecannadeco"].actions
        .getUser({
          token: accessToken,
        });

      const response = r as {
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

      const username = response.data.Username;

      if (username) {
        window.location.href = props.redirectTo || "/tratamentos";
      } else {
        if (IS_BROWSER) {
          localStorage.setItem("AccessToken", "");
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
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

export default PublicPageControl;
