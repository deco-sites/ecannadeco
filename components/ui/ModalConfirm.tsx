import Modal from "./Modal.tsx";

interface Props {
  text: string;
  confirmButtonText: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const ModalConfirm = (
  { open, onClose, text, onConfirm, confirmButtonText, loading }: Props,
) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <div class="flex flex-col p-16 gap-3 bg-[#EDEDED] rounded-xl">
        <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
          {text}
        </h3>
        <div class="flex flex-col items-center gap-2">
          <button
            class="btn bg-red-500 text-white font-normal"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {loading ? "Processando..." : confirmButtonText}
          </button>
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
