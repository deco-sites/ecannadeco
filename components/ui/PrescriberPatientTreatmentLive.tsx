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
import type { Patient, Treatment } from "./PrescriberPatientsLive.tsx";
import PrescriberUpdateTreatmentModal from "deco-sites/ecannadeco/islands/PrescriberUpdateTreatmentModalLive.tsx";
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
          treatment.isActive ? "bg-[#ffffff]" : "bg-[#d3d3d3]"
        } rounded-md text-[10px] sm:text-xs md:text-sm shadow`}
      >
        <div class="flex justify-between">
          <div class="flex flex-col gap-4 items-start">
            {treatment.medications.map((m) => {
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
                treatment.status ===
                    "GOOD"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <Icon
                id={`${
                  treatment.status ===
                      "GOOD"
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
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [patient, setPatient] = useState<Patient | null>(
    null,
  );

  const getTreatmentsByPatient = async (
    accessToken: string,
    patientId: string,
  ) => {
    setIsLoading(true);
    const response = await invoke["deco-sites/ecannadeco"].actions
      .prescriberGetTreatmentsByPatient({
        token: accessToken,
        patientId,
      });
    setIsLoading(false);
    if (response) {
      setTreatments(response as Treatment[]);
    }
    const patient = await invoke["deco-sites/ecannadeco"].actions
      .prescriberGetPatient({ token: accessToken, patientId });
    if (patient) {
      setPatient(patient as Patient);
    }
  };

  useEffect(() => {
    const accessToken = IS_BROWSER
      ? (localStorage.getItem("PrescriberAccessToken") || "")
      : "";
    const patientId = IS_BROWSER
      ? (window.location.pathname.split("/")[3] || "")
      : "";
    getTreatmentsByPatient(accessToken, patientId);
  }, []);

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
              <PrescriberUpdateTreatmentModal
                onFinished={() => {
                  displayNewTreatmentModal.value = false;
                  let accessToken = "";
                  const patientId = IS_BROWSER
                    ? (window.location.pathname.split("/")[3] || "")
                    : "";

                  if (IS_BROWSER) {
                    accessToken =
                      localStorage.getItem("PrescriberAccessToken") || "";
                  }
                  getTreatmentsByPatient(accessToken, patientId);
                }}
              />
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
                        {patient?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 class="text-sm text-[#8b8b8b] mb-2">
                  Tratamentos
                </h3>
                <div class="flex flex-col gap-4">
                  {treatments?.map((t) => {
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
