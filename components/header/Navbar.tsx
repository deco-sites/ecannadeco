import { MenuButton } from "../../islands/Header/Buttons.tsx";
import Image from "apps/website/components/Image.tsx";
import { navbarHeight } from "./constants.ts";
import { Logo } from "../../components/header/Header.tsx";

// Make it sure to render it on the server only. DO NOT render it on an island
function Navbar(
  { logo }: {
    logo?: Logo;
  },
) {
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
