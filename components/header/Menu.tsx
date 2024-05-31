import Icon from "../../components/ui/Icon.tsx";
import type { Logo } from "./Header.tsx";
import type { SiteNavigationElement } from "apps/commerce/types.ts";

interface ExtendedSiteNavigationElement extends SiteNavigationElement {
  disabled?: boolean;
}

export interface Props {
  items: ExtendedSiteNavigationElement[];
  publicItems?: ExtendedSiteNavigationElement[];
  prescriberItems?: ExtendedSiteNavigationElement[];
  logo?: Logo;
}

function MenuItem({ item }: { item: ExtendedSiteNavigationElement }) {
  return (
    <a href={item.disabled ? "/minha-conta" : item.url}>
      <div class="p-5 border-b border-[#d5d5d5]">
        <span class={`uppercase ${item.disabled && "opacity-40"}`}>
          {item.name}
        </span>
      </div>
    </a>
    // <div class="collapse collapse-plus">
    //   <input type="checkbox" />
    //   <div class="collapse-title">{item.name}</div>
    //   <div class="collapse-content">
    //     <ul>
    //       <li>
    //         <a class="underline text-sm" href={item.url}>Ver todos</a>
    //       </li>
    //       {item.children?.map((node) => (
    //         <li>
    //           <MenuItem item={node} />
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // </div>
  );
}

function Menu({ items }: Props) {
  return (
    <div class="flex flex-col h-full">
      <ul class="px-4 flex-grow flex flex-col divide-y divide-base-200">
        {items.map((item) => (
          <li>
            <MenuItem item={item} />
          </li>
        ))}
      </ul>
      {
        /*
      <ul class="flex flex-col py-2 bg-base-200">
        <li>
          <a
            class="flex items-center gap-4 px-4 py-2"
            href="/wishlist"
          >
            <Icon id="Heart" size={24} strokeWidth={2} />
            <span class="text-sm">Lista de desejos</span>
          </a>
        </li>
        <li>
          <a
            class="flex items-center gap-4 px-4 py-2"
            href="https://www.deco.cx"
          >
            <Icon id="MapPin" size={24} strokeWidth={2} />
            <span class="text-sm">Nossas lojas</span>
          </a>
        </li>
        <li>
          <a
            class="flex items-center gap-4 px-4 py-2"
            href="https://www.deco.cx"
          >
            <Icon id="Phone" size={24} strokeWidth={2} />
            <span class="text-sm">Fale conosco</span>
          </a>
        </li>
        <li>
          <a
            class="flex items-center gap-4 px-4 py-2"
            href="https://www.deco.cx"
          >
            <Icon id="User" size={24} strokeWidth={2} />
            <span class="text-sm">Minha conta</span>
          </a>
        </li>
      </ul> */
      }
    </div>
  );
}

export default Menu;
