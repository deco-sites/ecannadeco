// import Image from "apps/website/components/Image.tsx";
import Icon, { AvailableIcons } from "../ui/Icon.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";

/** @titleBy title */
export type Service = {
  title: string;
  icon: AvailableIcons;
  link?: string;
  description?: string;
  ctaText?: string;
  serviceLabel?: string;
};

/** @titleBy title */
export type PartnerAssociation = {
  title: string;
  logo: ImageWidget;
  link?: string;
  description?: string;
  ctaText?: string;
  serviceLabel?: string;
};

export interface Props {
  bgImage?: ImageWidget;
  preHeader: string;
  header: string;
  services: Service[];
  partnerAssociations: PartnerAssociation[];
}

// Make it sure to render it on the server only. DO NOT render it on an island
function Navbar({
  preHeader,
  header,
  services,
}: // partnerAssociations,
  Props) {
  const handleClick = ({ serviceLabel }: { serviceLabel: string }) => {
    if (IS_BROWSER) {
      localStorage.setItem("servicePipeline", serviceLabel);
    }

    if (serviceLabel == "carteirinha") {
      alert(
        `Estamos quase lá! Finalize o cadastro (menos de 1 minuto), e siga os passos para adquirir sua carteirinha`,
      );
    } else if (serviceLabel == "abrapango") {
      alert(
        `Estamos quase lá! Finalize o cadastro (menos de 1 minuto), que nossa equipe entrará em contato para conduzir seu processo de afiliação`,
      );
    } else if (serviceLabel == "anvisa") {
      alert(
        `Estamos quase lá! Finalize o cadastro (menos de 1 minuto), e siga os passos para conseguir sua autorização da Anvisa`,
      );
    } else {
      alert(
        `Estamos quase lá! Finalize o cadastro (menos de 1 minuto), que nossa equipe entrará em contato para conduzir seu processo de ${header}`,
      );
    }
    window.location.href = "/cadastrar";
  };

  return (
    <div
      class="h-full w-full bg-cover bg-center min-h-[87vh]"
      style={`background-image: linear-gradient(to bottom, #0098ff, #022a38);`}
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
          <div class="flex flex-wrap gap-6 max-w-[580px] justify-center">
            {services.map((service) => (
              <div class="flex flex-col cursor-pointer gap-2 items-center justify-center text-center p-4 h-76 sm:h-72 w-40 sm:w-44 text-primary bg-white rounded-md shadow-lg">
                <div class="flex flex-col items-center">
                  <Icon id={service.icon} size={24} />
                  <span class="text-sm h-9 flex items-center font-semibold">
                    {service.title}
                  </span>
                </div>
                <span class="text-xs text-[#444444] h-40 sm:h-36">
                  {service.description}
                </span>
                <button
                  class="btn btn-sm btn-primary text-white mt-2 rounded-full w-full"
                  onClick={() =>
                    handleClick({ serviceLabel: service.serviceLabel! })}
                >
                  {service.ctaText}
                </button>
              </div>
            ))}
          </div>
        </div>
        {
          /* <div class="divider divider-neutral">Associações Parceiras</div>
        <div>
          {partnerAssociations.map((association) => (
            <div class="flex flex-col cursor-pointer gap-2 items-center justify-center text-center p-4 h-76 sm:h-72 w-40 sm:w-44 text-primary bg-white rounded-md shadow-lg">
              <div class="flex flex-col items-center">
                <Image
                  src={association.logo}
                  width={128}
                  height={32}
                  alt="logo associação"
                />
              </div>
              <span class="text-xs text-[#444444] h-40 sm:h-36">
                {association.description}
              </span>
              <button
                class="btn btn-sm btn-primary text-white mt-2 rounded-full w-full"
                onClick={() =>
                  handleClick({ serviceLabel: association.serviceLabel! })}
              >
                {association.ctaText}
              </button>
            </div>
          ))}
        </div> */
        }
        <div></div>
      </div>
    </div>
  );
}

export default Navbar;
