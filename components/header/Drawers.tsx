import type { Props as MenuProps } from "../../components/header/Menu.tsx";
import type { Props as SearchbarProps } from "../../components/search/Searchbar.tsx";
import Button from "../../components/ui/Button.tsx";
import Drawer from "../../components/ui/Drawer.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { useUI } from "../../sdk/useUI.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import type { ComponentChildren } from "preact";
import { lazy, Suspense } from "preact/compat";
import type { Logo } from "./Header.tsx";
import Image from "apps/website/components/Image.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect } from "preact/hooks";
import { decodeBase64 } from "base64";

const Menu = lazy(() => import("../../components/header/Menu.tsx"));
const Searchbar = lazy(() => import("../../components/search/Searchbar.tsx"));

export interface Props {
  menu: MenuProps;
  searchbar?: SearchbarProps;
  /**
   * @ignore_gen true
   */
  children?: ComponentChildren;
  platform: ReturnType<typeof usePlatform>;
}

const Aside = ({
  logo,
  title,
  onClose,
  children,
}: {
  logo?: Logo;
  title: string;
  onClose?: () => void;
  children: ComponentChildren;
}) => (
  <div class="bg-base-100 grid grid-rows-[auto_1fr] h-full divide-y max-w-[100vw]">
    <div class="flex justify-between items-center">
      <h1 class="px-4 py-3">
        {logo
          ? (
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 100}
              height={logo.height || 13}
            />
          )
          : <span class="font-medium text-2xl">{title}</span>}
      </h1>
      {onClose && (
        <Button aria-label="X" class="btn btn-ghost" onClick={onClose}>
          <Icon id="XMark" size={24} strokeWidth={2} />
        </Button>
      )}
    </div>
    <Suspense
      fallback={
        <div class="w-screen flex items-center justify-center">
          <span class="loading loading-ring" />
        </div>
      }
    >
      {children}
    </Suspense>
  </div>
);

function Drawers({ menu, searchbar, children }: Props) {
  const { displayMenu, displaySearchDrawer } = useUI();

  useEffect(() => {
    if (IS_BROWSER) {
      const params = new URLSearchParams(globalThis.location.search);

      const pathname = globalThis.location.pathname;

      let ref = undefined;
      let cnpj = undefined;
      let code = undefined;

      if (pathname === "/legacy") {
        ref = "Legacy";
        cnpj = params.get("cnpj");
        code = params.get("code");

        console.log({ cnpj, code });

        if (code) {
          const decodedCode = decodeBase64(code);
          const cpf = new TextDecoder().decode(decodedCode);
          console.log({ cpf });
          localStorage.setItem("legacyPatientCPF", cpf);
        }

        if (cnpj) {
          localStorage.setItem("legacyAssociationCNPJ", cnpj);
        }
      } else {
        ref = params.get("ref");
      }

      console.log({ ref });

      if (ref) {
        localStorage.setItem("referral", ref);
      }
    }
  }, []);

  //if user is not loggedin, use the public navitems in the menu
  if (IS_BROWSER) {
    if (
      localStorage.getItem("PrescriberAccessToken") &&
      localStorage.getItem("PrescriberAccessToken") != ""
    ) {
      menu.items = menu.prescriberItems || [];
    } else if (
      !localStorage.getItem("AccessToken") ||
      localStorage.getItem("AccessToken") == ""
    ) {
      menu.items = menu.publicItems || [];
    } else if (
      localStorage.getItem("AssociationAdmin") &&
      localStorage.getItem("AssociationAdmin") != ""
    ) {
      if (!menu.items.find((i) => i.name === "Admin Associação")) {
        menu.items[menu.items.length] = {
          "@type": "SiteNavigationElement",
          name: "Admin Associação",
          url: "/admin/associacao",
        };
      }
    }

    //disable menu items for treatment plan
    if (localStorage.getItem("currentPatientPlan") == "TREATMENT") {
      const updatedElements = menu.items.map((element) => {
        if (
          element.url === "/meus-dados" ||
          element.url === "/minha-carteirinha" ||
          element.url === "/meus-documentos" ||
          element.url === "/meus-pedidos"
        ) {
          return {
            ...element,
            disabled: true,
          };
        }
        return element;
      });
      menu.items = updatedElements;
    }
  }

  return (
    <>
      <Drawer
        open={displayMenu.value || displaySearchDrawer.value}
        class="drawer-end z-10"
        onClose={() => {
          displayMenu.value = false;
          displaySearchDrawer.value = false;
        }}
        aside={
          <Aside
            onClose={() => {
              displayMenu.value = false;
              displaySearchDrawer.value = false;
            }}
            logo={menu.logo}
            title={displayMenu.value ? "Menu" : "Buscar"}
          >
            {displayMenu.value && <Menu {...menu} />}
            {searchbar && displaySearchDrawer.value && (
              <div class="w-screen">
                <Searchbar {...searchbar} />
              </div>
            )}
          </Aside>
        }
      >
        {children}
      </Drawer>
      {
        /* <Drawer // right drawer
        class="drawer-end"
        open={displayCart.value !== false}
        onClose={() => displayCart.value = false}
        aside={
          <Aside
            title="Minha sacola"
            onClose={() => displayCart.value = false}
          >
            <Cart platform={platform} />
          </Aside>
        }
      >
        {children}
      </Drawer> */
      }
    </>
  );
}

export default Drawers;
