import Image from "apps/website/components/Image.tsx";
import Icon, { AvailableIcons } from "../ui/Icon.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";

/** @titleBy title */
type Service = {
  title: string;
  icon: AvailableIcons;
  link?: string;
};

/** @titleBy title */
type PartnerAssociation = {
  title: string;
  logo: ImageWidget;
  link?: string;
};

export interface Props {
  bgImage: ImageWidget;
  preHeader: string;
  header: string;
  services: Service[];
  partnerAssociations: PartnerAssociation[];
}

// Make it sure to render it on the server only. DO NOT render it on an island
function Navbar(
  { preHeader, header, services, partnerAssociations, bgImage }: Props,
) {
  return (
    <div
      class="h-full w-full bg-cover bg-center min-h-[87vh]"
      style={`background-image: url(${bgImage});`}
    >
      <div class="container text-white flex flex-col gap-10 items-center py-12">
        <div class="flex flex-col gap-1 items-center max-w-[400px]">
          <span class="text-md text-[#d9d9d9] uppercase">{preHeader}</span>
          <h1 class="text-2xl font-extrabold text-center uppercase">
            {header}
          </h1>
        </div>
        <div class="flex flex-col gap-4 items-center">
          <span class="uppercase">Selecione o serviço que deseja acessar</span>
          <div class="flex flex-wrap gap-2 sm:gap-6 max-w-[580px] justify-center">
            {services.map((service) => (
              <a
                href={service.link}
                class="flex flex-col gap-2 items-center justify-center text-center p-4 h-28 w-40 sm:w-44 text-primary bg-white rounded-md shadow-lg"
              >
                <Icon id={service.icon} size={24} />
                <span class="text-sm">{service.title}</span>
              </a>
            ))}
          </div>
        </div>
        <div class="divider divider-neutral">Associações Parceiras</div>
        <div>
          {partnerAssociations.map((association) => (
            <a
              href={association.link}
              class="flex flex-col gap-2 items-center justify-center text-center p-4 h-24 w-40 sm:w-44 text-primary bg-white rounded-md shadow-lg"
            >
              <Image
                src={association.logo}
                width={128}
                height={32}
                alt="logo associação"
              />
            </a>
          ))}
        </div>
        <div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
