import type { Props as SearchbarProps } from "../../components/search/Searchbar.tsx";
import { MenuButton, SearchButton } from "../../islands/Header/Buttons.tsx";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import NavItem from "./NavItem.tsx";
import { navbarHeight } from "./constants.ts";
import { Buttons, Logo } from "../../components/header/Header.tsx";

// Make it sure to render it on the server only. DO NOT render it on an island
function Navbar(
  { items, searchbar, logo, buttons, logoPosition = "left", device }: {
    items: SiteNavigationElement[];
    searchbar?: SearchbarProps;
    logo?: Logo;
    buttons?: Buttons;
    logoPosition?: "left" | "center";
    device: "mobile" | "desktop" | "tablet";
  },
) {
  const platform = usePlatform();

  return (
    <div
      style={{ height: navbarHeight }}
      class="flex justify-between items-center border-b border-base-200 w-full px-6 bg-primary"
    >
      {logo && (
        <a
          href="/"
          class="inline-flex items-center justify-center"
          style={{ minHeight: navbarHeight }}
          aria-label="Store logo"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width || 100}
            height={logo.height || 13}
          />
        </a>
      )}
      <MenuButton />
    </div>
  );
}

export default Navbar;
