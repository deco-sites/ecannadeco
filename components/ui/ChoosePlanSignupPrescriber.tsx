import FormWrap from "./FormWrap.tsx";
import { useEffect, useState } from "preact/hooks";
import Slider from "./Slider.tsx";
import { Plan } from "./Checkout.tsx";
import Icon from "./Icon.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import SliderJS from "../../islands/SliderJS.tsx";
import { useId } from "../../sdk/useId.ts";

function ChoosePlanSignupPrescriber() {
  const [loading, setLoading] = useState(true);
  const [newPlan, setNewPlan] = useState<Plan>();
  // const [hiddenPlan, setHiddenPlan] = useState<Plan>();
  // const [insertedCode, setInsertedCode] = useState("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const id = useId();

  useEffect(() => {
    setLoading(true);
    try {
      const _params = fetch(
        `https://api.ecanna.com.br/v1/products/subscriptions?isPrescriber=true&isActive=true`,
      ).then(async (r) => {
        const c = await r.json();
        console.log({ plans: c.docs });

        const plansList = c.docs as Plan[];

        // const hidden = plansList.find((p) => p.plan === "ONBOARDING");

        // const updatedPlanlist = plansList.filter(
        //   (p) => p.plan !== "ONBOARDING"
        // );

        // setHiddenPlan(hidden!);
        setPlans(plansList);
        setLoading(false);
      });
    } catch (_e) {
      alert("Não foi possível carregar planos. Contacte o suporte.");
    }
  }, []); // Passando um array de dependências vazio

  // const handleSubmitCode = () => {
  //   const promoCode = "CANNABISFAIR2024";

  //   console.log({ insertedCode, promoCode });

  //   if (!insertedCode || insertedCode == "") {
  //     alert("Informe o código para continuar");
  //     return null;
  //   } else if (insertedCode !== promoCode) {
  //     console.log("aqui2");
  //     alert("Código inválido");
  //     return null;
  //   } else {
  //     const planList = [...plans];
  //     setPlans(planList);
  //     alert("Código Aplicado com Sucesso!");
  //   }
  // };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (IS_BROWSER) {
      localStorage.setItem("planSKUPrescriber", newPlan!.skus[0]);
      localStorage.setItem("planNamePrescriber", newPlan!.name);
      localStorage.setItem("planPricePrescriber", String(newPlan!.price));
      localStorage.setItem("planPeriodPrescriber", newPlan!.period);
      localStorage.setItem(
        "planStartBillingPrescriber",
        String(newPlan!.startBilling),
      );
    }

    window.location.href = "/prescritor/confirmar-cadastro/checkout";
  };

  return (
    <FormWrap large={true}>
      <div class="">
        {loading
          ? (
            <div class="w-full flex justify-center">
              <span class="loading loading-spinner w-4" />
            </div>
          )
          : (
            <form
              class="form-control flex flex-col gap-2"
              onSubmit={(e) => handleSubmit(e)}
            >
              <span class="text-2xl text-[#8b8b8b] font-semibold text-center my-4">
                Planos para Prescritores
              </span>
              <span class="label-text text-xs text-[#585858]">
                Selecione seu plano
              </span>
              <div id={id}>
                <Slider class="carousel gap-3 max-w-[105%]">
                  {plans.map((plan, i) => (
                    <Slider.Item class="carousel-item" index={i}>
                      <div
                        class="bg-white rounded-md p-3 flex flex-col justify-between"
                        onClick={() =>
                          setNewPlan(plans.find((p) =>
                            p.name === plan.name
                          ))}
                      >
                        <div class="flex items-center gap-4">
                          <div
                            class={`h-8 w-8 rounded-full ${
                              plan.name == newPlan?.name
                                ? "bg-primary flex items-center justify-center"
                                : "bg-white"
                            }`}
                            style={{
                              "box-shadow":
                                "inset 1px 3px 7px rgb(0 0 0 / 20%)",
                            }}
                          >
                            {plan.name == newPlan?.name && (
                              <Icon class="text-white" id="Check" size={19} />
                            )}
                          </div>
                          <div class="flex flex-col text-[#898989]">
                            <span class=" uppercase text-sm">{plan.name}</span>
                            <span class="text-xs">
                              {"R$ " +
                                (plan.price / 100).toFixed(2) +
                                "/" +
                                (plan.period === "MONTHLY" && "mês")}
                            </span>
                          </div>
                        </div>
                        <div class="flex flex-col gap-2">
                          {plan.startBilling && plan.startBilling > 0 && (
                            <span class="text-xs font-semibold mt-2 text-primary">
                              {plan.startBilling} dias grátis
                            </span>
                          )}
                          <ul class="flex flex-col gap-3 py-4">
                            <li class="flex gap-3 items-center">
                              <Icon
                                class="text-primary"
                                id="CircleCheck"
                                size={17}
                              />
                              <span class="text-[10px]">
                                Gestão visual de paciente/tratamento
                              </span>
                            </li>
                            <li class="flex gap-3 items-center">
                              <Icon
                                class="text-primary"
                                id="CircleCheck"
                                size={17}
                              />
                              <span class="text-[10px]">
                                Gestão de assiduidade de tratamento
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
                                Visão gráfica de histórico de tratamento
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
                                Atualização de posologia/medicação
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
                              <span class="text-[10px]">Login do paciente</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </Slider.Item>
                  ))}
                </Slider>
                <div class="hidden md:flex justify-center ">
                  <div class=" block z-10 col-start-1 row-start-3">
                    <Slider.PrevButton class=" w-12 h-12 flex justify-center items-center">
                      <Icon
                        size={24}
                        id="ChevronLeft"
                        strokeWidth={3}
                        class="w-5"
                      />
                    </Slider.PrevButton>
                  </div>
                  <div class=" block z-10 col-start-3 row-start-3">
                    <Slider.NextButton class=" w-12 h-12 flex justify-center items-center">
                      <Icon size={24} id="ChevronRight" strokeWidth={3} />
                    </Slider.NextButton>
                  </div>
                </div>
                <SliderJS rootId={id} />
              </div>

              {
                /* <div class="collapse max-w-[330px]">
              <input type="checkbox" />
              <div class="collapse-title text-xl font-medium">
                <span class="underline text-sm">
                  Inserir Código Promocional
                </span>
              </div>
              <div class="collapse-content flex flex-col gap-[48px]">
                <div class="w-full bg-[#d2d2d2] p-4 rounded-md">
                  <label class="w-full sm:w-[48%]">
                    <div class="label pb-1">
                      <span class="label-text text-xs text-[#585858]">
                        Código Promocional
                      </span>
                    </div>
                    <input
                      class="input rounded-l-md rounded-r-none text-[#8b8b8b] input-xs border-none"
                      placeholder="insira aqui"
                      name="insertedCode"
                      value={insertedCode}
                      onChange={(e) => {
                        setInsertedCode(e.currentTarget.value);
                      }}
                    />
                    <button
                      class="btn btn-xs border-none bg-secondary text-white rounded-r-md rounded-l-none font-normal join-item"
                      type="button"
                      onClick={handleSubmitCode}
                    >
                      Validar Código
                    </button>
                  </label>
                </div>
              </div>
            </div> */
              }

              <button
                type={"submit"}
                class="btn btn-primary text-white mt-5 disabled:loading border-none"
              >
                {"Escolher Plano"}
              </button>
            </form>
          )}
      </div>
    </FormWrap>
  );
}

export default ChoosePlanSignupPrescriber;
