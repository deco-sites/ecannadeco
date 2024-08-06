import Icon from "deco-sites/ecannadeco/components/ui/Icon.tsx";

export interface Props {
  title: string;
  subtitle: string;
  /**
   * @titleBy title
   */
  plans: {
    title: string;
    freeDays: number;
    price: number;
    period: string;
  }[];
}

// Make it sure to render it on the server only. DO NOT render it on an island
function PlanSelection({ title, subtitle, plans }: Props) {
  return (
    <div
      class=" w-full flex flex-col gap-12 items-center my-14"
      id="planSection"
    >
      <div class="flex flex-col items-center gap-4 text-center px-4">
        <span class="text-4xl text-primary">{title}</span>
        <span>{subtitle}</span>
      </div>
      <div class="flex flex-col sm:flex-row justify-around gap-12">
        {plans.map((plan) => {
          return (
            <div
              class="flex flex-col gap-2 text-white w-[257px] p-5 items-center rounded-lg relative"
              style={`background-image: linear-gradient(to bottom, #0A66A5, #1677B9);`}
            >
              <span class="uppercase tracking-[5px]">{plan.title}</span>
              <span>
                {plan.freeDays} dias{" "}
                <span class="uppercase font-bold">grátis</span>
              </span>
              <div class="flex items-end">
                <span class="text-5xl font-thin">R$ {plan.price}</span>
                <span>/{plan.period}</span>
              </div>
              <ul class="flex flex-col gap-3 text-xs mt-4 mb-6">
                <li class="flex gap-2">
                  <Icon id="CircleCheck" size={22} />{" "}
                  <span>Acompanhamento individual de cada paciente</span>
                </li>
                <li class="flex gap-2">
                  <Icon id="CircleCheck" size={22} />{" "}
                  <span>Gráfico de evolução do bem estar dos pacientes</span>
                </li>
                <li class="flex gap-2">
                  <Icon id="CircleCheck" size={22} />{" "}
                  <span>Upload de Prescrição / Receita / laudo médico</span>
                </li>
                <li class="flex gap-2">
                  <Icon id="CircleCheck" size={22} />{" "}
                  <span>Ajuste de tratamento - posologia e medicações</span>
                </li>
              </ul>
              <a
                href="/prescritor/cadastrar"
                class="btn bg-[#3094D7] uppercase text-white border-none rounded-full w-[190px] absolute bottom-[-20px]"
              >
                Começar grátis
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PlanSelection;
