import Modal from "./Modal.tsx";
import Icon from "./Icon.tsx";

interface Props {
  title: string;
  videoURL: string;
  onClose: () => void;
  open: boolean;
}

const ModalVideo = ({ open, onClose, title, videoURL }: Props) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div class="flex flex-col px-8 pb-10 pt-4 bg-[#EDEDED] rounded-xl max-w-[620px] w-[90%]">
        <div class="w-full flex justify-end">
          <button aria-label="X" class="btn btn-ghost p-0" onClick={onClose}>
            <Icon id="XMark" size={24} strokeWidth={2} />
          </button>
        </div>
        <div class="flex flex-col gap-8">
          <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
            {title}
          </h3>
          <div class="w-full flex justify-center mb-4">
            <iframe
              class="w-full"
              src={videoURL}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              height="315"
              width="560"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalVideo;
