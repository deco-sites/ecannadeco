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
    <div class="flex flex-col items-start justify-center">
      <div
        class={`btn py-2 px-4 h-6 bg-[#fdfcfe] border flex flex-row items-center justify-center rounded-full hover:bg-[#eee] hover:border-[#f8f8f8] ${
          isActive
            ? isGood ? "border-green-800" : "border-red-900"
            : "border-[#f4f4f4]"
        }`}
      >
        {icon && <Icon id={icon} size={24} />}
        <span class="text-xs">{name}</span>
      </div>
    </div>
  );
};

export default MedicationEffectsCard;
