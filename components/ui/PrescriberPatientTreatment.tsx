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
import PrescriberUpdateTreatmentModal from "deco-sites/ecannadeco/islands/PrescriberUpdateTreatmentModal.tsx";

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

const TreatmentCard = ({ treatment }: { treatment: Treatment }) => {
  return (
    <a
      href={treatment.prescriber
        ? "/tratamento/123"
        : "/prescritor/tratamento/123"}
    >
      <div
        class={`p-3 ${
          treatment.current ? "bg-[#ffffff]" : "bg-[#d3d3d3]"
        } rounded-md text-[10px] sm:text-xs md:text-sm shadow`}
      >
        <div class="flex justify-between">
          <div class="flex flex-col gap-4 items-center">
            {treatment.medication.map((m) => {
              return (
                <div class="flex gap-2 items-center text-[#444444]">
                  <Icon id="Drop" size={12} />
                  <div class="flex flex-col">
                    <span class="font-semibold">
                      {m.name}
                    </span>
                    <span class="text-xs">
                      {m.dosage}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div class="flex flex-col items-end gap-2">
            <div class="flex justify-between items-center gap-2 text-[#808080]">
              <Icon id="Update" size={16} />
              <span>
                {timeAgo(
                  new Date(
                    treatment.updated_at,
                  ),
                )}
              </span>
            </div>
            <div
              class={`${
                treatment.feedback ===
                    "positive"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <Icon
                id={`${
                  treatment.feedback ===
                      "positive"
                    ? "HappyFace"
                    : "SadFace"
                }`}
                size={19}
              />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
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
        },
      ],
    },
  );
  const [docs, setDocs] = useState<DocListType[]>([]);

  const currentTreatment = patient.treatments?.find((t) => t.current === true);
  const oldTreatments = patient.treatments?.filter((t) => t.current !== true);

  const {
    displayNewTreatmentModal,
  } = useUI();

  return (
    <PageWrap>
      {isLoading
        ? <span class="loading loading-spinner text-green-600"></span>
        : (
          <div class="flex flex-col gap-3 w-full">
            <div class="flex justify-between mb-8">
              <PrescriberUpdateTreatmentModal />
              <h3 class="text-2xl text-[#8b8b8b] text-center">
                Tratamento
              </h3>
              <button
                class="btn btn-sm btn-secondary text-white"
                onClick={() => {
                  displayNewTreatmentModal.value = true;
                }}
              >
                <Icon
                  id="Drop"
                  size={12}
                />
                <span class="flex gap-[6px]">
                  Atualizar <span class="hidden sm:block">Tratamento</span>
                </span>
              </button>
            </div>
            <div class="flex flex-col gap-8">
              <div
                class={`p-3 bg-[#ffffff] rounded-md text-[10px] sm:text-xs md:text-sm shadow`}
              >
                <div class="flex justify-between">
                  <div class="flex gap-4 items-center">
                    <div class="text-[#808080]">
                      <Icon id="Profile" size={16} />
                    </div>
                    <div class="flex flex-col items-start">
                      <span class="font-semibold">
                        {patient.name}
                      </span>
                      <span class="text-sm">
                        {patient.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
