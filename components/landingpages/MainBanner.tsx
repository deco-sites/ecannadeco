// import Image from "apps/website/components/Image.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  preTitle: string;
  title: string;
  description?: string;
  ctaText: string;
  mainImage: ImageWidget;
}

// Make it sure to render it on the server only. DO NOT render it on an island
function MainBanner({
  preTitle,
  title,
  description,
  ctaText,
  mainImage,
}: // partnerAssociations,
Props) {
  return (
    <div
      class="h-[486px] w-full bg-cover bg-center flex-col sm:flex"
      style={`background-image: linear-gradient(to bottom, #004B7E, #ffffff);`}
    >
      <div class="flex flex-col gap-8 text-white max-w-[50%] m-16 justify-center">
        <div class="flex flex-col gap-2">
          <span class="uppercase text-sm font-bold">{preTitle}</span>
          <span class="text-5xl">{title}</span>
        </div>
        <span class=" text-sm">{description}</span>
        <a
          href="#planSection"
          class="btn bg-primary rounded-full uppercase text-white max-w-[210px] border-none"
        >
          {ctaText}
        </a>
      </div>
      <div class="absolute right-0">
        <Image src={mainImage} width={497} height={508} alt="banner image" />
      </div>
    </div>
  );
}

export default MainBanner;
