import { useUI } from "../../sdk/useUI.ts";
import Modal from "./Modal.tsx";
import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import Icon from "./Icon.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import type { Treatment } from "./PrescriberPatientsLive.tsx";
import { h } from "preact";
import { API_URL } from "../../sdk/constants.ts";

type Medications = Treatment["medications"];

export interface Props {
  onFinished: () => void;
}
const PrescriberUpdateTreatmentModal = ({ onFinished }: Props) => {
  const [currentTreatment, setCurrentTreatment] = useState<Treatment | null>(
    null,
  );
  const [newMedication, setNewMedication] = useState<Medications>([]);
  const [newTreatment, setNewTreatment] = useState<Treatment | null>(null);
  const [accessToken, _setAccessToken] = useState(
    IS_BROWSER ? localStorage.getItem("PrescriberAccessToken") || "" : "",
  );
  const [updating, setUpdating] = useState<boolean>(false);
  const [file, setFile] = useState<File>();

  const handleStoreDocument = (
    event: h.JSX.TargetedEvent<HTMLInputElement, Event>,
  ) => {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      setFile(fileInput.files[0]);
    }
  };

  const getActiveTreatmentByPatient = async (
    accessToken: string,
    patientId: string,
  ) => {
    setUpdating(true);
    const response = await invoke[
      "deco-sites/ecannadeco"
    ].actions.prescriberGetActiveTreatmentByPatient({
      token: accessToken,
      patientId,
    });
    setUpdating(false);
    if (response) {
      setCurrentTreatment(response as Treatment);
      setNewTreatment(response as Treatment);
      setNewMedication(response.medications as Medications);
      console.log({ newMedication });
    } else {
      setNewTreatment({
        patient: {
          _id: patientId,
        },
        medications: [],
      } as unknown as Treatment);
      setNewMedication([{ name: "", dosage: "" }] as Medications);
    }
  };

  useEffect(() => {
    const accessToken = IS_BROWSER
      ? localStorage.getItem("PrescriberAccessToken") || ""
      : "";
    const patientId = IS_BROWSER
      ? window.location.pathname.split("/")[3] || ""
      : "";
    console.log({ patientId });
    getActiveTreatmentByPatient(accessToken, patientId);
  }, []);
  const { displayNewTreatmentModal } = useUI();

  const _handleUpdateTreatment = () => {
    const treatment = currentTreatment;
    if (treatment && treatment.medications) {
      treatment.medications = newMedication;
      setNewTreatment(treatment);
    }
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

  const handleSubmit = async () => {
    setUpdating(true);

    const formData = new FormData();

    if (!newTreatment?.medications || newTreatment!.medications!.length === 0) {
      alert(
        "Você deve informar as medicações do tratamento antes de continuar",
      );
      return false;
    }
    formData.append("prescription", file! || "");
    formData.append("patient", newTreatment!.patient!._id);
    const medicationsJson = JSON.stringify(newTreatment!.medications!);
    formData.append("medications", medicationsJson);

    try {
      const response = await fetch(
        `${API_URL}/prescribers/treatments`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: accessToken,
            ContentType: "multipart/form-data",
          },
        },
      );

      setUpdating(false);
      onFinished();
      if (response) {
        displayNewTreatmentModal.value = false;
      }
    } catch (e) {
      setUpdating(false);
      onFinished();
      displayNewTreatmentModal.value = false;
      alert(
        `Houve um erro nesta operação. Entre em contato com o suporte: ${e}`,
      );
    }
  };

  return (
    <Modal
      loading="lazy"
      open={displayNewTreatmentModal.value}
      onClose={() => (displayNewTreatmentModal.value = false)}
    >
      <div class="flex flex-col p-10 gap-3 max-h-[90%] max-w-[90%] overflow-scroll bg-[#EDEDED] rounded-xl">
        <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
          {currentTreatment
            ? `Atualizar tratamento - ${currentTreatment.patient?.name}`
            : `Cadastrar tratamento`}
        </h3>

        {newMedication?.map((medication, index) => (
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
                  value={medication.name}
                  onChange={(e) => {
                    const newMedications = newMedication;
                    medication.name = e.currentTarget.value;
                    setNewMedication(newMedications);
                    setNewTreatment({
                      ...newTreatment,
                      medications: newMedications,
                    } as Treatment);
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
                  value={medication.dosage}
                  onChange={(e) => {
                    const newMedications = newMedication;
                    medication.dosage = e.currentTarget.value;
                    setNewMedication(newMedications);
                    setNewTreatment({
                      ...newTreatment,
                      medications: newMedications,
                    } as Treatment);
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
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">
              Prescrição deste novo tratamento (opcional)
            </span>
          </div>
          <input
            type="file"
            class="file-input file-input-primary w-full"
            onChange={(e) => handleStoreDocument(e)}
          />
        </label>
        <button class="btn btn-secondary text-white" onClick={handleSubmit}>
          {currentTreatment ? "Atualizar Tratamento" : "Cadastrar Tratamento"}
          {"    "}{updating
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
