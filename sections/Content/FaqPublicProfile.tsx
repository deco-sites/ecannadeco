import Header from "../../components/ui/SectionHeader.tsx";

export interface Answer {
  videoUrl?: string;
  /** @format html */
  text: string;
  link?: {
    description?: string;
    url?: string;
  };
}

export interface Question {
  question: string;
  answer: Answer;
}

export interface Props {
  questions?: Question[];
  layout?: {
    variation?: "Compact" | "Full" | "Side to side";
    headerAlignment?: "center" | "left";
  };
}

const DEFAULT_PROPS = {
  title: "",
  description: "",
  questions: [
    {
      question: "Como faço para acompanhar o meu pedido?",
      answer: {
        text:
          "Acompanhar o seu pedido é fácil! Assim que o seu pedido for enviado, enviaremos um e-mail de confirmação com um número de rastreamento. Basta clicar no número de rastreamento ou visitar o nosso site e inserir o número de rastreamento na seção designada para obter atualizações em tempo real sobre a localização e o status de entrega do seu pedido.",
        videoUrl:
          "https://www.youtube.com/embed/plJd00hPDIo?si=iIbpelcHSjjrj4Vg",
      },
    },
    {
      question: "Como faço para acompanhar o meu pedido?",
      answer: {
        text:
          "Acompanhar o seu pedido é fácil! Assim que o seu pedido for enviado, enviaremos um e-mail de confirmação com um número de rastreamento. Basta clicar no número de rastreamento ou visitar o nosso site e inserir o número de rastreamento na seção designada para obter atualizações em tempo real sobre a localização e o status de entrega do seu pedido.",
        videoUrl:
          "https://www.youtube.com/embed/plJd00hPDIo?si=iIbpelcHSjjrj4Vg",
      },
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
  console.log({ answer });
  return (
    <details class="collapse collapse-arrow border-t bg-[#EDEDED]">
      <summary class="collapse-title text-lg font-medium">{question}</summary>
      <div class="collapse-content">
        {answer.videoUrl && (
          <div class="w-full flex justify-center mb-4">
            <iframe
              class="w-[370px] h-[210px]"
              src={answer.videoUrl}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: answer.text }} />
        {answer.link && (
          <div class="w-full flex my-4 text-blue-600 underline">
            <a href={answer.link.url} target="_blank">
              {answer.link.description}
            </a>
          </div>
        )}
      </div>
    </details>
  );
}

export default function FAQ(props: Props) {
  const {
    questions = [],
    title,
    description,
    layout,
  } = { ...DEFAULT_PROPS, ...props };

  return (
    <>
      {(!layout?.variation || layout?.variation === "Compact") && (
        <div class="w-[90%] max-w-[800px] container flex flex-col mb-4">
          <div class="flex flex-col gap-8 lg:gap-10">
            <Header
              title={title || ""}
              description={description || ""}
              alignment={layout?.headerAlignment || "center"}
            />
            <div class="join join-vertical w-full flex flex-col gap-2">
              {questions.map((question) => <Question {...question} />)}
            </div>
          </div>
        </div>
      )}

      {layout?.variation === "Full" && (
        <div class="w-full container px-4 py-8 flex flex-col gap-4 lg:gap-8 lg:py-10 lg:px-0">
          <div class="flex flex-col gap-8 lg:gap-10">
            <Header
              title={title || ""}
              description={description || ""}
              alignment={layout?.headerAlignment || "center"}
            />
            <div class="join join-vertical w-full">
              {questions.map((question) => <Question {...question} />)}
            </div>
          </div>
        </div>
      )}

      {layout?.variation === "Side to side" && (
        <div class="w-full container px-4 py-8 grid gap-8 grid-flow-row grid-cols-1 lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-2 lg:py-10 lg:px-0">
          <div class="order-1 lg:order-1">
            <Header
              title={title || ""}
              description={description || ""}
              alignment={layout?.headerAlignment || "center"}
            />
          </div>
          <div class="order-2 lg:order-3 lg:row-span-2">
            <div class="join join-vertical">
              {questions.map((question) => <Question {...question} />)}
            </div>
          </div>
          <div class="order-3 lg:order-2"></div>
        </div>
      )}
    </>
  );
}
