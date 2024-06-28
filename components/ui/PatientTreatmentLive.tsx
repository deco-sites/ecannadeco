/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
// import { useUI } from "../../sdk/useUI.ts";
import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import PageWrap from "./PageWrap.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import type { Treatment } from "./PrescriberPatientsLive.tsx";
import TreatmentCard from "deco-sites/ecannadeco/components/ui/TreatmentCardLive.tsx";
import Icon from "./Icon.tsx";
import { useUI } from "../../sdk/useUI.ts";
import ModalVideo from "deco-sites/ecannadeco/components/ui/ModalVideo.tsx";
export type Address = {
  cep: string;
  number: string;
  complement: string;
  addressType: string;
};

function PrescriberPatientTreatments() {
  const [isLoading, setIsLoading] = useState(false);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [currentTreatment, setCurrentTreatment] = useState<Treatment | null>(
    null,
  );
  const { displayVideoModal } = useUI();

  const getTreatments = async (accessToken: string) => {
    setIsLoading(true);
    const response = await invoke[
      "deco-sites/ecannadeco"
    ].actions.getTreatments({
      token: accessToken,
    });
    setIsLoading(false);
    if (response) {
      const treatments = response as Treatment[];
      const currentTreatment = treatments.find((t) => t.isActive) || null;
      const pastTreatments = treatments.filter((t) => !t.isActive);
      setTreatments(pastTreatments);
      setCurrentTreatment(currentTreatment);
    }
  };

  useEffect(() => {
    const accessToken = IS_BROWSER
      ? localStorage.getItem("AccessToken") || ""
      : "";
    getTreatments(accessToken);
  }, []);

  return (
    <PageWrap>
      {isLoading
        ? <span class="loading loading-spinner text-green-600"></span>
        : (
          <div class="flex flex-col gap-3 w-full">
            <div class="flex justify-between mb-8">
              <h3 class="text-2xl text-[#8b8b8b] text-center">
                Meu Tratamento
              </h3>
              <button
                class="btn btn-xs bg-[#d8d8d8] text-[#8c8c8c] border-none"
                onClick={() => (displayVideoModal.value = true)}
              >
                <Icon id="Help" size={19} />
                Como Funciona?
              </button>

              <ModalVideo
                open={displayVideoModal.value}
                onClose={() => (displayVideoModal.value = false)}
                title="Paciente - Como usar?"
                videoURL="https://www.youtube.com/embed/aofqjYZdl3w?si=eI5DxMZ2k9ZCogcS"
              />
            </div>
            <div class="flex flex-col gap-8">
              <div class="flex flex-col gap-4">
                <div>
                  {currentTreatment
                    ? (
                      <>
                        <h3 class="text-sm text-[#8b8b8b] mb-2">
                          Tratamento Vigente
                        </h3>
                        <div>
                          <TreatmentCard
                            treatment={currentTreatment}
                            isPatient={true}
                          />
                        </div>
                      </>
                    )
                    : (
                      <div class="flex flex-col items-center gap-4">
                        <h3 class="text-sm text-[#8b8b8b] mb-2">
                          Você ainda não possui tratamento vigente. Agende uma
                          consulta para iniciar um tratamento com profissional
                          especialista qualificado.
                        </h3>
                        <a href="/consulta-medica">
                          <button class="btn btn-primary text-white w-full">
                            <Icon id="Calendar" size={16} />
                            <span>Agendar Consulta</span>
                          </button>
                        </a>
                      </div>
                    )}
                </div>
                {Boolean(treatments.length) && (
                  <div>
                    <h3 class="text-sm text-[#8b8b8b] mb-2">
                      Tratamentos Antigos
                    </h3>
                    <div class="flex flex-col gap-4">
                      {treatments?.map((t) => {
                        return (
                          <TreatmentCard treatment={t!} isPatient={true} />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
    </PageWrap>
  );
}

export default PrescriberPatientTreatments;
