// import Image from "apps/website/components/Image.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  title: string;
  steps: string[];
  ctaText: string;
  mainImage: ImageWidget;
}

// Make it sure to render it on the server only. DO NOT render it on an island
function ImageSteps({
  title,
  steps,
  ctaText,
  mainImage,
}: // partnerAssociations,
  Props) {
  return (
    <div
      class=" w-full bg-cover bg-center flex justify-center"
      style={`background-image: linear-gradient(to bottom, #1677B9, #0A3553);`}
    >
      <div class="flex flex-col sm:flex-row gap-8 p-10 sm:p-16 justify-center">
        <div class="flex flex-col gap-4 text-white">
          <span class="text-3xl">{title}</span>
          <div class="flex flex-col gap-5">
            {steps.map((t, i) => {
              return (
                <div
                  class={`flex items-center ${i === 1 && "sm:ml-[60px]"} ${
                    i === 2 && "sm:ml-[120px]"
                  } gap-2`}
                >
                  <span class="text-[90px] font-bold">{i + 1}</span>
                  <span class="text-4xl max-w-[320px] font-light">{t}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div class="flex flex-col justify-center items-center sm:justify-end self-end sm:items-end gap-7">
          <Image src={mainImage} width={468} height={349} alt="banner image" />
          <a
            href="#planSection"
            class="btn bg-primary rounded-full uppercase text-white max-w-[300px] border-none"
          >
            {ctaText}
          </a>
        </div>
      </div>
    </div>
  );
}

export default ImageSteps;
