import Icon, { AvailableIcons } from "./Icon.tsx";

export type AvailableEffects =
  | "hunger"
  | "sleep"
  | "focus"
  | "headache"
  | "dizziness"
  | "nausea";

export const symbolName: Record<
  string,
  { icon: AvailableIcons; name: string }
> = {
  "hunger": {
    icon: "Hungry",
    name: "Fome",
  },
  "sleep": {
    icon: "Sleep",
    name: "Sono",
  },
  "focus": {
    icon: "Focus",
    name: "Foco",
  },
  "headache": {
    icon: "Headache",
    name: "Enxaqueca",
  },
  "dizziness": {
    icon: "Dizziness",
    name: "Tontura",
  },
  "nausea": {
    icon: "Nausea",
    name: "Enjôo",
  },
};

interface Props {
  icon: AvailableIcons;
  name: string;
  isActive?: boolean;
  isGood?: boolean;
}

const MedicationEffectsCard = ({ icon, name, isActive, isGood }: Props) => {
  return (
    <div class="flex flex-col items-center justify-center gap-2">
      <div
        class={`btn h-16 w-16 bg-[#f4f4f4] border flex items-center justify-center rounded-md hover:bg-[#eee] hover:border-[#f8f8f8] ${
          isActive
            ? isGood ? "border-green-800" : "border-red-900"
            : "border-[#f4f4f4]"
        }`}
      >
        <Icon id={icon} size={48} />
      </div>
      <span class="text-xs">{name}</span>
    </div>
  );
};

export default MedicationEffectsCard;
