import Icon from "./Icon.tsx";

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
  };
};

function TreatmentJourneyTimeline({
  journeyStatus,
}: {
  journeyStatus: string;
}) {
  return (
    <div>
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
                ].includes(journeyStatus)
                ? "text-primary"
                : "text-[#b9b9b9]"
            }`}
          >
            <div class="timeline-middle">
              {[
                  "RECEIVED_PRESCRIPTION",
                  "BOUGHT_MEDICATION",
                  "RECEIVED_MEDICATION",
                  "STARTED_TREATMENT",
                ].includes(journeyStatus)
                ? (
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
                )
                : <Icon id="Pending" size={20} />}
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
                  ].includes(journeyStatus)
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
                ].includes(journeyStatus)
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
                  ].includes(journeyStatus)
                  ? "bg-primary"
                  : "bg-[#b9b9b9]"
              }`}
            />
            <div class="timeline-middle">
              {[
                  "BOUGHT_MEDICATION",
                  "RECEIVED_MEDICATION",
                  "STARTED_TREATMENT",
                ].includes(journeyStatus)
                ? (
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
                )
                : <Icon id="Pending" size={20} />}
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
                  ].includes(journeyStatus)
                  ? "bg-primary"
                  : "bg-[#b9b9b9]"
              }`}
            />
          </li>
          <li
            class={`flex-grow ${
              ["RECEIVED_MEDICATION", "STARTED_TREATMENT"].includes(
                  journeyStatus,
                )
                ? "text-primary"
                : "text-[#b9b9b9]"
            }`}
          >
            <hr
              class={`${
                ["RECEIVED_MEDICATION", "STARTED_TREATMENT"].includes(
                    journeyStatus,
                  )
                  ? "bg-primary"
                  : "bg-[#b9b9b9]"
              }`}
            />
            <div class="timeline-middle">
              {["RECEIVED_MEDICATION", "STARTED_TREATMENT"].includes(
                  journeyStatus,
                )
                ? (
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
                )
                : <Icon id="Pending" size={20} />}
            </div>
            <div class="timeline-end text-[9px] text-center max-w-[65px] leading-3">
              Recebeu Medicamento
            </div>
            <hr
              class={`${
                ["RECEIVED_MEDICATION", "STARTED_TREATMENT"].includes(
                    journeyStatus,
                  )
                  ? "bg-primary"
                  : "bg-[#b9b9b9]"
              }`}
            />
          </li>
          <li
            class={`flex-grow ${
              ["STARTED_TREATMENT"].includes(journeyStatus)
                ? "text-primary"
                : "text-[#b9b9b9]"
            }`}
          >
            <hr
              class={`${
                ["STARTED_TREATMENT"].includes(journeyStatus)
                  ? "bg-primary"
                  : "bg-[#b9b9b9]"
              }`}
            />
            <div class="timeline-middle">
              {["STARTED_TREATMENT"].includes(journeyStatus)
                ? (
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
                )
                : <Icon id="Pending" size={20} />}
            </div>
            <div class="timeline-end text-[9px] text-center max-w-[65px] leading-3">
              Iniciou Tratamento
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default TreatmentJourneyTimeline;
