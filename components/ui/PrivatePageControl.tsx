/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
// import { useUI } from "../../sdk/useUI.ts";
import { useEffect, useState } from "preact/hooks";

export interface Props {
  redirectTo?: string;
}

function PrivatePageControl(props: Props) {
  const [updatedData, setUpdatedData] = useState();
  const [uploadedFile, setUploadedFile] = useState();

  async function isLogged({ accessToken }: { accessToken: string }) {
    if (accessToken === "") {
      window.location.href = "/";
    }

    try {
      const response = await fetch("http://localhost:3000/auth/me", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
          Authorization: accessToken,
        },
      }).then((r) => r.json());

      const username = response.data.Username;
      setUpdatedData(response.dataProfile.updatedData);
      setUploadedFile(response.dataProfile.uploadedFile);

      if (!username) {
        window.location.href = "/";
      }

      if (!response.dataProfile.updatedData) {
        console.log("não fez updatedData");
        if (window.location.pathname !== "/meus-dados") {
          window.location.href = "/meus-dados";
        }
      } else if (!response.dataProfile.uploadedFile) {
        console.log("não fez uploadedFile");
        if (window.location.pathname !== "/meus-documentos") {
          window.location.href = "/meus-documentos";
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      window.location.href = "/";
    }
  }

  useEffect(() => {
    // Pega accessCode no localStorage para verificar se ainda está válida a sessão via api
    const accessToken = localStorage.getItem("AccessToken") || "";

    isLogged({ accessToken });
  }, []); // Passando um array de dependências vazio

  if (!updatedData) {
    return (
      <div role="alert" class="alert alert-warning">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>Preencha seus dados para continuar</span>
      </div>
    );
  } else if (!uploadedFile) {
    return (
      <div role="alert" class="alert alert-warning">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>Suba ao menos um documento para continuar</span>
      </div>
    );
  } else {
    return null;
  }
}

export default PrivatePageControl;
