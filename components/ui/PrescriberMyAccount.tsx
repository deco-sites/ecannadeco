/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
// import { useUI } from "../../sdk/useUI.ts";
import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import { Plan } from "./Checkout.tsx";
import PageWrap from "./PageWrap.tsx";
import Icon from "./Icon.tsx";
import ModalConfirm from "./ModalConfirm.tsx";
import { SavedCreditCard } from "./CheckoutUpsellModal.tsx";
import CheckoutUpsellModalPrescriber from "../../islands/CheckoutUpsellModalPrescriber.tsx";
import Slider from "./Slider.tsx";
import { useUI } from "../../sdk/useUI.ts";
import SliderJS from "../../islands/SliderJS.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useId } from "../../sdk/useId.ts";
import { difference } from "https://deno.land/std@0.222.1/datetime/difference.ts";

export type Address = {
  cep: string;
  number: string;
  complement: string;
  addressType: string;
};

function MyAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [_isChanging, setIsChanging] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [email, setEmail] = useState("");
  const [currentPlan, setCurrentPlan] = useState<string>("");
  const [newPlan, setNewPlan] = useState<Plan>();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [address, setAddress] = useState<Address>();
  const [creditCards, setCreditCards] = useState<SavedCreditCard[]>([]);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const { displayConfirmCancelSubscription, displayCheckoutUpsellModal } =
    useUI();
  const id = useId();
  const [daysToEndTrial, setDaysToEndTrial] = useState(0);

  useEffect(() => {
    // Pega accessCode no localStorage para verificar se ainda está válida a sessão via api
    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("PrescriberAccessToken") || "";
    }

    if (accessToken === "") {
      window.location.href = "/";
    }

    try {
      setIsLoading(true);

      const _params = fetch(
        `https://api.ecanna.com.br/v1/products/subscriptions?isPrescriber=true`
      ).then(async (r) => {
        const c = await r.json();

        const plansList = c.docs as Plan[];

        //remove the ONBOARDING plan from list
        const updatedPlanlist = plansList.filter(
          (p) => p.plan !== "ONBOARDING"
        );

        setPlans(updatedPlanlist);

        invoke["deco-sites/ecannadeco"].actions
          .getUserPrescriber({
            token: accessToken,
          })
          .then((r) => {
            const res = r as {
              plan: string;
              credit_cards: SavedCreditCard[];
              address: Address[];
              name: string;
              email: string;
              free_days: number;
              created_at: string;
            };

            //calculate end of trial date, based on created_at and free_days
            const endTrialDate = new Date(res.created_at);
            endTrialDate.setDate(endTrialDate.getDate() + res.free_days);

            //difference in days from today to the end of the trial
            const daysLeft = difference(new Date(), endTrialDate, {
              units: ["days"],
            });

            setDaysToEndTrial(Number(daysLeft.days));

            if (res.address.length > 0) {
              const billingAddress = res.address.find(
                (a) => a.addressType === "BILLING"
              );
              setAddress(billingAddress);
            }

            setEmail(res.email || "");
            setCurrentPlan(res.plan);
            setNewPlan(plansList.find((p) => p.plan === res.plan));
            setCreditCards(res.credit_cards);

            setIsLoading(false);
          })
          .catch((e) => {
            throw new Error(e);
          });
      });
    } catch (_e) {
      alert(
        "Não foi possível carregar dados do usuário. Tente novamente mais tarde ou contecte o suporte."
      );
      setIsLoading(false);
    }
  }, []); // Passando um array de dependências vazio

  const _handleChangePassword = () => {
    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("PrescriberAccessToken") || "";
    }

    if (confirmNewPassword !== newPassword || !currentPassword) {
      alert(
        "Verifique os campos necessários para alterar a senha e tente novamente."
      );
    } else {
      try {
        setIsChanging(true);

        invoke["deco-sites/ecannadeco"].actions
          .changePassword({
            token: accessToken,
            body: {
              newPassword: confirmNewPassword,
              oldPassword: currentPassword,
            },
          })
          .then((r) => {
            const res = r as { message?: string };
            if (res.message) {
              alert(res.message);
            } else {
              console.log({ r });
              setCurrentPassword("");
              setNewPassword("");
              setConfirmNewPassword("");
              setIsChanging(false);
              alert("senha alterada com sucesso!");
            }
          });
      } catch (_e) {
        alert("Não foi possível alterar a senha. Tente mais tarde");
        setIsChanging(false);
      }
    }
  };

  const handleCancelSubscription = async () => {
    setIsCanceling(true);
    try {
      const r = await invoke["deco-sites/ecannadeco"].actions.createTicket({
        email,
        subject: "[CANCELAR] Pedido para cancelar assinatura",
        content: "Olá, gostaria de cancelar minha assinatura.",
      });

      const resp = r as { inlineMessage?: string };

      if (
        resp.inlineMessage &&
        resp.inlineMessage == "Obrigado por enviar o formulário."
      ) {
        console.log({ responseTicker: r });

        displayConfirmCancelSubscription.value = false;
        setIsCanceling(false);

        alert(
          "Foi aberto chamado com requisição de cancelar assinatura! Em breve, te retornaremos no email da conta."
        );
      }
    } catch (_e) {
      alert("Erro ao enviar solicitação. Tente mais tarde");
      setIsCanceling(false);
    }
  };

  return (
    <PageWrap>
      {isLoading ? (
        <span class="loading loading-spinner text-green-600"></span>
      ) : (
        <div class="flex flex-col gap-3 w-full">
          <div class="flex justify-center">
            <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
              Minha Conta
            </h3>
          </div>
          {currentPlan == "DEFAULT" && daysToEndTrial > 0 && (
            <div class="rounded p-4 bg-green-700 text-white flex flex-col gap-3 items-center justify-center">
              <Icon id="LoyaltyClub" size={28} />
              <span class="text-lg">
                Você possui <span class="font-bold">{daysToEndTrial}</span> dias
                de teste gratuito
              </span>
              <span class="text-center text-sm">
                Enquanto isso, aproveite para acompanhar o tratamento dos seus
                pacientes, fazer ajustes de dose e subir prescrições sem
                qualquer custo!
              </span>
            </div>
          )}
          {currentPlan == "DEFAULT" && daysToEndTrial <= 0 && (
            <div class="rounded p-4 bg-primary text-white flex flex-col gap-3 items-center justify-center">
              <Icon id="Info" size={28} />
              <span class="text-lg">
                Seu período de testa gratuito terminou. Escolha um plano para
                continuar!
              </span>
              <span class="text-center text-sm">
                Continue a acompanhar o tratamento dos seus pacientes, fazer
                ajustes de dose e subir prescrições de forma facilitada!
              </span>
              <a class="btn bg-white text-primary btn-sm" href="#planUpgrade">
                Escolher um plano
              </a>
            </div>
          )}
          <div class="flex flex-col gap-3">
            <label class="form-control w-full">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">Email</span>
              </div>
              <input
                placeholder="Email"
                class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3]"
                name="name"
                disabled
                value={email}
              />
            </label>
          </div>
          {/* <div class="w-full sm:w-[60%] md:w-[40%] flex flex-col gap-3">
              <h2 class="text-[#8b8b8b] font-semibold mb-4 w-full">
                Alterar Senha
              </h2>
              <label class="form-control w-full">
                <div class="label pb-1">
                  <span class="label-text text-xs text-[#585858]">
                    Senha Atual
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="*********"
                  class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3]"
                  name="currentPassword"
                  value={currentPassword}
                  onChange={(e) =>
                    e.target &&
                    setCurrentPassword(e.currentTarget.value)}
                  disabled={isChanging}
                />
              </label>
              <label class="form-control w-full">
                <div class="label pb-1">
                  <span class="label-text text-xs text-[#585858]">
                    Nova Senha
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="*********"
                  class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3]"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) =>
                    e.target &&
                    setNewPassword(e.currentTarget.value)}
                  disabled={isChanging}
                />
              </label>
              <label
                class={`form-control w-full ${
                  confirmNewPassword !== newPassword && "input-error"
                }`}
              >
                <div class="label pb-1">
                  <span class="label-text text-xs text-[#585858]">
                    Confirmar Nova Senha
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="*********"
                  class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3]"
                  name="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) =>
                    e.target &&
                    setConfirmNewPassword(e.currentTarget.value)}
                  disabled={isChanging}
                />
                {confirmNewPassword !== newPassword && (
                  <div class="label">
                    <span class="label-text-alt"></span>
                    <span class="label-text-alt text-red-500">
                      Não é igual à nova senha
                    </span>
                  </div>
                )}
              </label>
              <div class="w-full flex justify-end">
                <button
                  class="btn btn-primary text-white"
                  onClick={handleChangePassword}
                >
                  Alterar Senha{" "}
                  {isChanging && (
                    <span class="loading loading-spinner text-green-600"></span>
                  )}
                </button>
              </div>
            </div> */}
          <div id="planUpgrade">
            <h2 class="text-[#8b8b8b] font-semibold mb-4 mt-10 w-full">
              {currentPlan === "DEFAULT" ? "Faça sua assinatura" : "Plano"}
            </h2>
            <div id={id}>
              <Slider class="carousel gap-3 max-w-[105%]">
                {plans.map((plan, i) => (
                  <Slider.Item class="carousel-item" index={i}>
                    <div
                      class="bg-white rounded-md p-3 flex flex-col justify-between"
                      onClick={() =>
                        setNewPlan(plans.find((p) => p.name === plan.name))
                      }
                    >
                      <div class="flex items-center gap-4">
                        <div
                          class={`h-8 w-8 rounded-full ${
                            plan.name == (newPlan?.name || currentPlan)
                              ? "bg-primary flex items-center justify-center"
                              : "bg-white"
                          }`}
                          style={{
                            "box-shadow": "inset 1px 3px 7px rgb(0 0 0 / 20%)",
                          }}
                        >
                          {plan.name == (newPlan?.name || currentPlan) && (
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
                        {/* {plan.name === "FREE" && (
                            <span class="text-xs font-semibold mt-2 text-primary">
                              30 dias grátis
                            </span>
                          )} */}
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
                        </ul>{" "}
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
            <div class="flex  flex-col justify-end mt-4">
              <ModalConfirm
                text="Tem certeza que deseja encerrar sua assinatura?"
                confirmButtonText="Encerrar"
                open={displayConfirmCancelSubscription.value}
                onClose={() => {
                  displayConfirmCancelSubscription.value = false;
                }}
                onConfirm={handleCancelSubscription}
                loading={isCanceling}
              />
              <CheckoutUpsellModalPrescriber
                creditCards={creditCards}
                plan={newPlan!}
                address={address!}
                email={email}
              />
              <button
                class="btn btn-primary text-white"
                disabled={(newPlan?.plan || currentPlan) == currentPlan}
                onClick={() => {
                  displayCheckoutUpsellModal.value = true;
                }}
              >
                Alterar Plano
              </button>
              <button
                class="btn btn-ghost text-xs font-normal text-red-500"
                onClick={() => {
                  displayConfirmCancelSubscription.value = true;
                }}
              >
                Cancelar Assinatura
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrap>
  );
}

export default MyAccount;
