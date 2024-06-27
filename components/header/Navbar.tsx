import { MenuButton } from "../../islands/Header/Buttons.tsx";
import Image from "apps/website/components/Image.tsx";
import { navbarHeight } from "./constants.ts";
import { Logo } from "../../components/header/Header.tsx";
import Icon from "../ui/Icon.tsx";

// Make it sure to render it on the server only. DO NOT render it on an island
function Navbar({
  logo,
  prescriberAreaDisplay,
}: {
  logo?: Logo;
  prescriberAreaDisplay?: boolean;
}) {
  return (
    <div
      style={{ height: navbarHeight }}
      class="flex justify-between items-center w-full px-6 bg-primary"
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
      <div class="flex gap-2 sm:gap-4 items-center">
        {prescriberAreaDisplay && (
          <a
            class="btn btn-xs text-primary bg-white rounded-full"
            href="/prescritor"
          >
            <Icon id="Medical" size={16} />
            <span class="flex gap-1">
              <span class="hidden sm:block">Área do</span>Prescritor
            </span>
          </a>
        )}
        <MenuButton />
      </div>
    </div>
  );
}

export default Navbar;
