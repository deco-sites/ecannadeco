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
      <footer class="bg-[#eeeeee] flex-col sm:flex-row">
        <div
          class={`flex justify-center items-center bottom-0 w-full p-4 gap-5 ${
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
        <div class="flex flex-col text-center justify-center items-center bottom-0 w-full p-2 gap-2">
          <span class="text-[#9b9b9b] text-[10px]">
            St. de Habitações Coletivas e Geminadas Norte 708 Bloco G Loja 7 -
            Asa Norte, Brasília - DF, 70740-557
          </span>
          <span class="text-[#9b9b9b] text-[10px]">
            administrador@ecanna.com.br
          </span>
          <span class="text-[#9b9b9b] text-[10px]">(61) 92002-2697</span>
        </div>
      </footer>
    </>
  );
}

export default Footer;
