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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accessToken, setAccessToken] = useState(
    IS_BROWSER ? (localStorage.getItem("AccessToken") || "") : "",
  );
  const [updating, setUpdating] = useState<boolean>(false);

  const {
    displayNewPatientModal,
  } = useUI();

  return (
    <Modal
      loading="lazy"
      open={displayNewPatientModal.value}
      onClose={() => displayNewPatientModal.value = false}
    >
      <div class="flex flex-col p-10 gap-3 max-h-[90%] max-w-[90%] overflow-scroll bg-[#EDEDED] rounded-xl">
        <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
          Novo Paciente
        </h3>
        <label class="form-control w-full">
          <div class="label pb-1">
            <span class="label-text text-xs text-[#585858]">
              Nome do Paciente
            </span>
          </div>
          <input
            class="input rounded-md text-[#535353] border-none w-full disabled:bg-[#e3e3e3] bg-white"
            placeholder="Nome aqui"
            value={name}
            onChange={(e) => {
              setName(name);
            }}
          />
        </label>
        <label class="form-control w-full">
          <div class="label pb-1">
            <span class="label-text text-xs text-[#585858]">
              Email do Paciente
            </span>
          </div>
          <input
            class="input rounded-md text-[#535353] border-none w-full disabled:bg-[#e3e3e3] bg-white"
            placeholder="Nome aqui"
            value={email}
            onChange={(e) => {
              setEmail(email);
            }}
          />
        </label>

        <button
          class="btn btn-secondary text-white"
          onClick={() => console.log("Clicked")}
        >
          Adicionar Paciente{"   "}{updating &&
            <span class="loading loading-spinner text-white"></span>}
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
