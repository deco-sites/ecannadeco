// import Image from "apps/website/components/Image.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  ecannaLogo: ImageWidget;
  title: string;
  description?: string;
  ctaText: string;
  mainImage: ImageWidget;
}

// Make it sure to render it on the server only. DO NOT render it on an island
function MainBanner({
  ecannaLogo,
  title,
  description,
  ctaText,
  mainImage,
}: // partnerAssociations,
  Props) {
  return (
    <div
      class="container rounded-lg max-w-[90%]"
      style={`background-image: linear-gradient(to bottom, #004B7E, #38769d);`}
    >
      <div class="container  flex-col-reverse md:flex-row flex py-16 gap-y-8">
        <div class="flex flex-col gap-y-8 px-8 text-white md:max-w-[50%] justify-center items-center sm:items-start">
          <div class="flex flex-col gap-8">
            <Image
              class="object-contain"
              src={ecannaLogo}
              width={150}
              alt="banner image"
            />
            <span class="text-3xl lg:text-5xl">{title}</span>
          </div>
          <span class=" text-sm">{description}</span>
          <a
            href="/minha-conta"
            class="btn bg-white text-primary rounded-full uppercase max-w-[310px] border-none"
          >
            {ctaText}
          </a>
        </div>
        <div class="flex w-full md:w-[50%] justify-center p-3">
          <Image
            class="object-contain"
            src={mainImage}
            width={330}
            alt="banner image"
          />
        </div>
      </div>
    </div>
  );
}

export default MainBanner;
