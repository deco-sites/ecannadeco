import { invoke } from "deco-sites/ecannadeco/runtime.ts";
import Icon from "./Icon.tsx";
import TreatmentJourneyTimeline from "deco-sites/ecannadeco/components/ui/TreatmentJourneyTimeline.tsx";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

export type Patient = {
  _id: string;
  name: string;
  profile: {
    email: string;
  };
  lastReport?: string | Date;
  status?: string;
  // treatmentJourneyStatus?: string;
  treatment?: {
    treatmentJourneyStatus: string;
    _id: string;
  };
};

function PrescriberPatients({
  patient,
  onFinish,
}: {
  patient: Patient;
  onFinish: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
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

  const updateTreatmentJourneyStatus = async (status: string) => {
    let token = "";
    if (IS_BROWSER) {
      token = localStorage.getItem("PrescriberAccessToken") || "";
    }
    setIsLoading(true);
    try {
      await invoke[
        "deco-sites/ecannadeco"
      ].actions.prescriberUpdateJourneyStatus({
        treatmentId: patient.treatment?._id,
        status: status,
        token,
      });
      onFinish();
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <a href={`/prescritor/meus-pacientes/${patient._id}`} class="">
      <div tabindex={0} role="button" class="">
        <div target="_blank">
          <li
            class={`p-3 ${
              patient.status === "GOOD" ? "bg-[#ffffff]" : "bg-[#fff8dc]"
            } rounded-md text-[10px] sm:text-xs md:text-sm shadow`}
          >
            <div class="flex justify-between">
              <div class="flex gap-4 items-center">
                <div class="text-[#808080]">
                  <Icon id="Profile" size={16} />
                </div>
                <div class="flex flex-col items-start">
                  <span class="font-semibold">{patient.name}</span>
                  <span class="text-sm">
                    {patient.profile?.email || "E-mail não informado"}
                  </span>
                </div>
              </div>
              <div
                class={`${
                  patient.treatment?.treatmentJourneyStatus !==
                      "STARTED_TREATMENT"
                    ? ""
                    : "hidden"
                }`}
              >
                <details class="dropdown">
                  <summary class="btn m-1 text-xs">
                    {isLoading
                      ? <span class="loading loading-spinner text-green-800" />
                      : <Icon id="Update" size={16} />}
                  </summary>
                  <ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow text-xs">
                    <li
                      onClick={(e) => {
                        e.preventDefault();
                        updateTreatmentJourneyStatus("BOUGHT_MEDICATION");
                      }}
                    >
                      <span>Comprou o Medicamento</span>
                    </li>
                    <li
                      onClick={(e) => {
                        e.preventDefault();
                        updateTreatmentJourneyStatus("RECEIVED_MEDICATION");
                      }}
                    >
                      <span>Recebeu o Medicamento</span>
                    </li>
                    <li
                      onClick={(e) => {
                        e.preventDefault();
                        updateTreatmentJourneyStatus("STARTED_TREATMENT");
                      }}
                    >
                      <span>Iniciou o Tratamento</span>
                    </li>
                  </ul>
                </details>
              </div>
              <div
                class={`${
                  patient.treatment?.treatmentJourneyStatus ===
                      "STARTED_TREATMENT"
                    ? ""
                    : "hidden"
                }`}
              >
                {patient.lastReport
                  ? (
                    <div class="flex flex-col items-end gap-2">
                      <div class="flex justify-between items-center gap-2 text-[#808080]">
                        <Icon id="Update" size={16} />
                        <span>{timeAgo(new Date(patient.lastReport))}</span>
                      </div>
                      <div
                        class={`${
                          patient.status === "GOOD"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <Icon
                          id={`${
                            patient.status === "GOOD" ? "HappyFace" : "SadFace"
                          }`}
                          size={19}
                        />
                      </div>
                    </div>
                  )
                  : (
                    <div class="flex items-center justify-end">
                      <div class="badge badge-primary badge-xs p-2">
                        Sem Registro
                      </div>
                    </div>
                  )}
              </div>
            </div>
            {patient.treatment
              ? (
                <TreatmentJourneyTimeline
                  journeyStatus={patient.treatment?.treatmentJourneyStatus!}
                />
              )
              : (
                <div class="rounded-md bg-orange-200 text-orange-700 p-4 flex gap-4 items-center justify-center my-4">
                  <Icon id="Info" size={22} />
                  <span class="text-xs">
                    Clique aqui e cadastre o primeiro tratamento para acompanhar
                    este paciente!
                  </span>
                </div>
              )}
          </li>
        </div>
      </div>
    </a>
  );
}

export default PrescriberPatients;
