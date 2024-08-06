import type { Treatment } from "./PrescriberPatientsLive.tsx";
import Icon from "./Icon.tsx";
import TreatmentJourneyTimeline from "deco-sites/ecannadeco/components/ui/TreatmentJourneyTimeline.tsx";

export interface Props {
  treatment: Treatment;
  hideLastFeedback?: boolean;
  isPatient?: boolean;
}

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

const TreatmentCard = ({ treatment, hideLastFeedback, isPatient }: Props) => {
  return (
    <a
      href={isPatient
        ? treatment.isActive
          ? `/novo-registro/${treatment._id}`
          : `/tratamentos/${treatment._id}`
        : `/prescritor/tratamentos/${treatment._id}`}
    >
      <div
        class={`p-0 ${
          treatment.isActive ? "bg-[#ffffff]" : "bg-[#ececec]"
        } rounded-md text-[10px] shadow`}
      >
        <div class="flex justify-between p-3">
          <div class="flex flex-col gap-4 items-start">
            {treatment.medications &&
              treatment.medications.map((m) => {
                return (
                  <div class="flex gap-2 items-center text-[#444444]">
                    <Icon id="Drop" size={12} />
                    <div class="flex flex-col">
                      <span class="font-semibold text-sm">{m.name}</span>
                      <span class="text-xs">{m.dosage}</span>
                    </div>
                  </div>
                );
              })}
          </div>
          <div
            class={`flex flex-col items-end gap-2 ${
              hideLastFeedback && "hidden"
            }`}
          >
            <div class="flex justify-between items-center gap-2 text-[#808080]">
              <Icon id="Update" size={16} />
              <span>{timeAgo(new Date(treatment.updated_at))}</span>
            </div>
            <div
              class={`p-4 ${
                treatment.status !== "BAD" ? "text-green-800" : "text-red-600"
              }`}
            >
              <Icon
                id={`${treatment.status !== "BAD" ? "HappyFace" : "SadFace"}`}
                size={24}
                strokeWidth={0.5}
              />
            </div>
            {treatment.prescription && (
              <div class="text-[#808080]">
                <Icon id="Form" size={19} />
              </div>
            )}
          </div>
        </div>
        {
          !isPatient && (
            <TreatmentJourneyTimeline
              journeyStatus={treatment.treatmentJourneyStatus}
            />
          )
        }
        {(treatment.patient || treatment.prescriber) && (
          <div
            class={`${
              treatment.isActive
                ? "bg-primary text-white"
                : "bg-[#e5e5e5] text-[#555555]"
            } px-3 py-1 rounded-b-md text-sm `}
          >
            {!isPatient
              ? <span>Paciente: {treatment.patient!.name}</span>
              : (
                <span>
                  {`Prescritor: ${treatment.prescriber!.name} | ${
                    treatment.prescriber!.registry_type
                  } ${treatment.prescriber!.registry_number} - ${
                    treatment.prescriber!.registry_state
                  }`}
                </span>
              )}
          </div>
        )}
      </div>
    </a>
  );
};

export default TreatmentCard;
