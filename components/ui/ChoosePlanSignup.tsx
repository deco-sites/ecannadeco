import FormWrap from "./FormWrap.tsx";
import { useEffect, useState } from "preact/hooks";
import Slider from "../../components/ui/Slider.tsx";
import { Plan } from "../../components/ui/Checkout.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";

function ConfirmSignup() {
  const [newPlan, setNewPlan] = useState<Plan>();
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    try {
      const _params = fetch(
        `https://api.ecanna.com.br/v1/products/subscriptions?isPrescriber=false`,
      ).then(async (r) => {
        const c = await r.json();
        console.log({ plans: c.docs });

        const plansList = c.docs as Plan[];
        setPlans(plansList);
      });
    } catch (_e) {
      alert(
        "Não foi possível carregar planos. Contacte o suporte.",
      );
    }
  }, []); // Passando um array de dependências vazio

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (IS_BROWSER) {
      localStorage.setItem("planSKU", newPlan!.skus[0]);
      localStorage.setItem("planName", newPlan!.name);
      localStorage.setItem("planPrice", String(newPlan!.price));
      localStorage.setItem("planPeriod", newPlan!.period);
    }

    window.location.href = "/confirmar-cadastro/checkout";
  };

  return (
    <FormWrap large={true}>
      <div class="">
        <form
          class="form-control flex flex-col gap-2"
          onSubmit={(e) => handleSubmit(e)}
        >
          <span class="text-2xl text-[#8b8b8b] font-semibold text-center my-4">
            Para começar, é GRÁTIS
          </span>
          <span class="label-text text-xs text-[#585858]">
            Selecione seu plano
          </span>
          <Slider class="carousel gap-3 max-w-[105%]">
            {plans.map((plan, i) => (
              <Slider.Item class="carousel-item" index={i}>
                <div
                  class="bg-white rounded-md p-3 flex flex-col justify-between"
                  onClick={() =>
                    setNewPlan(
                      plans.find((p) =>
                        p.name === plan.name
                      ),
                    )}
                >
                  <div class="flex items-center gap-4">
                    <div
                      class={`h-8 w-8 rounded-full ${
                        plan.name == (newPlan?.name)
                          ? "bg-primary flex items-center justify-center"
                          : "bg-white"
                      }`}
                      style={{
                        "box-shadow": "inset 1px 3px 7px rgb(0 0 0 / 20%)",
                      }}
                    >
                      {plan.name == (newPlan?.name) && (
                        <Icon class="text-white" id="Check" size={19} />
                      )}
                    </div>
                    <div class="flex flex-col text-[#898989]">
                      <span class=" uppercase text-sm">{plan.name}</span>
                      <span class="text-xs">
                        {"R$ " + (plan.price / 100).toFixed(2) + "/" +
                          (plan.period === "MONTHLY" && "mês")}
                      </span>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2">
                    {plan.name === "CARTEIRINHA" && (
                      <span class="text-xs font-semibold mt-2 text-primary">
                        30 dias grátis
                      </span>
                    )}
                    <ul class="flex flex-col gap-3">
                      <li class="flex gap-3 items-center">
                        <Icon
                          class="text-primary"
                          id="CircleCheck"
                          size={17}
                        />
                        <span class="text-[10px]">
                          Carteirinha digital oficial
                        </span>
                      </li>
                      <li
                        // class={`flex gap-3 items-center ${
                        //   plan.name == "FREE" && "opacity-20"
                        // }`}
                        class={`flex gap-3 items-center`}
                      >
                        <Icon
                          class="text-primary"
                          id="CircleCheck"
                          size={17}
                        />
                        <span class="text-[10px]">
                          Upload ilimitado de documentos
                        </span>
                      </li>
                      <li
                        // class={`flex gap-3 items-center ${
                        //   plan.name == "FREE" && "opacity-20"
                        // }`}
                        class={`flex gap-3 items-center`}
                      >
                        <Icon
                          class="text-primary"
                          id="CircleCheck"
                          size={17}
                        />
                        <span class="text-[10px]">Carteirinha física</span>
                      </li>
                      <li
                        // class={`flex gap-3 items-center ${
                        //   plan.name == "FREE" && "opacity-20"
                        // }`}
                        class={`flex gap-3 items-center`}
                      >
                        <Icon
                          class="text-primary"
                          id="CircleCheck"
                          size={17}
                        />
                        <span class="text-[10px]">
                          Acesso acompanhamento de Tratamento
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Slider.Item>
            ))}
          </Slider>
          <button
            type={"submit"}
            class="btn btn-primary text-white mt-5 disabled:loading border-none"
          >
            {"Escolher Plano"}
          </button>
        </form>
      </div>
    </FormWrap>
  );
}

export default ConfirmSignup;
