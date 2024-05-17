import { useUI } from "../../sdk/useUI.ts";
import Modal from "./Modal.tsx";
import { useState } from "preact/hooks";
import { h } from "preact";
import { invoke } from "../../runtime.ts";
import Icon from "./Icon.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import type { Treatment } from "./PrescriberPatients.tsx";
import TreatmentCard from "deco-sites/ecannadeco/components/ui/TreatmentCard.tsx";

type Medication = Treatment["medication"];

const PrescriberUpdateTreatmentModal = () => {
  const [currentTreatment, setCurrentTreatment] = useState<Treatment>(
    {
      updated_at: "2024-05-14T14:29:09.024+00:00",
      medication: [{
        name: "CBD 3000mg - Abrapango",
        dosage: "3 gotas 2x/ dia",
      }, {
        name: "THC 50mg - Abrapango",
        dosage: "3 gotas 2x/ dia",
      }],
      feedback: "positive",
      entries: [{
        created_at: "2024-05-14T14:29:09.024+00:00",
        desiredEffects: [{
          effect: {
            name: "Fome",
          },
          intensity: 4,
        }, {
          effect: {
            name: "Sono",
          },
          intensity: 3,
        }],
        undesiredEffects: [{
          effect: {
            name: "Dor de Cabeça",
          },
          intensity: 4,
        }, {
          effect: {
            name: "Tontura",
          },
          intensity: 3,
        }],
      }],
      current: true,
      prescriber: {
        name: "Dra. Endy Lacet",
        registryType: "CRO",
        registryUF: "DF",
        registry: "0000000",
      },
      patient: {
        name: "Célio Marcos",
        email: "celio@gmail.com",
      },
    },
  );
  const [currentMedication, setCurrentMedication] = useState<Medication>(
    currentTreatment.medication,
  );
  const [newMedication, setNewMedication] = useState<Medication>(
    currentTreatment.medication,
  );
  const [newTreatment, setNewTreatment] = useState<Treatment>(currentTreatment);
  const [accessToken, setAccessToken] = useState(
    IS_BROWSER ? (localStorage.getItem("AccessToken") || "") : "",
  );
  const [updating, setUpdating] = useState<boolean>(false);

  const {
    displayNewTreatmentModal,
  } = useUI();

  const handleUpdateTreatment = () => {
    const treatment = currentTreatment;
    treatment.medication = newMedication;
    setNewTreatment(treatment);
  };

  const handleAddMedication = () => {
    const newMedications = [...newMedication]; // Create a new array instance
    newMedications.push({
      name: "",
      dosage: "",
    });
    setNewMedication(newMedications);
  };

  const handleRemoveMedication = (index: number) => {
    const newMedications = [...newMedication];
    newMedications.splice(index, 1);
    setNewMedication(newMedications);
  };

  return (
    <Modal
      loading="lazy"
      open={displayNewTreatmentModal.value}
      onClose={() => displayNewTreatmentModal.value = false}
    >
      <div class="flex flex-col p-10 gap-3 max-h-[90%] max-w-[90%] overflow-scroll bg-[#EDEDED] rounded-xl">
        <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
          Atualizar tratamento - {currentTreatment.patient?.name}
        </h3>

        {newMedication.map((medication, index) => (
          <div class="flex items-center gap-3">
            <div class="p-3 rounded-md bg-[#dbdbdb] w-full">
              <label class="form-control w-full">
                <div class="label pb-1">
                  <span class="label-text text-xs text-[#585858]">
                    Nome da Medicação
                  </span>
                </div>
                <input
                  class="input rounded-md text-[#535353] border-none w-full disabled:bg-[#e3e3e3] bg-white"
                  placeholder="Nome da Medicação"
                  value={newMedication[index].name}
                  onChange={(e) => {
                    const newMedications = newMedication;
                    newMedications[index].name = e.currentTarget.value;
                    setNewMedication(newMedications);
                  }}
                />
              </label>
              <label class="form-control w-full">
                <div class="label pb-1">
                  <span class="label-text text-xs text-[#585858]">
                    Posologia
                  </span>
                </div>
                <input
                  class="input rounded-md text-[#535353] border-none w-full disabled:bg-[#e3e3e3] bg-white"
                  placeholder="Posologia"
                  value={newMedication[index].dosage}
                  onChange={(e) => {
                    const newMedications = newMedication;
                    newMedications[index].dosage = e.currentTarget.value;
                    setNewMedication(newMedications);
                  }}
                />
              </label>
            </div>
            <div class="w-fit">
              <Icon
                id="Trash"
                size={18}
                onClick={() => handleRemoveMedication(index)}
              />
            </div>
          </div>
        ))}
        <span
          class="underline text-sm cursor-pointer"
          onClick={handleAddMedication}
        >
          + Adicionar Medicação
        </span>
        <button
          class="btn btn-secondary text-white"
          onClick={() => console.log("Clicked")}
        >
          Atualizar Tratamento{"   "}{updating
            ? <span class="loading loading-spinner text-white"></span>
            : <Icon id="Update" size={16} />}
        </button>
        <button
          onClick={() => {
            displayNewTreatmentModal.value = false;
          }}
          class="btn btn-ghost uppercase font-medium"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

export default PrescriberUpdateTreatmentModal;
