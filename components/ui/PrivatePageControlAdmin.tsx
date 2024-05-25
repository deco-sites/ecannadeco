/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
import { useUI } from "../../sdk/useUI.ts";
import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { invoke } from "../../runtime.ts";

export interface Props {
  redirectTo?: string;
}

function PrivatePageControl(props: Props) {
  const { updatedData, uploadedFile, user } = useUI();

  async function isLogged({ accessToken }: { accessToken: string }) {
    if (accessToken === "") {
      window.location.href = "/";
    }

    try {
      const res = await invoke["deco-sites/ecannadeco"].actions
        .getUserAdmin({
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

      console.log({ accessToken });

      console.log({ responseGetMeAdmin: r });

      const username = r.data.Username;

      if (!username) {
        user.value = null;
        if (IS_BROWSER) {
          localStorage.setItem("AdminAccessToken", "");
        }
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      if (IS_BROWSER) {
        localStorage.setItem("AdminAccessToken", "");
      }
      window.location.href = "/";
    }
  }

  useEffect(() => {
    // Pega accessCode no localStorage para verificar se ainda está válida a sessão via api
    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AdminAccessToken") || "";
    }

    isLogged({ accessToken });
  }, []); // Passando um array de dependências vazio

  return <></>;
}

export default PrivatePageControl;
