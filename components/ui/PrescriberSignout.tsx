/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
// import { useUI } from "../../sdk/useUI.ts";
import { useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { invoke } from "../../runtime.ts";

export interface Props {
  redirectTo?: string;
}

function Signout({ redirectTo = "/" }) {
  useEffect(() => {
    let token = "";
    if (IS_BROWSER) {
      token = localStorage.getItem("PrescriberAccessToken") || "";
    }

    try {
      invoke["deco-sites/ecannadeco"].actions
        .prescriberSignOut({
          token,
        });
      if (IS_BROWSER) {
        localStorage.setItem("PrescriberAccessToken", "");
        localStorage.clear();
      }
      window.location.href = redirectTo;
    } catch (e) {
      console.log({ e });
      return e;
    }
  }, []); // Passando um array de dependências vazio

  return <div></div>;
}

export default Signout;
