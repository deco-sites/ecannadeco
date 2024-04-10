/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
import { useUI } from "../../sdk/useUI.ts";
import { useEffect, useState } from "preact/hooks";

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
      const response = await fetch("http://localhost:3000/auth/me", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
          Authorization: accessToken,
        },
      }).then((r) => r.json());

      const username = response.data.Username;

      user.value = {
        id: username,
        name: response.data.UserAttributes.find((
          a: { Name: string; Value: string },
        ) => a.Name === "name").Value,
        email: response.dataProfile.email,
        plan: response.dataProfile.plan,
      };

      console.log({ userhere: user.value });

      updatedData.value = response.dataProfile.updatedData;
      uploadedFile.value = response.dataProfile.uploadedFile;

      if (!username) {
        user.value = null;
        localStorage.setItem("AccessToken", "");
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
      localStorage.setItem("AccessToken", "");
      window.location.href = "/";
    }
  }

  useEffect(() => {
    // Pega accessCode no localStorage para verificar se ainda está válida a sessão via api
    const accessToken = localStorage.getItem("AccessToken") || "";

    isLogged({ accessToken });
  }, []); // Passando um array de dependências vazio

  return <></>;
}

export default PrivatePageControl;
