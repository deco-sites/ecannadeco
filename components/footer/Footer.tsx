import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import AlertInfo from "../../islands/AlertInfo.tsx";
export interface Props {
  logo?: {
    image: ImageWidget;
    alt: string;
    height: number;
    width: number;
  };
  text: string;
  hideMarginTop?: boolean;
}

function Footer({ logo, text, hideMarginTop }: Props) {
  return (
    <>
      <AlertInfo />
      <footer>
        <div
          class={`bg-[#eeeeee] flex justify-center items-center bottom-0 w-full p-4 gap-5 ${
            !hideMarginTop && "mt-20"
          }`}
        >
          <Image
            loading="lazy"
            src={logo?.image || ""}
            alt={logo?.alt}
            width={logo?.width || 200}
            height={logo?.height || 200}
          />
          <span class="text-[#9b9b9b] text-xs">{text}</span>
        </div>
      </footer>
    </>
  );
}

export default Footer;
