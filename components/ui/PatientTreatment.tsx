/**
 * This component was made to control if user is logged in to access pages
 */
import { useState } from "preact/hooks";
import PageWrap from "./PageWrap.tsx";
import type { Patient } from "./PrescriberPatients.tsx";
import TreatmentCard from "./TreatmentCard.tsx";

export type Address = {
  cep: string;
  number: string;
  complement: string;
  addressType: string;
};

function PrescriberPatientTreatments() {
  const [isLoading, _setIsLoading] = useState(false);
  const [patient, _setpatients] = useState<Patient>(
    {
      name: "Célio Marcos",
      email: "celiomarcos@email.com",
      treatments: [
        {
          updated_at: "2024-05-14T14:29:09.024+00:00",
          feedback: "positive",
          medication: [
            {
              name: "CBD 3000mg - Abrapango",
              dosage: "3 gotas 2x/ dia",
            },
            {
              name: "THC 3000mg - Abrapango",
              dosage: "3 gotas 2x/ dia",
            },
          ],
          current: true,
          prescriber: {
            name: "Dra. Endy Lacet",
            registryType: "CRO",
            registryUF: "DF",
            registry: "0000000",
          },
        },
        {
          updated_at: "2024-05-13T14:29:09.024+00:00",
          feedback: "negative",
          medication: [
            {
              name: "CBD 3000mg - Abrapango",
              dosage: "3 gotas 2x/ dia",
            },
            {
              name: "THC 3000mg - Abrapango",
              dosage: "3 gotas 2x/ dia",
            },
          ],
          current: false,
          prescriber: {
            name: "Dra. Endy Lacet",
            registryType: "CRO",
            registryUF: "DF",
            registry: "0000000",
          },
        },
        {
          updated_at: "2024-05-13T14:29:09.024+00:00",
          feedback: "negative",
          medication: [
            {
              name: "CBD 3000mg - Abrapango",
              dosage: "3 gotas 2x/ dia",
            },
            {
              name: "THC 3000mg - Abrapango",
              dosage: "3 gotas 2x/ dia",
            },
          ],
          current: false,
          prescriber: {
            name: "Dra. Endy Lacet",
            registryType: "CRO",
            registryUF: "DF",
            registry: "0000000",
          },
        },
      ],
    },
  );

  const currentTreatment = patient.treatments?.find((t) => t.current === true);
  const oldTreatments = patient.treatments?.filter((t) => t.current !== true);

  return (
    <PageWrap>
      {isLoading
        ? <span class="loading loading-spinner text-green-600"></span>
        : (
          <div class="flex flex-col gap-3 w-full">
            <div class="flex justify-center">
              <h3 class="text-2xl text-[#8b8b8b] text-center mb-8">
                Meu Tratamento
              </h3>
            </div>
            <div class="flex flex-col gap-8">
              <div>
                <h3 class="text-sm text-[#8b8b8b] mb-2">
                  Tratamento Vigente
                </h3>
                <div>
                  <TreatmentCard treatment={currentTreatment!} />
                </div>
              </div>
              <div>
                <h3 class="text-sm text-[#8b8b8b] mb-2">
                  Tratamentos Antigos
                </h3>
                <div class="flex flex-col gap-4">
                  {oldTreatments?.map((t) => {
                    return <TreatmentCard treatment={t!} />;
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
    </PageWrap>
  );
}

export default PrescriberPatientTreatments;
