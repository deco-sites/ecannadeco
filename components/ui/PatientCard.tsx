import Icon from "./Icon.tsx";

export type Patient = {
  _id: string;
  name: string;
  profile: {
    email: string;
  };
  lastReport?: string | Date;
  status?: string;
  treatmentJourneyStatus?: string;
};

function PrescriberPatients({ patient }: { patient: Patient }) {
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
                  patient.treatmentJourneyStatus === "STARTED_TREATMENT"
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
            {/* Timeline Start */}
            <div>
              <ul class="timeline">
                <li
                  class={`flex-grow ${
                    [
                        "RECEIVED_PRESCRIPTION",
                        "BOUGHT_MEDICATION",
                        "RECEIVED_MEDICATION",
                        "STARTED_TREATMENT",
                      ].includes(patient.treatmentJourneyStatus!)
                      ? "text-primary"
                      : "text-[#b9b9b9]"
                  }`}
                >
                  <div class="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="h-5 w-5"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="timeline-end text-[9px] text-center max-w-[65px] leading-3">
                    Recebeu Prescrição
                  </div>
                  <hr
                    class={`${
                      [
                          "RECEIVED_PRESCRIPTION",
                          "BOUGHT_MEDICATION",
                          "RECEIVED_MEDICATION",
                          "STARTED_TREATMENT",
                        ].includes(patient.treatmentJourneyStatus!)
                        ? "bg-primary"
                        : "bg-[#b9b9b9]"
                    }`}
                  />
                </li>
                <li
                  class={`flex-grow ${
                    [
                        "BOUGHT_MEDICATION",
                        "RECEIVED_MEDICATION",
                        "STARTED_TREATMENT",
                      ].includes(patient.treatmentJourneyStatus!)
                      ? "text-primary"
                      : "text-[#b9b9b9]"
                  }`}
                >
                  <hr
                    class={`${
                      [
                          "BOUGHT_MEDICATION",
                          "RECEIVED_MEDICATION",
                          "STARTED_TREATMENT",
                        ].includes(patient.treatmentJourneyStatus!)
                        ? "bg-primary"
                        : "bg-[#b9b9b9]"
                    }`}
                  />
                  <div class="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="h-5 w-5"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="timeline-end text-[9px] text-center max-w-[65px] leading-3">
                    Comprou Medicamento
                  </div>
                  <hr
                    class={`${
                      [
                          "BOUGHT_MEDICATION",
                          "RECEIVED_MEDICATION",
                          "STARTED_TREATMENT",
                        ].includes(patient.treatmentJourneyStatus!)
                        ? "bg-primary"
                        : "bg-[#b9b9b9]"
                    }`}
                  />
                </li>
                <li
                  class={`flex-grow ${
                    ["RECEIVED_MEDICATION", "STARTED_TREATMENT"].includes(
                        patient.treatmentJourneyStatus!,
                      )
                      ? "text-primary"
                      : "text-[#b9b9b9]"
                  }`}
                >
                  <hr
                    class={`${
                      ["RECEIVED_MEDICATION", "STARTED_TREATMENT"].includes(
                          patient.treatmentJourneyStatus!,
                        )
                        ? "bg-primary"
                        : "bg-[#b9b9b9]"
                    }`}
                  />
                  <div class="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="h-5 w-5"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="timeline-end text-[9px] text-center max-w-[65px] leading-3">
                    Recebeu Medicamento
                  </div>
                  <hr
                    class={`${
                      ["RECEIVED_MEDICATION", "STARTED_TREATMENT"].includes(
                          patient.treatmentJourneyStatus!,
                        )
                        ? "bg-primary"
                        : "bg-[#b9b9b9]"
                    }`}
                  />
                </li>
                <li
                  class={`flex-grow ${
                    ["STARTED_TREATMENT"].includes(
                        patient.treatmentJourneyStatus!,
                      )
                      ? "text-primary"
                      : "text-[#b9b9b9]"
                  }`}
                >
                  <hr
                    class={`${
                      ["STARTED_TREATMENT"].includes(
                          patient.treatmentJourneyStatus!,
                        )
                        ? "bg-primary"
                        : "bg-[#b9b9b9]"
                    }`}
                  />
                  <div class="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="h-5 w-5"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="timeline-end text-[9px] text-center max-w-[65px] leading-3">
                    Iniciou Tratamento
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </div>
      </div>
    </a>
  );
}

export default PrescriberPatients;
