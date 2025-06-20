import { AppContext } from "../../apps/site.ts";
import type { Props as SearchbarProps } from "../../components/search/Searchbar.tsx";
import Drawers from "../../islands/Header/Drawers.tsx";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import type { SiteNavigationElement } from "apps/commerce/types.ts";
import type { SectionProps } from "deco/types.ts";
import Navbar from "./Navbar.tsx";
// import { headerHeight } from "./constants.ts";
import UserAlerts from "deco-sites/ecannadeco/sections/Miscellaneous/UserAlerts.tsx";

export interface Logo {
  src: ImageWidget;
  alt: string;
  width?: number;
  height?: number;
}
export interface Buttons {
  hideSearchButton?: boolean;
  hideAccountButton?: boolean;
  hideWishlistButton?: boolean;
  hideCartButton?: boolean;
}

export interface Props {
  // alerts?: string[];

  /** @title Search Bar */
  searchbar?: Omit<SearchbarProps, "platform">;

  /**
   * @title Navigation items
   * @description Navigation items used both on mobile and desktop menus
   */
  navItems?: SiteNavigationElement[] | null;

  /**
   * @title Public Navigation items
   * @description Navigation items used both on mobile and desktop menus
   */
  publicNavItems?: SiteNavigationElement[] | null;

  /**
   * @title Prescriber Navigation items
   * @description Navigation items used both on mobile and desktop menus
   */
  prescriberNavItems?: SiteNavigationElement[] | null;

  /** @title Logo */
  logo?: Logo;

  logoPosition?: "left" | "center";

  /** @title Logo do Menu */
  logoMenu?: Logo;

  buttons?: Buttons;

  hideHeaderHight?: boolean;
  prescriberAreaDisplay?: boolean;
}

function Header({
  searchbar,
  navItems = [
    {
      "@type": "SiteNavigationElement",
      name: "Feminino",
      url: "/",
    },
    {
      "@type": "SiteNavigationElement",
      name: "Masculino",
      url: "/",
    },
    {
      "@type": "SiteNavigationElement",
      name: "Sale",
      url: "/",
    },
    {
      "@type": "SiteNavigationElement",
      name: "Linktree",
      url: "/",
    },
  ],
  publicNavItems = [
    {
      "@type": "SiteNavigationElement",
      name: "Feminino",
      url: "/",
    },
    {
      "@type": "SiteNavigationElement",
      name: "Masculino",
      url: "/",
    },
    {
      "@type": "SiteNavigationElement",
      name: "Sale",
      url: "/",
    },
    {
      "@type": "SiteNavigationElement",
      name: "Linktree",
      url: "/",
    },
  ],
  prescriberNavItems = [
    {
      "@type": "SiteNavigationElement",
      name: "Feminino",
      url: "/",
    },
    {
      "@type": "SiteNavigationElement",
      name: "Masculino",
      url: "/",
    },
    {
      "@type": "SiteNavigationElement",
      name: "Sale",
      url: "/",
    },
    {
      "@type": "SiteNavigationElement",
      name: "Linktree",
      url: "/",
    },
  ],
  logo = {
    src:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2291/986b61d4-3847-4867-93c8-b550cb459cc7",
    width: 100,
    height: 16,
    alt: "Logo",
  },
  logoMenu,
  hideHeaderHight,
  prescriberAreaDisplay,
}: SectionProps<typeof loader>) {
  const platform = usePlatform();

  return (
    <>
      <header
        class={hideHeaderHight ? "" : "h-[470px] md:h-[420px] lg:h-[390px]"}
      >
        <Drawers
          menu={{
            items: navItems || [],
            publicItems: publicNavItems || [],
            prescriberItems: prescriberNavItems || [],
            logo: logoMenu,
          }}
          searchbar={searchbar}
          platform={platform}
        >
          <div class="bg-base-100 w-full z-50">
            <Navbar logo={logo} prescriberAreaDisplay={prescriberAreaDisplay} />
          </div>
          <UserAlerts />
        </Drawers>
      </header>
    </>
  );
}

export const loader = (props: Props, _req: Request, ctx: AppContext) => {
  return { ...props, device: ctx.device };
};

export default Header;
