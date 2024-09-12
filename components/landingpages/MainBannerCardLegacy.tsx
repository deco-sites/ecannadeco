// import Image from "apps/website/components/Image.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  preTitle: string;
  title: string;
  description?: string;
  ctaText: string;
  mainImage: ImageWidget;
  logo_1?: ImageWidget;
  logo_2?: ImageWidget;
}

// Make it sure to render it on the server only. DO NOT render it on an island
function MainBanner({
  preTitle,
  title,
  description,
  ctaText,
  mainImage,
  logo_1,
  logo_2,
}: // partnerAssociations,
  Props) {
  return (
    <div
      class="w-full bg-cover bg-center"
      style={`background-image: linear-gradient(to bottom, #FFFFFF, #80A5BE 30%, #004B7E);`}
    >
      <div class="container  flex-col-reverse md:flex-row flex py-16 gap-y-8">
        <div class="flex flex-col gap-y-8 px-8 text-white md:max-w-[50%] justify-center items-center sm:items-start">
          {logo_1 && logo_2 && (
            <div class="flex gap-x-8">
              <div class="flex items-center">
                <Image src={logo_1} width={164} height={21} alt="logo ecanna" />
              </div>
              <div class="flex items-center">
                <Image src={logo_2} width={149} height={62} alt="logo cply" />
              </div>
            </div>
          )}
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
