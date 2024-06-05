/**
 * This component was made to control if user is logged in to access pages
 */
import PageWrap from "../../components/ui/PageWrap.tsx";
import {
  PartnerAssociation,
  Service,
} from "../landingpages/PatientServicesLP.tsx";
import Icon from "../ui/Icon.tsx";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  services: Service[];
  partnerAssociations: PartnerAssociation[];
}

function PatientDashboard({ services, partnerAssociations }: Props) {
  return (
    <PageWrap>
      <div class="flex flex-col gap-5 w-full">
        <div class="flex justify-center">
          <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
            Painel do Paciente
          </h3>
        </div>
        <div class="flex flex-col gap-4 items-center">
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
        <div class="divider divider-black">Associações Parceiras</div>
        <div class="flex justify-center">
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
      </div>
    </PageWrap>
  );
}

export default PatientDashboard;
