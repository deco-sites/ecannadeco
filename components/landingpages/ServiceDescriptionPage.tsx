import Icon, { AvailableIcons } from "../ui/Icon.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { invoke } from "../../runtime.ts";

export interface Props {
  bgImage?: ImageWidget;
  icon?: AvailableIcons;
  image?: ImageWidget;
  header: string;
  /**@format html */
  text: string;
  ctaText: string;
  serviceLabel: string;
}

// Make it sure to render it on the server only. DO NOT render it on an island
function ServiceDescriptionPage({
  icon,
  image,
  header,
  text,
  ctaText,
  serviceLabel,
}: Props) {
  const handleClick = async () => {
    let accessToken = "";
    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AccessToken") || "";
      localStorage.setItem("servicePipeline", serviceLabel);
    }

    if (accessToken) {
      await invoke["deco-sites/ecannadeco"].actions.generateLead({
        token: accessToken,
        interest: serviceLabel,
      });
      alert(
        `Obrigado pelo interesse em breve nossa equipe irá entrar em contato com você para te explicar os próximos passos.`,
      );
      window.location.href = "/dashboard";
    } else {
      if (serviceLabel == "carteirinha") {
        alert(
          `Estamos quase lá! Finalize o cadastro (menos de 1 minuto), e siga os passos para adquirir sua carteirinha`,
        );
      } else if (serviceLabel == "anvisa") {
        alert(
          `Estamos quase lá! Finalize o cadastro (menos de 1 minuto), e siga os passos para conseguir sua autorização da Anvisa`,
        );
      } else {
        alert(
          `Estamos quase lá! Finalize o cadastro (menos de 1 minuto), que nossa equipe entrará em contato para conduzir seu processo de ${header}`,
        );
      }
      window.location.href = "/cadastrar";
    }
  };

  return (
    <div
      class="h-full w-full bg-cover bg-center min-h-[87vh]"
      style={`background: linear-gradient(to bottom, #0098ff, #022a38);`}
    >
      <div class="container text-white flex flex-col gap-10 items-center py-12">
        <div class="flex flex-col gap-10 items-center max-w-[400px]">
          <div class="w-full flex">
            <button
              class="btn btn-sm btn-ghost text-white"
              onClick={() => window.history.back()}
            >
              <Icon id="GoBack" size={19} />
            </button>
          </div>
          {icon ? <Icon id={icon} size={56} /> : (
            image && (
              <Image
                src={image}
                width={367}
                height={110}
                alt="imagem associação"
              />
            )
          )}
          <h1 class="text-2xl font-extrabold text-center uppercase">
            {header}
          </h1>
          <div
            class="text-center text-white [&_ul]:list-disc [&_ul]:text-left"
            dangerouslySetInnerHTML={{ __html: text }}
          />
          <button
            class="btn bg-white text-primary uppercase"
            onClick={handleClick}
          >
            {ctaText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceDescriptionPage;
