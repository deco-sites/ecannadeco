import Icon from "../../components/ui/Icon.tsx";
import Modal from "../../components/ui/Modal.tsx";
import { useEffect, useState } from "preact/hooks";
import { useUI } from "../../sdk/useUI.ts";
import { h } from "preact";
import { invoke } from "../../runtime.ts";

interface DocListType {
  title: string;
  file_url: string;
  created_at: Date;
  category: string;
  status: string;
}

const DocList = ({ docs }: { docs: DocListType[] }) => {
  const { displayNewDocModal } = useUI();
  if (docs.length) {
    return (
      <ul>
        {docs.map((d) => {
          return (
            <li class="flex items-center">
              <a class="w-full" href={d.file_url}>
                <div class="flex justify-between rounded-xl bg-slate-300 w-full px-5 h-10 items-center">
                  <div class="flex gap-2">
                    <Icon id="Anexo" size={24} />
                    <span>{d.title}</span>
                  </div>
                  <span class="badge">{d.category}</span>
                </div>
              </a>
              <Icon id="Trash" size={24} />
            </li>
          );
        })}
      </ul>
    );
  } else {
    return (
      <div
        class="flex justify-between rounded-xl bg-red-300 w-full px-5 h-10 items-center cursor-pointer gap-4 text-red-600"
        onClick={() => {
          displayNewDocModal.value = true;
        }}
      >
        <span class="">
          Você ainda não tem documentos deste tipo. Clique para fazer upload
        </span>
        <Icon id="Upload" size={24} />
      </div>
    );
  }
};

const PlanLimitAlert = (
  { message, ctaText, ctaLink }: {
    message: string;
    ctaText: string;
    ctaLink: string;
  },
) => {
  const { displayPlanLimit } = useUI();

  return (
    <Modal
      loading="lazy"
      open={displayPlanLimit.value}
      onClose={() => displayPlanLimit.value = false}
    >
      <div class="p-10 bg-white flex flex-col justify-center items-center gap-10">
        <span class="text-center">{message}</span>
        <a class="btn btn-primary" href={ctaLink}>{ctaText}</a>
      </div>
    </Modal>
  );
};

const NewDocModal = ({ onFinishCreate }: { onFinishCreate: () => void }) => {
  const [file, setFile] = useState<File>();
  const [docTitle, setDocTitle] = useState("");
  const [docCategory, setDocCategory] = useState("");
  const { displayNewDocModal, displayPlanLimit } = useUI();
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

    formData.append("file", file!);
    formData.append("title", docTitle);
    formData.append("category", docCategory);

    console.log({ file, docTitle, docCategory });

    try {
      const response = await fetch("http://localhost:3000/documents", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: localStorage.getItem("AccessToken") || "",
          ContentType: "multipart/form-data",
        },
      });
      const r = await response.json();

      // console.log({ r });
      displayNewDocModal.value = false;

      setIsUploading(false);
      if (r.message === "You need to upgrade your plan to create documents") {
        displayPlanLimit.value = true;
      } else {
        //update uploadedFile flag state
        await invoke["deco-sites/ecannadeco"].actions.updateProfile({
          token: localStorage.getItem("AccessToken") || "",
          body: { uploadedFile: true },
        });

        onFinishCreate();
        alert("Upload concluído");
      }
    } catch (e) {
      console.log({ erroUpload: e });
      setIsUploading(false);
    }
  };

  return (
    <Modal
      loading="lazy"
      open={displayNewDocModal.value}
      onClose={() => displayNewDocModal.value = false}
    >
      <div class="flex flex-col p-16 gap-3 bg-white">
        <h3>Subir novo Documento</h3>
        <input
          class="input input-bordered"
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
          class="select select-primary w-full max-w-xs"
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
            class="file-input file-input-bordered file-input-xs w-full max-w-xs"
            onChange={(e) => handleStoreDocument(e)}
          />
        </label>

        <button class="btn btn-primary" onClick={handleCreate}>
          Subir Documento{"   "}{isUploading
            ? <span class="loading loading-spinner text-white"></span>
            : <Icon id="Upload" size={24} />}
        </button>
      </div>
    </Modal>
  );
};

function MyDocs() {
  const { displayNewDocModal } = useUI();
  const [isLoading, setIsLoading] = useState(false);
  const [docs, setDocs] = useState<DocListType[]>([]);

  const getDocuments = () => {
    const accessToken = localStorage.getItem("AccessToken") || "";

    try {
      setIsLoading(true);

      invoke["deco-sites/ecannadeco"].actions.getDocs({
        token: accessToken,
      }).then((r) => {
        console.log({ documents: r });
        setDocs((r as { docs: DocListType[] }).docs);
        setIsLoading(false);
      });
    } catch (e) {
      alert(
        "Não foi possível carregar os documentos. Tente novamente mais tarde ou contecte o suporte.",
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDocuments();
  }, []); // Passando um array de dependências vazio

  const medicalDocs = docs.filter((d) => d.category === "medical_prescription");
  const anvisaDocs = docs.filter((d) => d.category === "anvisa");
  const habeasDocs = docs.filter((d) => d.category === "habeas_corpus");
  const idDocs = docs.filter((d) => d.category === "identification");

  return (
    <div class="">
      <div class="flex justify-between mb-10">
        <h3>Meus Documentos</h3>
        <button
          class="btn btn-success"
          onClick={() => {
            displayNewDocModal.value = true;
          }}
        >
          Subir novo Documento
        </button>
        <NewDocModal onFinishCreate={getDocuments} />
        <PlanLimitAlert
          message="Seu plano permite upload de 2 documentos. Evolua seu plano para PREMIUM e suba mais documentos!"
          ctaLink="/"
          ctaText="Evoluir Plano"
        />
      </div>
      <div class="flex flex-col gap-3">
        <div class="p-9 bg-slate-100">
          <h2>Documentos de Anvisa</h2>
          {isLoading
            ? <span class="loading loading-spinner text-black"></span>
            : <DocList docs={anvisaDocs} />}
        </div>
        <div class="p-9 bg-slate-100">
          <h2>Documentos Médicos</h2>
          {isLoading
            ? <span class="loading loading-spinner text-black"></span>
            : <DocList docs={medicalDocs} />}
        </div>
        <div class="p-9 bg-slate-100">
          <h2>Documentos Judiciais</h2>
          {isLoading
            ? <span class="loading loading-spinner text-black"></span>
            : <DocList docs={habeasDocs} />}
        </div>
        <div class="p-9 bg-slate-100">
          <h2>Documentos de Identificação</h2>
          {isLoading
            ? <span class="loading loading-spinner text-black"></span>
            : <DocList docs={idDocs} />}
        </div>
      </div>
    </div>
  );
}

export default MyDocs;
