import { useUI } from "../../sdk/useUI.ts";
import Modal from "./Modal.tsx";

interface Props {
  // text: string;
  buttonText: string;
  onClose: () => void;
}

const ModalConfirm = (
  { onClose, buttonText }: Props,
) => {
  const { modalTextAction, displayModalTextAction } = useUI();
  return (
    <Modal
      open={displayModalTextAction.value}
      onClose={onClose}
    >
      <div class="flex flex-col p-16 gap-3 bg-[#EDEDED] rounded-xl max-w-[400px]">
        <h3 class="text-md text-[#8b8b8b]  text-center">
          {modalTextAction.value.text}
        </h3>
        <div class="flex flex-col items-center gap-2">
          <a
            href={modalTextAction.value.actionUrl}
            class="btn btn-primary text-white font-normal"
          >
            {buttonText}
          </a>
          <button
            class="btn btn-ghost font-normal"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirm;
