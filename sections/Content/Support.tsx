import NewTicketModal from "../../islands/NewTicketModal.tsx";

export interface Question {
  question: string;
  /** @format html */
  answer: string;
}

export interface Props {
  title?: string;
  questions?: Question[];
}

const DEFAULT_PROPS = {
  title: "",
  description: "",
  questions: [
    {
      question: "Como faço para acompanhar o meu pedido?",
      answer:
        "Acompanhar o seu pedido é fácil! Assim que o seu pedido for enviado, enviaremos um e-mail de confirmação com um número de rastreamento. Basta clicar no número de rastreamento ou visitar o nosso site e inserir o número de rastreamento na seção designada para obter atualizações em tempo real sobre a localização e o status de entrega do seu pedido.",
    },
    {
      question: "Qual é a política de devolução?",
      answer:
        "Oferecemos uma política de devolução sem complicações. Se você não estiver completamente satisfeito(a) com a sua compra, pode devolver o item em até 30 dias após a entrega para obter um reembolso total ou troca. Certifique-se de que o item esteja sem uso, na embalagem original e acompanhado do recibo. Entre em contato com a nossa equipe de atendimento ao cliente e eles o(a) orientarão pelo processo de devolução.",
    },
  ],
  contact: {
    title: "",
    description: "",
    button: {
      text: "",
      link: "",
    },
  },
};

function Question({ question, answer }: Question) {
  return (
    <details class="collapse collapse-arrow border-t bg-[#EDEDED]">
      <summary class="collapse-title text-lg font-medium">
        {question}
      </summary>
      <div class="collapse-content">
        <div
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      </div>
    </details>
  );
}

export default function FAQ(props: Props) {
  const {
    questions = [],
    title,
  } = { ...DEFAULT_PROPS, ...props };

  return (
    <div class="w-full flex justify-center">
      <div class="w-[90%] max-w-[800px] px-4 py-8 flex flex-col gap-4 items-center justify-center">
        <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center mb-10">
          {title}
        </h3>
        <div class="join join-vertical w-full flex flex-col gap-2">
          {questions.map((question) => <Question {...question} />)}
        </div>
        <div class="flex flex-col items-center gap-2">
          <span class="text-xs">Não encontrou resposta para sua pergunta?</span>
          <NewTicketModal />
        </div>
      </div>
    </div>
  );
}
