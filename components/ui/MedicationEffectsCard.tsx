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
    icon: "Update",
    name: "Tontura",
  },
  "nausea": {
    icon: "Nausea",
    name: "Enjôo",
  },
};

interface Props {
  id: AvailableEffects;
}

const MedicationEffectsCard = ({ id }: Props) => {
  return (
    <div id="efeito" class="flex flex-col items-center justify-center gap-2">
      <div class="h-16 w-16 bg-[#eeeeee] flex items-center justify-center rounded-md">
        <Icon id={symbolName[id].icon} size={48} />
      </div>
      <span>{symbolName[id].name}</span>
    </div>
  );
};

export default MedicationEffectsCard;
