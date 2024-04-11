import { useUI } from "../../sdk/useUI.ts";
import { useState } from "preact/hooks";
import Modal from "./Modal.tsx";
import { Plan } from "../../components/ui/Checkout.tsx";
import { invoke } from "../../runtime.ts";
import { Props as ChangeSubscriptionProps } from "../../actions/changeSubscription.ts";

export type SavedCreditCard = {
  number: string;
  brand: string;
  token: string;
};

export interface Props {
  creditCards: SavedCreditCard[];
  plan: Plan;
  address: {
    cep: string;
    number: string;
    complement: string;
  };
}

const CheckoutUpsellModal = (props: Props) => {
  const { creditCards, plan } = props;
  const { displayCheckoutUpsellModal } = useUI();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [addNewCard, setAddNewCard] = useState(false);

  const [creditCardNumber, setCreditCardNumber] = useState<string>("");
  const [creditCardExpMonth, setCreditCardExpMonth] = useState<string>("");
  const [creditCardExpYear, setCreditCardExpYear] = useState<string>("");
  const [creditCardCCV, setCreditCardCCV] = useState<string>("");
  const [holderName, setHolderName] = useState<string>("");
  const [holderEmail, setHolderEmail] = useState<string>("");
  const [holderPhone, setHolderPhone] = useState<string>("");
  const [holderCPF, setHolderCPF] = useState<string>("");
  const [cardSelected, setCardSelected] = useState(0);

  // console.log({ plan, creditCards });

  const handleCheckout = async () => {
    setLoading(true);

    let params = {} as ChangeSubscriptionProps;

    if (addNewCard) {
      params = {
        token: localStorage.getItem("AccessToken") || "",
        sku: plan.skus[0],
        credit_card: {
          holder: holderName,
          number: creditCardNumber,
          exp_month: creditCardExpMonth,
          exp_year: creditCardExpYear,
          ccv: creditCardCCV,
        },
        holder_info: {
          full_name: holderName,
          email: holderEmail,
          cpf_cnpj: holderCPF,
          postal_code: props.address.cep,
          address_number: props.address.number,
          address_complement: props.address.complement,
          phone: holderPhone,
        },
      };
    } else {
      params = {
        token: localStorage.getItem("AccessToken") || "",
        sku: plan.skus[0],
        credit_card_token: creditCards[cardSelected].token,
      };
    }

    console.log({ params });

    try {
      const r = await invoke["deco-sites/ecannadeco"].actions
        .changeSubscription(params);

      const resp = r as { message?: string };

      console.log({ r });

      if (resp.message) {
        throw new Error();
      }

      displayCheckoutUpsellModal.value = false;
      alert("Sua assinatura foi alterada com sucesso!");
      setLoading(false);
      window.location.reload();
    } catch (e) {
      alert("Não foi possível alterar a assinatura. Contacte o suporte.");
      setLoading(false);
    }
  };

  return (
    <Modal
      loading="lazy"
      open={displayCheckoutUpsellModal.value}
      onClose={() => displayCheckoutUpsellModal.value = false}
    >
      <div class="flex flex-col p-16 gap-3 bg-[#EDEDED] rounded-xl max-w-[90%] max-h-[90vh] overflow-scroll">
        <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
          Confirmar Pagamento
        </h3>
        <div class="flex flex-col gap-2">
          <span>
            Você está fazendo a mudança do seu plano atual para o plano:{" "}
            <span class="font-bold">{plan && plan.name}</span>
          </span>
          <span>
            Valor da assinatura:{" "}
            <span class="font-bold">
              {plan &&
                ("R$ " + (plan.price / 100).toFixed(2) +
                  (plan?.period == "MONTHLY" && "/mês"))}
            </span>
          </span>
        </div>
        <div>
          <span>Forma de Pagamento:</span>
          <div>
            <ul
              class={`${
                addNewCard && "hidden"
              } bg-[#e1e1e1] p-3 text-xs flex flex-col gap-2`}
            >
              {creditCards.length == 0 && (
                <li>
                  <div
                      class={`flex justify-center gap-2  rounded-md p-3 text-[#696969] bg-[#d4d4d4]`}
                    >
                      <span>Você ainda não possui cartões cadastrados. Cadastre o primeiro cartõa clicando em "Adicionar Novo Cartão".</span>
                    </div>
                </li>
              )}
              {creditCards.length > 0 && creditCards.map((card, i) => {
                return (
                  <li
                    class="cursor-pointer "
                    onClick={() => setCardSelected(i)}
                  >
                    <div
                      class={`flex flex-col gap-2  rounded-md p-3 ${
                        cardSelected === i
                          ? "shadow-md text-[#252525] bg-[#36a69c]"
                          : "text-[#696969] bg-[#d4d4d4]"
                      }`}
                    >
                      <span>
                        Cartão de crédito{" "}
                        <span class="font-bold">{"*****" + card.number}</span>
                      </span>
                      <span>
                        Bandeira <span class="font-bold">{card.brand}</span>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <span
              class="text-xs cursor-pointer underline"
              onClick={() => setAddNewCard(!addNewCard)}
            >
              {addNewCard ? "- Usar cartão salvo" : "+ Adicionar Novo Cartão"}
            </span>
          </div>
        </div>
        <div class={`${!addNewCard && "hidden"}`}>
          <form class="flex flex-wrap gap-[2%]">
            <label class="w-full sm:w-[48%] flex flex-col">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">
                  Número do Cartão
                </span>
              </div>
              <input
                class="input rounded-md text-[#8b8b8b] border-none w-full"
                placeholder="0000 0000 0000 0000"
                name="creditCardNumber"
                value={creditCardNumber}
                onChange={(e) => {
                  setCreditCardNumber(e.currentTarget.value);
                }}
              />
            </label>
            <fieldset class="w-full sm:w-[48%] flex flex-col">
              <legend class="label-text text-xs text-[#585858] p-1 pt-2">
                Validade do Cartão
              </legend>
              <div class="flex gap-2">
                <input
                  placeholder="Mês"
                  class="input rounded-md text-[#8b8b8b] border-none w-1/2"
                  value={creditCardExpMonth}
                  onChange={(e) =>
                    e.target && setCreditCardExpMonth(e.currentTarget.value)}
                />
                <input
                  placeholder="Ano"
                  class="input rounded-md text-[#8b8b8b] border-none w-1/2"
                  value={creditCardExpYear}
                  onChange={(e) =>
                    e.target && setCreditCardExpYear(e.currentTarget.value)}
                />
              </div>
            </fieldset>
            <label class="w-full sm:w-[48%]  flex flex-col">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">
                  Código Verificador
                </span>
              </div>
              <input
                class="input rounded-md text-[#8b8b8b] border-none w-full"
                placeholder="Código Verificador"
                value={creditCardCCV}
                onChange={(e) =>
                  e.target && setCreditCardCCV(e.currentTarget.value)}
              />
            </label>
            <label class="w-full sm:w-[48%]  flex flex-col">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">
                  Nome do Titular
                </span>
              </div>
              <input
                class="input rounded-md text-[#8b8b8b] border-none w-full"
                placeholder="Nome"
                value={holderName}
                onChange={(e) =>
                  e.target && setHolderName(e.currentTarget.value)}
              />
            </label>
            <label class="w-full sm:w-[48%]  flex flex-col">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">
                  CPF do Titular
                </span>
              </div>
              <input
                class="input rounded-md text-[#8b8b8b] border-none w-full"
                placeholder="CPF"
                value={holderCPF}
                onChange={(e) =>
                  e.target && setHolderCPF(e.currentTarget.value)}
              />
            </label>
          </form>
        </div>

        <button
          class="btn btn-secondary text-white"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Processando..." : "Confirmar Pagamento"}
        </button>
        <button
          onClick={() => displayCheckoutUpsellModal.value = false}
          class="btn btn-ghost uppercase font-medium"
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

export default CheckoutUpsellModal;
