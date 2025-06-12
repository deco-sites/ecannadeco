/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
// import { useUI } from "../../sdk/useUI.ts";
// import { useUI } from "../../sdk/useUI.ts";
// import Icon from "../../components/ui/Icon.tsx";

function PrivatePageControl() {
  // const { updatedData, uploadedFile, hasFreeCard } = useUI();

  return (
    <div class="flex w-full justify-center mb-5">
      <div
        role="alert"
        class="alert bg-[#ed9400] text-white w-[90%] sm:max-w-[800px]"
      >
        <span>
          <div class="flex flex-col gap-2">
            <span class="text-center font-bold text-lg">
              AVISO DE ENCERRAMENTO
            </span>
            <span class="text-xs">
              Há cerca de dois anos, iniciamos nosso projeto com um propósito
              claro: oferecer mais segurança e legitimidade aos pacientes de
              cannabis no Brasil, por meio de uma carteirinha que reúne
              documentos essenciais como prescrições médicas, laudos e decisões
              judiciais. Ao longo desse tempo, vivemos muitos aprendizados,
              parcerias e conquistas que nos enchem de orgulho.
            </span>
            <span class="text-xs">
              {" "}
              Agora, entendemos que é hora de encerrar este ciclo para dar
              espaço a novos caminhos. Não se trata de crises ou conflitos, mas
              sim de reconhecer que o momento pede renovação.{" "}
            </span>
            <span class="text-xs">
              As operações do ecanna serão encerradas oficialmente no dia 11 de
              agosto de 2025 (por mais 60 dias). Até lá, os QR Codes das
              carteirinhas seguirão ativos normalmente. Nosso sincero
              agradecimento a todos os pacientes, clientes, associações,
              parceiros e amigos que acreditaram nesse projeto e caminharam
              conosco.{" "}
            </span>
            <span class="text-xs">
              Que os próximos passos nos reconectem com ainda mais força e
              propósito.
            </span>
            <span class="text-xs">Com carinho,</span>
            <span class="text-xs">Equipe ecanna - 12 de Junho de 2025</span>
          </div>
        </span>
      </div>
    </div>
  );

  // if (!updatedData.value) {
  //   return (
  //     <div class="flex w-full justify-center mb-5">
  //       <div
  //         role="alert"
  //         class="alert bg-[#6D4799] text-white w-[90%] sm:max-w-[800px]"
  //       >
  //         <Icon id="UserData" size={24} />
  //         <span>
  //           Preencha seus dados para gerar sua identificação de paciente de
  //           cannabis medicinal
  //         </span>
  //       </div>
  //     </div>
  //   );
  // } else if (!uploadedFile.value) {
  //   return (
  //     <div class="flex w-full justify-center mb-5">
  //       <div
  //         role="alert"
  //         class="alert bg-[#6D4799] text-white w-[90%] sm:max-w-[800px]"
  //       >
  //         <Icon id="Anexo" size={24} />
  //         <span>
  //           Suba ao menos um documento para estar atrelado à sua identificação
  //           de paciente de cannabis
  //         </span>
  //       </div>
  //     </div>
  //   );
  // } else if (hasFreeCard.value) {
  //   return (
  //     <a
  //       href="/minha-carteirinha#viaFisica"
  //       class="flex w-full justify-center mb-5"
  //     >
  //       <div
  //         role="alert"
  //         class="alert bg-[#2a9632] text-white w-[90%] sm:max-w-[800px]"
  //       >
  //         <Icon id="CardID" size={24} />
  //         <span>
  //           Você ainda não pediu a via física da sua carteirinha. Clique no
  //           botão "Pedir Via física"
  //         </span>
  //       </div>
  //     </a>
  //   );
  // } else {
  //   return null;
  // }
}

export default PrivatePageControl;
