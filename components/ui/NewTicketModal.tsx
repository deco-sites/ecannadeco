import { useUI } from "../../sdk/useUI.ts";
import { useState } from "preact/hooks";
import Modal from "../../components/ui/Modal.tsx";
import { invoke } from "../../runtime.ts";

const ModalTicket = () => {
  const { displayNewTicketModal } = useUI();
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitTicket = async (e: Event) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const r = await invoke["deco-sites/ecannadeco"].actions.createTicket({
        email,
        subject,
        content,
      });

      const resp = r as { inlineMessage?: string };

      if (
        resp.inlineMessage &&
        resp.inlineMessage == "Obrigado por enviar o formulário."
      ) {
        setEmail("");
        setContent("");
        setSubject("");

        console.log({ responseTicker: r });
        setSubmitting(false);

        alert(
          "Recebemos seu ticket! Em breve, te retornaremos no email informado.",
        );
        displayNewTicketModal.value = false;
      }
    } catch (_e) {
      alert("Erro ao enviar ticket. Tente mais tarde");
      setSubmitting(false);
    }
  };

  return (
    <Modal
      loading="lazy"
      open={displayNewTicketModal.value}
      onClose={() => displayNewTicketModal.value = false}
    >
      <div class="flex flex-col p-16 gap-3 bg-[#EDEDED] rounded-xl">
        <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
          Novo Ticket de Suporte
        </h3>
        <input
          class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3] bg-white"
          placeholder="Seu email"
          value={email}
          onChange={(e) => {
            setEmail(e.currentTarget.value);
          }}
        />
        <input
          class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3] bg-white"
          placeholder="Título do seu ticket"
          value={subject}
          onChange={(e) => {
            setSubject(e.currentTarget.value);
          }}
        />
        <textarea
          class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3] bg-white h-32"
          placeholder="Descreva seu ticket"
          value={content}
          onChange={(e) => {
            setContent(e.currentTarget.value);
          }}
        />

        <button
          class="btn btn-secondary text-white"
          onClick={handleSubmitTicket}
          disabled={submitting}
        >
          {submitting ? "Enviando..." : "Enviar Ticket"}
        </button>
        <button
          onClick={() => displayNewTicketModal.value = false}
          class="btn btn-ghost uppercase font-medium"
          disabled={submitting}
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

const NewTicketModal = () => {
  const { displayNewTicketModal } = useUI();

  return (
    <>
      <button
        onClick={() => {
          displayNewTicketModal.value = true;
        }}
        class="btn btn-secondary text-white btn-xs"
      >
        Abrir ticket de suporte
      </button>
      <ModalTicket />
    </>
  );
};

export default NewTicketModal;
