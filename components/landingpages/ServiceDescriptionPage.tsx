import Icon, { AvailableIcons } from "../ui/Icon.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  bgImage: ImageWidget;
  icon?: AvailableIcons;
  image?: ImageWidget;
  header: string;
  /**@format html */
  text: string;
  ctaText: string;
}

// Make it sure to render it on the server only. DO NOT render it on an island
function Navbar(
  { icon, image, header, text, ctaText, bgImage }: Props,
) {
  return (
    <div
      class="h-full w-full bg-cover bg-center min-h-[87vh]"
      style={`background-image: url(${bgImage});`}
    >
      <div class="container text-white flex flex-col gap-10 items-center py-12">
        <div class="flex flex-col gap-10 items-center max-w-[400px]">
          <div class="w-full flex">
            <button
              class="btn btn-sm btn-ghost text-white"
              onClick={() => window.history.back()}
            >
              <Icon id="GoBack" size={19} />
            </button>
          </div>
          {icon ? <Icon id={icon} size={56} /> : (
            image && (
              <Image
                src={image}
                width={367}
                height={110}
                alt="imagem associação"
              />
            )
          )}
          <h1 class="text-2xl font-extrabold text-center uppercase">
            {header}
          </h1>
          <div
            class="text-center text-white [&_ul]:list-disc [&_ul]:text-left"
            dangerouslySetInnerHTML={{ __html: text }}
          />
          <button class="btn bg-white text-primary uppercase">{ctaText}</button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
