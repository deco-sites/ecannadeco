/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
import { useUI } from "../../sdk/useUI.ts";
import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

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
      const response = await fetch(
        "http://http://production.eba-93ecmjzh.us-east-1.elasticbeanstalk.com//v1/admin/me",
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
            Authorization: accessToken,
          },
        },
      );

      console.log({ accessToken });

      const r = await response.json();

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
    const accessToken = "";

    if (IS_BROWSER) {
      localStorage.getItem("AccessToken") || "";
    }

    isLogged({ accessToken });
  }, []); // Passando um array de dependências vazio

  return <></>;
}

export default PrivatePageControl;
