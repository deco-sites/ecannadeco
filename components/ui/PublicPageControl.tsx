/**
 * This component was made to control if user is logged in to access pages
 */

import { useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

export interface Props {
  redirectTo?: string;
}

function PublicPageControl(props: Props) {
  async function isLogged({ accessToken }: { accessToken: string }) {
    try {
      const response = await fetch(
        "http://http://production.eba-93ecmjzh.us-east-1.elasticbeanstalk.com//auth/me",
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
            Authorization: accessToken,
          },
        },
      ).then((r) => r.json());

      const username = response.data.Username;

      if (username) {
        window.location.href = props.redirectTo || "/meus-dados";
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
