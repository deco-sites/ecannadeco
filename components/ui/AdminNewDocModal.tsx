import { useUI } from "../../sdk/useUI.ts";
import Modal from "./Modal.tsx";
import { useState } from "preact/hooks";
import { h } from "preact";
import { invoke } from "../../runtime.ts";
import Icon from "./Icon.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";

export interface Props {
  createType: "association" | "user";
}

const AdminNewDocModal = (
  { createType }: Props,
) => {
  const [file, setFile] = useState<File>();
  const [docTitle, setDocTitle] = useState("");
  const [docCategory, setDocCategory] = useState("");
  const [accessToken, setAccessToken] = useState(
    IS_BROWSER ? (localStorage.getItem("AccessToken") || "") : "",
  );

  const {
    displayAssociationAdminNewDoc,
    userToAdminCreateDoc,
    associationToAdminCreateDoc,
  } = useUI();
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
    setIsUploading(true);

    const formData = new FormData();
    let url = "";

    if (createType === "user") {
      url =
        "http://http://production.eba-93ecmjzh.us-east-1.elasticbeanstalk.com//documents/admin/user";
      formData.append("user", userToAdminCreateDoc.value._id);
    } else if (createType === "association") {
      url =
        "http://http://production.eba-93ecmjzh.us-east-1.elasticbeanstalk.com//documents/admin/association";
      formData.append("association", associationToAdminCreateDoc.value._id);
    }

    formData.append("file", file!);
    formData.append("title", docTitle);
    formData.append("category", docCategory);

    for (const entry of formData.entries()) {
      console.log(entry[0], entry[1]);
    }

    try {
      const response = await fetch(
        url,
        {
          method: "POST",
          body: formData,
          headers: {
            ContentType: "multipart/form-data",
            Authorization: accessToken,
          },
        },
      );

      const res = await response.json();

      console.log({ res });

      const resp = res as { errors?: unknown[]; message?: string };

      if (resp.errors || resp.message) {
        if (resp.errors) {
          throw new Error(resp.errors.toString());
        } else if (resp.message) {
          throw new Error(resp.message);
        }
      }

      setIsUploading(false);
      displayAssociationAdminNewDoc.value = false;
      setFile(undefined);
      setDocTitle("");
      setDocCategory("");
      alert("Upload concluído com sucesso");
    } catch (e) {
      alert("Ocorreu um erro ao subir o documento. Contacte o suporte");
      console.log({ erroUpload: e });
      setIsUploading(false);
    }
  };

  return (
    <Modal
      loading="lazy"
      open={displayAssociationAdminNewDoc.value}
      onClose={() => displayAssociationAdminNewDoc.value = false}
    >
      <div class="flex flex-col p-16 gap-3 bg-[#EDEDED] rounded-xl">
        <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
          Novo documento para{"  "}{createType === "user"
            ? `paciente ${userToAdminCreateDoc.value.email}`
            : `Associação ${associationToAdminCreateDoc.value.name}`}
        </h3>
        <input
          class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3] bg-white"
          placeholder="Título do Documento"
          value={docTitle}
          onChange={(e) => {
            setDocTitle(e.currentTarget.value);
          }}
        />

        <select
          onChange={(e) => {
            setDocCategory(e.currentTarget.value);
          }}
          class="select select-primary w-full max-w-xs text-[#8b8b8b] border-none disabled:bg-[#e3e3e3] bg-white"
        >
          <option disabled selected>Tipo de Documento</option>
          <option value="habeas_corpus">Jurídico / Habeas Corpus</option>
          <option value="medical_prescription">Prescrição Médica</option>
          <option value="anvisa">Autorização Anvisa</option>
          <option value="identification">Documento de Identificação</option>
        </select>

        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Selecione um arquivo</span>
          </div>
          <input
            type="file"
            class="file-input file-input-primary w-full max-w-xs"
            onChange={(e) => handleStoreDocument(e)}
          />
        </label>

        <button class="btn btn-secondary text-white" onClick={handleCreate}>
          Subir Documento{"   "}{isUploading
            ? <span class="loading loading-spinner text-white"></span>
            : <Icon id="Upload" size={24} />}
        </button>
        <button
          onClick={() => {
            displayAssociationAdminNewDoc.value = false;
          }}
          class="btn btn-ghost uppercase font-medium"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

export default AdminNewDocModal;
