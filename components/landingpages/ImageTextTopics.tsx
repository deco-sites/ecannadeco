// import Image from "apps/website/components/Image.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Icon from "deco-sites/ecannadeco/components/ui/Icon.tsx";

export interface Props {
  title: string;
  description?: string;
  topics: string[];
  ctaText: string;
  mainImage: ImageWidget;
}

// Make it sure to render it on the server only. DO NOT render it on an island
function ImageTextTopics({
  title,
  topics,
  description,
  ctaText,
  mainImage,
}: // partnerAssociations,
  Props) {
  return (
    <div class=" w-full bg-cover bg-center flex">
      <div class="w-[50%] flex justify-end self-end">
        <Image src={mainImage} width={585} height={529} alt="banner image" />
      </div>
      <div class="flex flex-col gap-8 w-[50%] p-16 justify-center">
        <span class="text-3xl text-primary">{title}</span>
        <span class=" text-sm">{description}</span>
        <div class="flex flex-col gap-4">
          {topics.map((t) => {
            return (
              <span class="flex gap-2 items-center">
                <div class="text-primary">
                  <Icon id="HeartBeat" size={24} />
                </div>
                {t}
              </span>
            );
          })}
        </div>
        <a
          href="#planSection"
          class="btn bg-primary rounded-full uppercase text-white max-w-[210px] border-none"
        >
          {ctaText}
        </a>
      </div>
    </div>
  );
}

export default ImageTextTopics;
