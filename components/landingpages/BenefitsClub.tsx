// import Image from "apps/website/components/Image.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  title: string;
  description?: string;
  ctaText: string;
  Brands: ImageWidget[];
}

// Make it sure to render it on the server only. DO NOT render it on an island
function BenefitsClub({
  title,
  description,
  ctaText,
  Brands,
}: // partnerAssociations,
  Props) {
  return (
    <>
      <div class="w-full bg-cover bg-center text-primary">
        <div class="container flex-col flex px-10 py-16 gap-y-10">
          <span class="text-3xl font-bold">{title}</span>
          <div class="flex flex-col md:flex-row gap-8 justify-between">
            <div class="grid grid-cols-4 gap-4 justify-center items-center sm:items-start">
              {Brands.map((b) => {
                return (
                  <div class="flex justify-center">
                    <Image
                      style={{ aspectRatio: "80 / 80" }}
                      src={b}
                      width={80}
                      height={80}
                      alt="partner benefit logo"
                    />
                  </div>
                );
              })}
            </div>
            <div class="flex flex-col w-full md:w-[50%] gap-8">
              <span class="leading-8 text-xl">{description}</span>
              <a
                href="#planSection"
                class="btn bg-primary rounded-full uppercase text-white max-w-[310px] border-none"
              >
                {ctaText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BenefitsClub;
