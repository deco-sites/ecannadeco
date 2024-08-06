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
      class="w-full bg-cover bg-center"
      style={`background-image: linear-gradient(to bottom, #004B7E, #38769d);`}
    >
      <div class="container  flex-col-reverse md:flex-row flex py-16 gap-y-8">
        <div class="flex flex-col gap-y-8 px-8 text-white md:max-w-[50%] justify-center items-center sm:items-start">
          <div class="flex flex-col gap-2">
            <span class="uppercase text-sm font-bold">{preTitle}</span>
            <span class="text-3xl lg:text-5xl">{title}</span>
          </div>
          <span class=" text-sm">{description}</span>
          <a
            href="#planSection"
            class="btn bg-primary rounded-full uppercase text-white max-w-[310px] border-none"
          >
            {ctaText}
          </a>
        </div>
        <div class="flex w-full md:w-[50%] justify-center">
          <Image
            class="max-w-[500px] "
            style={{ aspectRatio: "312 / 421" }}
            src={mainImage}
            width={312}
            height={421}
            alt="banner image"
          />
        </div>
      </div>
    </div>
  );
}

export default MainBanner;
