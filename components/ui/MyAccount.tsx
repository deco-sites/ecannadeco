/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
// import { useUI } from "../../sdk/useUI.ts";
import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import { Plan } from "../../components/ui/Checkout.tsx";
import PageWrap from "../../components/ui/PageWrap.tsx";
import Icon from "../../components/ui/Icon.tsx";
import ModalConfirm from "../../components/ui/ModalConfirm.tsx";
import { SavedCreditCard } from "../../components/ui/CheckoutUpsellModal.tsx";
import CheckoutUpsellModal from "../../islands/CheckoutUpsellModal.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { useUI } from "../../sdk/useUI.ts";
import SliderJS from "../../islands/SliderJS.tsx";

export type Address = {
  cep: string;
  number: string;
  complement: string;
  addressType: string;
};

function MyAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
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

  useEffect(() => {
    // Pega accessCode no localStorage para verificar se ainda está válida a sessão via api
    const accessToken = localStorage.getItem("AccessToken") || "";

    if (accessToken === "") {
      window.location.href = "/";
    }

    try {
      setIsLoading(true);

      invoke["deco-sites/ecannadeco"].actions.getUser({
        token: accessToken,
      }).then((r) => {
        const res = r as {
          data: { UserAttributes: { Name: string; Value: string }[] };
          dataProfile: {
            plan: string;
            credit_cards: SavedCreditCard[];
            address: Address[];
          };
        };

        const billingAddress = res.dataProfile.address.find((a) =>
          a.addressType === "BILLING"
        );

        const email = res.data.UserAttributes.find((a) =>
          a["Name"] === "email"
        );

        console.log({ dataProfile: res.dataProfile });

        setAddress(billingAddress);
        setEmail(email?.Value || "");
        setCurrentPlan(res.dataProfile.plan);
        setNewPlan(plans.find((p) => p.name === res.dataProfile.plan));
        setCreditCards(res.dataProfile.credit_cards);

        setIsLoading(false);
      });

      const params = fetch(
        `http://localhost:3000/v1/products/subscriptions`,
      ).then(async (r) => {
        const c = await r.json();
        console.log({ plans: c.docs });

        const plansList = c.docs as Plan[];
        setPlans(plansList);
      });
    } catch (e) {
      alert(
        "Não foi possível carregar dados do usuário. Tente novamente mais tarde ou contecte o suporte.",
      );
      setIsLoading(false);
    }
  }, []); // Passando um array de dependências vazio

  const handleChangePassword = () => {
    if ((confirmNewPassword !== newPassword) || (!currentPassword)) {
      alert(
        "Verifique os campos necessários para alterar a senha e tente novamente.",
      );
    } else {
      try {
        setIsChanging(true);

        invoke["deco-sites/ecannadeco"].actions.changePassword({
          token: localStorage.getItem("AccessToken") || "",
          body: {
            newPassword: confirmNewPassword,
            oldPassword: currentPassword,
          },
        }).then((r) => {
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
      } catch (e) {
        alert(
          "Não foi possível alterar a senha. Tente mais tarde",
        );
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
          "Foi aberto chamado com requisição de cancelar assinatura! Em breve, te retornaremos no email da conta.",
        );
      }
    } catch (e) {
      alert("Erro ao enviar solicitação. Tente mais tarde");
      setIsCanceling(false);
    }
  };

  return (
    <PageWrap>
      {isLoading
        ? <span class="loading loading-spinner text-green-600"></span>
        : (
          <div class="flex flex-col gap-3 w-full">
            <div class="flex justify-center">
              <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
                Minha Conta
              </h3>
            </div>
            <div class="flex flex-col gap-3">
              <label class="form-control w-full">
                <div class="label pb-1">
                  <span class="label-text text-xs text-[#585858]">
                    Email
                  </span>
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
            <div class="w-full sm:w-[60%] md:w-[40%] flex flex-col gap-3">
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
            </div>
            <div>
              <h2 class="text-[#8b8b8b] font-semibold mb-4 mt-10 w-full">
                Plano
              </h2>
              {/* <div class="flex gap-3"> */}
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
                            {"R$ " + (plan.price / 100).toFixed(2) + "/" +
                              (plan.period === "MONTHLY" && "mês")}
                          </span>
                        </div>
                      </div>
                      <div class="flex flex-col gap-2">
                        {plan.name === "FREE" && (
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
                          <li class="flex gap-3 items-center">
                            <Icon
                              class="text-primary"
                              id="CircleCheck"
                              size={17}
                            />
                            <span class="text-[10px]">
                              Upload até 2 documentos
                            </span>
                          </li>
                          <li
                            class={`flex gap-3 items-center ${
                              plan.name == "FREE" && "opacity-20"
                            }`}
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
                            class={`flex gap-3 items-center ${
                              plan.name == "FREE" && "opacity-20"
                            }`}
                          >
                            <Icon
                              class="text-primary"
                              id="CircleCheck"
                              size={17}
                            />
                            <span class="text-[10px]">Carteirinha física</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Slider.Item>
                ))}
              </Slider>
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
                <CheckoutUpsellModal
                  creditCards={creditCards}
                  plan={newPlan!}
                  address={address!}
                />
                <button
                  class="btn btn-primary text-white"
                  disabled={(newPlan?.name || currentPlan) == currentPlan}
                  onClick={() => {
                    console.log({ creditCards });
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
