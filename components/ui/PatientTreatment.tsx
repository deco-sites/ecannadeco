/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
// import { useUI } from "../../sdk/useUI.ts";
import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import PageWrap from "./PageWrap.tsx";
import Icon from "./Icon.tsx";
import { useUI } from "../../sdk/useUI.ts";
import type { DocListType } from "./MyDocs.tsx";
import Modal from "./Modal.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import type { Patient, Treatment } from "./PrescriberPatients.tsx";
import TreatmentCard from "./TreatmentCard.tsx";

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
  const [patient, setpatients] = useState<Patient>(
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
  const [docs, setDocs] = useState<DocListType[]>([]);

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
