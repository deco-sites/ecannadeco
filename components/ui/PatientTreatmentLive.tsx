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
export type Address = {
  cep: string;
  number: string;
  complement: string;
  addressType: string;
};

const timeAgo = (date: Date): string => {
  const seconds = Math.floor((Number(new Date()) - +date) / 1000); // Explicitly convert to number
  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1) return `${interval}a atrás`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval}m atrás`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval}d atrás`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval}h atrás`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval}min atrás`;
  return `${Math.floor(seconds)}seg atrás`;
};

function PrescriberPatientTreatments() {
  const [isLoading, setIsLoading] = useState(false);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [currentTreatment, setCurrentTreatment] = useState<Treatment | null>(
    null,
  );

  const getTreatments = async (
    accessToken: string,
  ) => {
    setIsLoading(true);
    const response = await invoke["deco-sites/ecannadeco"].actions
      .getTreatments({
        token: accessToken,
      });
    setIsLoading(false);
    console.log({ responseTreatments: response });
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
      ? (localStorage.getItem("AccessToken") || "")
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
            </div>
            <div class="flex flex-col gap-8">
              <div class="flex flex-col gap-4">
                <div>
                  <h3 class="text-sm text-[#8b8b8b] mb-2">
                    Tratamento Vigente
                  </h3>
                  <div>
                    {currentTreatment && (
                      <TreatmentCard
                        treatment={currentTreatment!}
                        isPatient={true}
                      />
                    )}
                  </div>
                </div>
                <div>
                  <h3 class="text-sm text-[#8b8b8b] mb-2">
                    Tratamentos Antigos
                  </h3>
                  <div class="flex flex-col gap-4">
                    {treatments && (
                      treatments?.map((t) => {
                        return (
                          <TreatmentCard treatment={t!} isPatient={true} />
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </PageWrap>
  );
}

export default PrescriberPatientTreatments;
