import Icon from "deco-sites/ecannadeco/components/ui/Icon.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";

export type Deal = {
  _id: string;
  type: string;
  partner_name: string;
  discount?: number;
};

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
  const [deal, setDeal] = useState<Deal>();
  const [cnpj, setCNPJ] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (IS_BROWSER) {
      // const params = new URLSearchParams(globalThis.location.search);
      // const ref = params.get("ref");
      const ref = localStorage.getItem("referral");
      const cnpj = localStorage.getItem("legacyAssociationCNPJ");

      if (cnpj) {
        setCNPJ(cnpj);
      }

      if (ref) {
        setLoading(true);
        invoke["deco-sites/ecannadeco"].actions
          .getDeal({
            term: ref,
          })
          .then((r) => {
            setDeal(r as Deal);
            setLoading(false);
          });
      }
    }
  }, []);

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
          {loading
            ? (
              <div class="flex flex-col items-center">
                <span class="text-5xl font-thin">Carregando...</span>
              </div>
            )
            : (
              <>
                <div class="flex flex-col items-center">
                  <span
                    class={` font-thin ${
                      deal?.discount ? "line-through" : "text-5xl"
                    }`}
                  >
                    R$ {plan.price}
                  </span>
                  {deal?.discount
                    ? (
                      <>
                        <span class="text-5xl font-thin">
                          R$ {plan.price * (1 - deal.discount)}
                        </span>
                        <span>(Desconto {deal.partner_name})</span>
                      </>
                    )
                    : null}
                </div>
              </>
            )}

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
            href={`/cadastrar${cnpj ? `?cnpj=${cnpj}` : null}`}
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
