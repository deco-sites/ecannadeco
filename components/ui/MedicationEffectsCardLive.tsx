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
}

const MedicationEffectsCard = ({ icon, name }: Props) => {
  return (
    <div class="flex flex-col items-center justify-center gap-2">
      <div class="h-16 w-16 bg-[#eeeeee] flex items-center justify-center rounded-md">
        <Icon id={icon} size={48} />
      </div>
      <span>{name}</span>
    </div>
  );
};

export default MedicationEffectsCard;
