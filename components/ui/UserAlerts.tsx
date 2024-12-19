/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
// import { useUI } from "../../sdk/useUI.ts";
import { useUI } from "../../sdk/useUI.ts";
import Icon from "../../components/ui/Icon.tsx";

function PrivatePageControl() {
  const { updatedData, uploadedFile, hasFreeCard } = useUI();

  if (!updatedData.value) {
    return (
      <div class="flex w-full justify-center mb-5">
        <div
          role="alert"
          class="alert bg-[#6D4799] text-white w-[90%] sm:max-w-[800px]"
        >
          <Icon id="UserData" size={24} />
          <span>
            Preencha seus dados para gerar sua identificação de paciente de
            cannabis medicinal
          </span>
        </div>
      </div>
    );
  } else if (!uploadedFile.value) {
    return (
      <div class="flex w-full justify-center mb-5">
        <div
          role="alert"
          class="alert bg-[#6D4799] text-white w-[90%] sm:max-w-[800px]"
        >
          <Icon id="Anexo" size={24} />
          <span>
            Suba ao menos um documento para estar atrelado à sua identificação
            de paciente de cannabis
          </span>
        </div>
      </div>
    );
  } else if (hasFreeCard.value) {
    return (
      <a
        href="/minha-carteirinha#viaFisica"
        class="flex w-full justify-center mb-5"
      >
        <div
          role="alert"
          class="alert bg-[#2a9632] text-white w-[90%] sm:max-w-[800px]"
        >
          <Icon id="CardID" size={24} />
          <span>
            Você ainda não pediu a via física da sua carteirinha. Clique no
            botão "Pedir Via física"
          </span>
        </div>
      </a>
    );
  } else {
    // return null;
    return (
      <div class="flex w-full justify-center mb-5">
        <div
          role="alert"
          class="alert bg-[#c40000] text-white w-[90%] sm:max-w-[800px]"
        >
          <Icon id="Christmas" size={33} />
          <span>
            Atenção! Entraremos em recesso a partir do dia{" "}
            <span class="font-bold">23/12/2024</span> até o dia{" "}
            <span class="font-bold">06/01/2025</span>. Portanto, pedidos de
            carteirinhas físicas realizados{" "}
            <span class="font-bold">após 11h do dia 23/12</span>{" "}
            serão enviados a partir do dia{" "}
            <span class="font-bold">07/01/2025</span>. Desejamos a todos um
            feliz natal e um feliz ano novo!
          </span>
        </div>
      </div>
    );
  }
}

export default PrivatePageControl;
