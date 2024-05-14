import Modal from "../../components/ui/Modal.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { useState } from "preact/hooks";
import { useUI } from "../../sdk/useUI.ts";
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { invoke } from "../../runtime.ts";

export interface Props {
  onFinish: () => void;
}

const PreSignupUsersModal = ({ onFinish }: Props) => {
  const [file, setFile] = useState<File>();
  const { displayPreSignupUsersModal } = useUI();
  const [isUploading, setIsUploading] = useState(false);

  const handleStoreDocument = (
    event: h.JSX.TargetedEvent<HTMLInputElement, Event>,
  ) => {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      setFile(fileInput.files[0]);
    }
  };

  const handleCreate = async () => {
    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AccessToken") || "";
    }

    setIsUploading(true);

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          "https://service.ecanna.com.br/profile/",
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: accessToken,
              ContentType: "multipart/form-data",
            },
          },
        );
        const r = await response.json();

        console.log({ responsePresignup: r });
        setIsUploading(false);

        onFinish();
      } catch (e) {
        console.log({ erroUpload: e });
        setIsUploading(false);
      }
    }
  };

  return (
    <Modal
      loading="lazy"
      open={displayPreSignupUsersModal.value}
      onClose={() => displayPreSignupUsersModal.value = false}
    >
      <div class="flex flex-col p-16 gap-3 bg-[#EDEDED] rounded-xl max-w-[90%] sm:max-w-[500px]">
        <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
          Pré Cadastrar Pacientes Associados
        </h3>
        <span class="text-center text-xs">
          Suba arquivo csv com as colunas <span class="font-bold">email</span> e
          {" "}
          <span class="font-bold">cids</span>{" "}
          dos pacientes que deseja pré-cadastrar na sua associação.
        </span>

        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Selecionar arquivo csv</span>
          </div>
          <input
            type="file"
            accept=".csv"
            class="file-input file-input-primary w-full max-w-xs"
            onChange={(e) => handleStoreDocument(e)}
          />
        </label>

        <button class="btn btn-secondary text-white" onClick={handleCreate}>
          Fazer Pré Cadastro{"   "}{isUploading
            ? <span class="loading loading-spinner text-white"></span>
            : <Icon id="UserData" size={24} />}
        </button>
        <button
          onClick={() => {
            displayPreSignupUsersModal.value = false;
          }}
          class="btn btn-ghost uppercase font-medium"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

export default PreSignupUsersModal;
