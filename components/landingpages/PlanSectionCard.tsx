import Icon from "deco-sites/ecannadeco/components/ui/Icon.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  title: string;
  subtitle: string;
  /**
   * @titleBy title
   */
  plan: {
    title: string;
    price: number;
  };
  auxImg: ImageWidget;
}

// Make it sure to render it on the server only. DO NOT render it on an island
function PlanSelection({ title, subtitle, plan, auxImg }: Props) {
  return (
    <div
      class=" w-full flex flex-col gap-12 items-center my-14"
      id="planSection"
    >
      <div class="flex flex-col items-center gap-4 text-center px-4">
        <span class="text-4xl text-primary">{title}</span>
        <span>{subtitle}</span>
      </div>
      <div class="flex flex-col sm:flex-row items-center justify-around gap-12">
        <Image src={auxImg} width={487} height={306} alt="card image" />
        <div
          class="flex flex-col gap-2 text-white w-[257px] p-5 items-center rounded-lg relative"
          style={`background-image: linear-gradient(to bottom, #0A66A5, #1677B9);`}
        >
          <span class="uppercase tracking-[5px]">{plan.title}</span>
          <div class="flex items-end">
            <span class="text-5xl font-thin">R$ {plan.price}</span>
          </div>
          <ul class="flex flex-col gap-3 text-xs mt-4 mb-6">
            <li class="flex gap-2">
              <Icon id="CircleCheck" size={22} />{" "}
              <span>Carteirinha digital oficial</span>
            </li>
            <li class="flex gap-2">
              <Icon id="CircleCheck" size={22} />{" "}
              <span>Upload ilimitado de docs</span>
            </li>
            <li class="flex gap-2">
              <Icon id="CircleCheck" size={22} />{" "}
              <span>Segurança contra perdas e furtos</span>
            </li>
            <li class="flex gap-2">
              <Icon id="CircleCheck" size={22} />{" "}
              <span>Opção de pedir via física</span>
            </li>
          </ul>
          <a
            href="/cadastrar"
            class="btn bg-[#3094D7] uppercase text-white border-none rounded-full w-[190px] absolute bottom-[-20px]"
          >
            Cadastrar grátis
          </a>
        </div>
      </div>
    </div>
  );
}

export default PlanSelection;
