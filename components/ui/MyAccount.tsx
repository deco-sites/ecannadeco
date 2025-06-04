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
// import ModalConfirm from "../../components/ui/ModalConfirm.tsx";
import { SavedCreditCard } from "../../components/ui/CheckoutUpsellModal.tsx";
import CheckoutUpsellModal from "../../islands/CheckoutUpsellModal.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { useUI } from "../../sdk/useUI.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useHolderInfo } from "deco-sites/ecannadeco/sdk/useHolderInfo.ts";
import { UserData } from "deco-sites/ecannadeco/components/ui/EcannaCardPage.tsx";
import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";
import Image from "apps/website/components/Image.tsx";

export type Address = {
  cep: string;
  number: string;
  complement: string;
  addressType: string;
};

function MyAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  // const [isCanceling, setIsCanceling] = useState(false);
  const [email, setEmail] = useState("");
  const [currentPlan, setCurrentPlan] = useState<string>("");
  const [associationStatus, setAssociationStatus] = useState<string>("");
  const [associationImage, setAssociationImage] = useState<string>("");
  const [newPlan, setNewPlan] = useState<Plan>();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [address, setAddress] = useState<Address>();
  const [creditCards, setCreditCards] = useState<SavedCreditCard[]>([]);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const { displayCheckoutUpsellModal } = useUI();
  const holderInfo = useHolderInfo();
  const [referral, setReferral] = useState<{
    description: string;
    type: string;
    partner_name: string;
    name: string;
    discount: number;
    allowed_skus?: string[];
  }>();

  function formatPeriod(period: string) {
    if (period === "MONTHLY") {
      return "/mês";
    } else if (period === "YEARLY") {
      return "/ano";
    }
    return;
  }

  useEffect(() => {
    // Pega accessCode no localStorage para verificar se ainda está válida a sessão via api
    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AccessToken") || "";
      setCurrentPlan(localStorage.getItem("currentPatientPlan") || "");
    }

    if (accessToken === "") {
      window.location.href = "/";
    }

    try {
      setIsLoading(true);

      invoke["deco-sites/ecannadeco"].actions
        .getUser({
          token: accessToken,
        })
        .then((r) => {
          const res = r as UserData;
          holderInfo.value = {
            email: res.data.UserAttributes.find((a) =>
              a.Name === "email"
            )?.Value ||
              "",
            phone: res.dataProfile.phone,
            full_name: res.dataProfile.name,
            birth_date: res.dataProfile.birth_date,
            cpf_cnpj: res.dataProfile.cpf,
            postal_code: res.dataProfile.address[0]?.cep ?? "",
            address_number: res.dataProfile.address[0]?.number ?? "",
            address_complement: res.dataProfile.address[0]?.complement ?? "",
            address_city: res.dataProfile.address[0]?.city ?? "",
            address_state: res.dataProfile.address[0]?.state ?? "",
            address_street: res.dataProfile.address[0]?.street ?? "",
          };
          const billingAddress = res.dataProfile.address.find(
            (a) => a.addressType === "BILLING",
          );

          const email = res.data.UserAttributes.find(
            (a) => a["Name"] === "email",
          );

          console.log({ dataProfile: res.dataProfile });

          setAddress(billingAddress);
          setEmail(email?.Value || "");
          setCurrentPlan(res.dataProfile.plan);
          setNewPlan(plans.find((p) => p.name === res.dataProfile.plan));
          setCreditCards(res.dataProfile.credit_cards);
          setReferral(res.dataProfile.referral);
          setIsLoading(false);
          setAssociationStatus(res.dataProfile.association?.status);
          setAssociationImage(res.dataProfile.association?.logo_url);
        });

      fetch(`${API_URL}/v1/products/subscriptions?isPrescriber=false`).then(
        async (r) => {
          const c = await r.json();
          const plansList = c.docs.filter((doc: Plan) => doc.plan) as Plan[];
          setPlans(plansList);
        },
      );
    } catch (_e) {
      alert(
        "Não foi possível carregar dados do usuário. Tente novamente mais tarde ou contecte o suporte.",
      );
      setIsLoading(false);
    }
  }, []); // Passando um array de dependências vazio

  const handleChangePassword = () => {
    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AccessToken") || "";
    }

    if (confirmNewPassword !== newPassword || !currentPassword) {
      alert(
        "Verifique os campos necessários para alterar a senha e tente novamente.",
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

  // const handleCancelSubscription = async () => {
  //   setIsCanceling(true);
  //   try {
  //     const r = await invoke["deco-sites/ecannadeco"].actions.createTicket({
  //       email,
  //       subject: "[CANCELAR] Pedido para cancelar assinatura",
  //       content: "Olá, gostaria de cancelar minha assinatura.",
  //     });

  //     const resp = r as { inlineMessage?: string };

  //     if (
  //       resp.inlineMessage &&
  //       resp.inlineMessage == "Obrigado por enviar o formulário."
  //     ) {
  //       console.log({ responseTicker: r });

  //       displayConfirmCancelSubscription.value = false;
  //       setIsCanceling(false);

  //       alert(
  //         "Foi aberto chamado com requisição de cancelar assinatura! Em breve, te retornaremos no email da conta."
  //       );
  //     }
  //   } catch (_e) {
  //     alert("Erro ao enviar solicitação. Tente mais tarde");
  //     setIsCanceling(false);
  //   }
  // };

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
            {currentPlan == "CARD_PARTNER" ||
                (currentPlan == "CARD_ASSOCIATED" &&
                  associationStatus == "INACTIVE")
              ? (
                <div class="flex flex-col p-4 text-white rounded-md items-center gap-4 bg-[#da8f0f] text-xs">
                  <Icon id="Warn" size={36} />
                  <span>
                    Em prol da viabilidade financeira do projeto, o serviço de
                    carteirinha digital do ecanna não é mais oferecido de forma
                    gratuita.
                  </span>
                  <span>
                    Mantivemos o seu QR Code ativo por{" "}
                    <span class="font-bold">tempo limitado</span>{" "}
                    caso precise utilizar a carteirinha que já possui. Para
                    atualizar documentos ou dados, pedir nova via física ou
                    baixar novamente a carteirinha digital, faça o upgrade do
                    seu plano {currentPlan == "CARD_ASSOCIATED" &&
                      associationStatus == "INACTIVE" &&
                      " ou fale com sua associação"}
                    !
                  </span>
                  <button
                    onClick={() => {
                      setNewPlan(plans[0]);
                    }}
                    class="btn bg-white text-[#da8f0f] btn-sm uppercase"
                    href="#planUpgrade"
                  >
                    Selecionar novo plano
                  </button>
                </div>
              )
              : null}

            {(currentPlan == "TREATMENT" || currentPlan == "DEFAULT") &&
              (referral && referral.type === "DISCOUNT"
                ? (
                  referral &&
                  referral.type === "DISCOUNT" && (
                    <div
                      class="flex flex-col md:flex-row p-4 text-white rounded-md items-center gap-4"
                      style={`background-image: linear-gradient(to bottom, #00426f, #1777b8);`}
                    >
                      <Icon id="Celebration" size={36} />
                      <span>
                        Oba!{" "}
                        <span class="font-bold">{referral.partner_name}</span>
                        {" "}
                        está oferecendo{" "}
                        <span class="font-bold">
                          {referral.discount * 100}% de desconto
                        </span>{" "}
                        para você tirar a sua carteirinha. Esta é a hora certa
                        de continuar sua jornada como paciente!
                      </span>
                      <button
                        onClick={() => {
                          setNewPlan(plans[0]);
                        }}
                        class="btn bg-white text-primary btn-sm uppercase"
                        href="#planUpgrade"
                      >
                        Usar meu desconto
                      </button>
                    </div>
                  )
                )
                : (
                  <div class="rounded p-4 bg-primary text-white flex flex-col gap-3 items-center justify-center">
                    <Icon id="Profile" size={16} />
                    <span class="text-lg">
                      GARANTA SUA CARTEIRINHA DE PACIENTE!
                    </span>
                    <span class="text-center text-sm">
                      Para obter sua carteirinha de paciente de cannabis
                      medicinal, garantindo sua segurança no uso da medicina,
                      faça upgrade do seu plano clicando no botão abaixo!
                    </span>
                    <button
                      onClick={() => {
                        setNewPlan(plans[0]);
                      }}
                      class="btn bg-white text-primary btn-sm"
                      href="#planUpgrade"
                    >
                      Fazer Upgrade
                    </button>
                  </div>
                ))}
            {
              <div id="planUpgrade" class="flex flex-col gap-3">
                <h2 class="text-[#8b8b8b] font-semibold mb-4 mt-10 w-full">
                  Plano
                </h2>
                <Slider class="flex-col sm:flex-row sm:carousel gap-3 max-w-[105%]">
                  {currentPlan === "CARD_ASSOCIATED" && (
                    <Slider.Item
                      class="carousel-item cursor-pointer sm:max-w-[33%] max-w-[100%] w-full mb-4"
                      index={9999}
                    >
                      <div class="bg-white rounded-md p-3 flex flex-col w-full">
                        <div class="flex justify-center my-3">
                          <Image
                            src={associationImage}
                            alt={`logo associação`}
                            width={179}
                          />
                        </div>
                        <div class="flex items-center gap-4">
                          <div
                            class={`h-8 w-8 rounded-full ${
                              !newPlan ? "bg-primary" : ""
                            } flex items-center justify-center`}
                            style={{
                              "box-shadow":
                                "inset 1px 3px 7px rgb(0 0 0 / 20%)",
                            }}
                          >
                            {!newPlan && (
                              <Icon class="text-white" id="Check" size={19} />
                            )}
                          </div>
                          <div class="flex flex-col text-[#898989]">
                            <span class=" uppercase text-sm">
                              Plano Associação
                            </span>
                            <span class={`text-xs`}>Gratuito</span>
                          </div>
                        </div>
                        <div class="flex flex-col gap-2">
                          <ul class="flex flex-col gap-3 py-3">
                            <li class={`flex gap-2 items-center`}>
                              <Icon
                                class="text-primary"
                                id="CircleCheck"
                                size={17}
                              />
                              <span class="text-[10px]">
                                Anuidade gratuita por associação
                              </span>
                            </li>
                            <li class={`flex gap-2 items-center`}>
                              <Icon
                                class="text-primary"
                                id="CircleCheck"
                                size={17}
                              />
                              <span class="text-[10px]">
                                Upload ilimitado de documentos
                              </span>
                            </li>
                            <li class={`flex gap-2 items-center`}>
                              <Icon
                                class="text-primary"
                                id="CircleCheck"
                                size={17}
                              />
                              <span class="text-[10px]">
                                Opção de pedir via física protegida por PIN
                              </span>
                            </li>
                            <li class={`flex gap-2 items-center`}>
                              <Icon
                                class="text-primary"
                                id="CircleCheck"
                                size={17}
                              />
                              <span class="text-[10px]">Proteção por PIN</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </Slider.Item>
                  )}

                  {
                    /* {currentPlan === "CARD_PARTNER" && (
                  <Slider.Item
                    class="carousel-item cursor-pointer sm:max-w-[33%] max-w-[100%] w-full mb-4"
                    index={9999}
                  >
                    <div class="bg-white rounded-md p-3 flex flex-col w-full">
                      <div class="flex items-center gap-4">
                        <div
                          class={`h-8 w-8 rounded-full ${
                            !newPlan ? "bg-primary" : ""
                          } flex items-center justify-center`}
                          style={{
                            "box-shadow": "inset 1px 3px 7px rgb(0 0 0 / 20%)",
                          }}
                        >
                          {!newPlan && (
                            <Icon class="text-white" id="Check" size={19} />
                          )}
                        </div>
                        <div class="flex flex-col text-[#898989]">
                          <span class=" uppercase text-sm">
                            Plano ExpoCannabis
                          </span>
                          <span class={`text-xs`}>Gratuito</span>
                        </div>
                      </div>
                      <div class="flex flex-col gap-2">
                        <ul class="flex flex-col gap-3 py-3">
                          <li class={`flex gap-2 items-center`}>
                            <Icon
                              class="text-primary"
                              id="CircleCheck"
                              size={17}
                            />
                            <span class="text-[10px]">
                              Anuidade gratuita por parceria com ExpoCannabis
                            </span>
                          </li>
                          <li class={`flex gap-2 items-center`}>
                            <Icon
                              class="text-primary"
                              id="CircleCheck"
                              size={17}
                            />
                            <span class="text-[10px]">
                              Carteirinha digital oficial
                            </span>
                          </li>
                          <li class={`flex gap-2 items-center`}>
                            <Icon
                              class="text-primary"
                              id="CircleCheck"
                              size={17}
                            />
                            <span class="text-[10px]">
                              Acompanhamento de tratamento
                            </span>
                          </li>
                          <li class={`flex gap-2 items-center`}>
                            <Icon
                              class="text-primary"
                              id="CircleCheck"
                              size={17}
                            />
                            <span class="text-[10px]">
                              Emissão de via física por R$ 25,00
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Slider.Item>
                )} */
                  }
                  {plans.map((plan, i) => {
                    const isSelected = newPlan
                      ? plan._id == newPlan?._id
                      : currentPlan === plan.plan;
                    return (
                      <Slider.Item
                        class={` ${
                          plan.plan === "CARD" &&
                            ["CARD_ASSOCIATED", "CARD_PARTNER"].includes(
                              currentPlan,
                            )
                            ? "hidden"
                            : ""
                        } carousel-item cursor-pointer sm:max-w-[33%] max-w-[100%] w-full mb-4`}
                        index={i}
                      >
                        <div
                          class="bg-white rounded-md p-3 flex flex-col w-full"
                          onClick={() => {
                            setNewPlan(plans.find((p) => p.name === plan.name));
                          }}
                        >
                          <div class="flex items-center gap-4">
                            <div
                              class={`h-8 w-8 rounded-full ${
                                isSelected
                                  ? "bg-primary flex items-center justify-center"
                                  : "bg-white"
                              }`}
                              style={{
                                "box-shadow":
                                  "inset 1px 3px 7px rgb(0 0 0 / 20%)",
                              }}
                            >
                              {isSelected && (
                                <Icon class="text-white" id="Check" size={19} />
                              )}
                            </div>
                            <div class="flex flex-col text-[#898989]">
                              <span class=" uppercase text-sm">
                                {plan.name}
                              </span>
                              <span
                                class={`text-xs ${
                                  referral &&
                                  referral.type == "DISCOUNT" &&
                                  referral?.allowed_skus?.includes(
                                    plan.skus[0],
                                  ) &&
                                  "line-through"
                                }`}
                              >
                                {"R$ " +
                                  (plan.price / 100).toFixed(2) +
                                  (formatPeriod(plan.period) || "")}
                              </span>
                              {referral &&
                                referral.type === "DISCOUNT" &&
                                referral?.allowed_skus?.includes(
                                  plan.skus[0],
                                ) && (
                                <div class="flex flex-col gap-2">
                                  <span class="text-xs text-[#0ca118] font-bold">
                                    {"R$ " +
                                      (
                                        (plan.price / 100) *
                                        (1 - referral.discount)
                                      ).toFixed(2) +
                                      (formatPeriod(plan.period) || "")}
                                  </span>
                                  <span class="text-xs text-[#0ca118]">
                                    ({referral.discount * 100}% off -{" "}
                                    {referral.partner_name})
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div class="flex flex-col gap-2">
                            <ul class="flex flex-col gap-3 py-3">
                              {plan.plan_description?.map((desc) => (
                                <li
                                  class={`flex gap-2 items-center ${
                                    plan.name == "FREE" && "opacity-20"
                                  }`}
                                >
                                  <Icon
                                    class="text-primary"
                                    id="CircleCheck"
                                    size={17}
                                  />
                                  <span class="text-[10px]">{desc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Slider.Item>
                    );
                  })}
                </Slider>
                <div class="flex  flex-col justify-end mt-4">
                  {
                    /* <ModalConfirm
                    text="Tem certeza que deseja encerrar sua assinatura?"
                    confirmButtonText="Encerrar"
                    open={displayConfirmCancelSubscription.value}
                    onClose={() => {
                      displayConfirmCancelSubscription.value = false;
                    }}
                    onConfirm={handleCancelSubscription}
                    loading={isCanceling}
                  /> */
                  }
                  <CheckoutUpsellModal
                    creditCards={creditCards}
                    plan={newPlan!}
                    discount={referral?.allowed_skus?.includes(
                        newPlan?.skus[0] ?? "",
                      )
                      ? referral?.discount
                      : undefined}
                    address={address!}
                  />
                  <button
                    class="btn btn-primary text-white"
                    disabled
                    // disabled={(newPlan?.plan ?? currentPlan) == currentPlan}
                    onClick={() => {
                      console.log({ creditCards });
                      displayCheckoutUpsellModal.value = true;
                    }}
                  >
                    Alterar Plano
                  </button>
                  {
                    /* <button
                    class="btn btn-ghost text-xs font-normal text-red-500"
                    onClick={() => {
                      displayConfirmCancelSubscription.value = true;
                    }}
                  >
                    Cancelar Assinatura
                  </button> */
                  }
                  <div class="flex justify-center my-4">
                    <span class="text-red-600 text-xs">
                      Para cancelar sua assinatura, abra chamado no suporte pelo
                      botão azul no canto da tela
                    </span>
                  </div>
                </div>
              </div>
            }
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
                    e.target && setCurrentPassword(e.currentTarget.value)}
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
                    e.target && setNewPassword(e.currentTarget.value)}
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
                    e.target && setConfirmNewPassword(e.currentTarget.value)}
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
          </div>
        )}
    </PageWrap>
  );
}

export default MyAccount;
