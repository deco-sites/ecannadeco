import type { Treatment } from "./PrescriberPatients.tsx";
import Icon from "./Icon.tsx";

export interface Props {
  treatment: Treatment;
  hideLastFeedback?: boolean;
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

const TreatmentCard = ({ treatment, hideLastFeedback }: Props) => {
  return (
    <div
      class={`p-0 ${
        treatment.current ? "bg-[#ffffff]" : "bg-[#d3d3d3]"
      } rounded-md text-[10px] shadow`}
    >
      <div class="flex justify-between p-3">
        <div class="flex flex-col gap-4 items-start">
          {treatment.medication.map((m) => {
            return (
              <div class="flex gap-2 items-center text-[#444444]">
                <Icon id="Drop" size={12} />
                <div class="flex flex-col">
                  <span class="font-semibold text-sm">
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
        <div
          class={`flex flex-col items-end gap-2 ${
            hideLastFeedback && "hidden"
          }`}
        >
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
      {(treatment.patient || treatment.prescriber) && (
        <div
          class={`${
            treatment.current
              ? "bg-secondary text-white"
              : "bg-[#e5e5e5] text-[#555555]"
          } px-3 py-1 rounded-b-md `}
        >
          {treatment.patient
            ? <span>Paciente: {treatment.patient!.name}</span>
            : (
              <span>
                {`Prescritor: ${treatment.prescriber!.name} | ${
                  treatment.prescriber!.registryType
                } ${treatment.prescriber!.registry} - ${
                  treatment.prescriber!.registryUF
                }`}
              </span>
            )}
        </div>
      )}
    </div>
  );
};

export default TreatmentCard;
