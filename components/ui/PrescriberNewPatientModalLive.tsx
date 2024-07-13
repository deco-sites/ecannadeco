import { useUI } from "../../sdk/useUI.ts";
import Modal from "./Modal.tsx";
import { useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import PhoneInput from "../ui/PhoneInput.tsx";
import type { Treatment } from "./PrescriberPatients.tsx";

type Medication = Treatment["medication"];

export interface Props {
  onFinished: () => void;
}

const PrescriberUpdateTreatmentModal = ({ onFinished }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [accessToken, _setAccessToken] = useState(
    IS_BROWSER ? localStorage.getItem("PrescriberAccessToken") || "" : "",
  );
  const [updating, setUpdating] = useState<boolean>(false);
  const { displayNewPatientModal, displayModalTextAction, modalTextAction } =
    useUI();

  const handleSubmit = async () => {
    setUpdating(true);
    const response = await invoke[
      "deco-sites/ecannadeco"
    ].actions.prescriberCreatePatient({
      token: accessToken,
      name,
      email,
      phone,
    });
    const res = response as { message?: string };

    // console.log({res});
    setUpdating(false);

    if (res.message) {
      displayNewPatientModal.value = false;
      modalTextAction.value = {
        text: res.message,
        actionUrl: "/prescritor/minha-conta",
      };
      displayModalTextAction.value = true;
    } else if (response) {
      displayNewPatientModal.value = false;
      onFinished();
    }
  };

  return (
    <Modal
      loading="lazy"
      open={displayNewPatientModal.value}
      onClose={() => (displayNewPatientModal.value = false)}
    >
      <div class="flex flex-col p-10 gap-3 max-h-[90%] max-w-[90%] overflow-scroll bg-[#EDEDED] rounded-xl">
        <h3 class="text-xl text-[#8b8b8b] font-semibold text-center">
          Novo Paciente
        </h3>
        <label class="form-control w-full">
          <div class="label pb-1">
            <span class="label-text text-xs text-[#585858]">
              Nome do Paciente
            </span>
          </div>
          <input
            class="input input-sm rounded-md text-[#535353] border-none w-full disabled:bg-[#e3e3e3] bg-white"
            placeholder="Nome"
            value={name}
            onChange={(e) => {
              setName(e.currentTarget.value);
            }}
          />
        </label>
        <label class="form-control w-full">
          <div class="label pb-1">
            <span class="label-text text-xs text-[#585858]">
              E-mail do Paciente
            </span>
          </div>
          <input
            class="input input-sm rounded-md text-[#535353] border-none w-full disabled:bg-[#e3e3e3] bg-white"
            placeholder="E-mail"
            value={email}
            onChange={(e) => {
              setEmail(e.currentTarget.value);
            }}
          />
        </label>
        <PhoneInput
          value={phone}
          label="Whatsapp do Paciente"
          onChange={(value) => setPhone(value)}
        />

        <button class="btn btn-secondary text-white" onClick={handleSubmit}>
          Adicionar Paciente{"   "}
          {updating && <span class="loading loading-spinner text-white"></span>}
        </button>
        <button
          onClick={() => {
            displayNewPatientModal.value = false;
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
