/**
 * This component was made to control if user is logged in to access pages
 */

import { useEffect } from "preact/hooks";

export interface Props {
  redirectTo?: string;
}

function PublicPageControl(props: Props) {
  async function isLogged({ accessToken }: { accessToken: string }) {
    try {
      const response = await fetch("http://localhost:3000/auth/me", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
          Authorization: accessToken,
        },
      }).then((r) => r.json());

      const username = response.data?.Username;

      if (username) {
        window.location.href = props.redirectTo || "/meus-dados";
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }

  useEffect(() => {
    // Pega accessCode no localStorage para verificar se ainda está válida a sessão via api
    const accessToken = localStorage.getItem("AccessToken") || "";

    isLogged({ accessToken });
  }, []); // Passando um array de dependências vazio

  return <></>;
}

export default PublicPageControl;
