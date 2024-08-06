// import Image from "apps/website/components/Image.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  title: string;
  description?: string;
  ctaText: string;
  mainImage: ImageWidget;
}

// Make it sure to render it on the server only. DO NOT render it on an island
function ImageTextTopics({
  title,
  description,
  ctaText,
  mainImage,
}: // partnerAssociations,
  Props) {
  return (
    <div
      class=" w-full bg-cover bg-center flex flex-col sm:flex-row justify-between items-center gap-8 text-white"
      style={`background-image: linear-gradient(to bottom, #0A3553, #1677B9);`}
    >
      <div class="w-full sm:w-[50%] flex justify-start self-end">
        <Image src={mainImage} width={529} height={426} alt="banner image" />
      </div>
      <div class="flex flex-col gap-8 p-16 justify-center">
        <span class="text-3xl text-white">{title}</span>
        <span class=" text-sm">{description}</span>

        <a
          href="#planSection"
          class="btn bg-white text-primary rounded-full uppercase max-w-[310px] border-none"
        >
          {ctaText}
        </a>
      </div>
    </div>
  );
}

export default ImageTextTopics;
