import { useUI } from "../../sdk/useUI.ts";
import { useState } from "preact/hooks";
import Modal from "./Modal.tsx";
import { Plan } from "./Checkout.tsx";
import { invoke } from "../../runtime.ts";
import { Props as ChangeSubscriptionProps } from "../../actions/changeSubscription.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import CreditCardInput from "deco-sites/ecannadeco/components/ui/CreditCardInput.tsx";
import CVVInput from "deco-sites/ecannadeco/components/ui/CVVInput.tsx";

export interface Product {
  description: string;
  name: string;
  skus: string[];
  status: string;
  price: number;
}

export type SavedCreditCard = {
  number: string;
  brand: string;
  token: string;
};

export interface Props {
  creditCards: SavedCreditCard[];
  plan?: Plan;
  product?: Product;
  email: string;
  address: {
    cep: string;
    number: string;
    complement: string;
  };
}

const CheckoutUpsellModalPrescriber = (props: Props) => {
  const { creditCards, plan, product } = props;
  const { displayCheckoutUpsellModal } = useUI();
  const [loading, setLoading] = useState(false);
  const [addNewCard, setAddNewCard] = useState(false);

  const [creditCardNumber, setCreditCardNumber] = useState<string>("");
  const [creditCardExpMonth, setCreditCardExpMonth] = useState<string>("");
  const [creditCardExpYear, setCreditCardExpYear] = useState<string>("");
  const [creditCardCCV, setCreditCardCCV] = useState<string>("");
  const [holderName, setHolderName] = useState<string>("");
  const [holderEmail, _setHolderEmail] = useState<string>(props.email || "");
  const [holderCPF, setHolderCPF] = useState<string>("");
  const [cep, setCep] = useState<string>(props.address?.cep || "");
  const [phone, setPhone] = useState<string>("");
  const [addressStreet, setAddressStreet] = useState<string>("");
  const [addressNumber, setAddressNumber] = useState<string>(
    props.address?.number || "",
  );
  const [addressComplement, setAddressComplement] = useState<string>(
    props.address?.complement || "",
  );
  const [cardSelected, setCardSelected] = useState(0);

  const handleCheckout = async () => {
    setLoading(true);

    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("PrescriberAccessToken") || "";
    }

    let paramsChangeSubscription = {} as ChangeSubscriptionProps;

    if (addNewCard) {
      paramsChangeSubscription = {
        token: accessToken,
        sku: plan!.skus[0],
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
          postal_code: cep,
          address_number: addressNumber,
          address_complement: addressComplement,
          phone,
        },
      };
    } else {
      if (plan) {
        paramsChangeSubscription = {
          token: accessToken,
          sku: plan!.skus[0],
          credit_card_token: creditCards[cardSelected].token,
        };
      }
    }

    try {
      //choose which checkout to call based on wheter its selling plan or product
      if (plan) {
        const rchangeSubs = await invoke[
          "deco-sites/ecannadeco"
        ].actions.changeSubscriptionPrescriber(paramsChangeSubscription);

        const respChangesubs = rchangeSubs as {
          errors?: unknown[];
          message?: string;
        };

        if (respChangesubs.errors) {
          throw new Error();
        }
      }

      displayCheckoutUpsellModal.value = false;
      alert("Operação realizada com sucesso!");
      setLoading(false);
      window.location.reload();
    } catch (_e) {
      alert("Não foi possível finalizar o checkout. Contacte o suporte.");
      setLoading(false);
    }
  };

  return (
    <Modal
      loading="lazy"
      open={displayCheckoutUpsellModal.value}
      onClose={() => (displayCheckoutUpsellModal.value = false)}
    >
      <div class="flex flex-col p-16 gap-3 bg-[#EDEDED] rounded-xl max-w-[90%] max-h-[90vh] overflow-scroll">
        <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
          Confirmar Pedido
        </h3>
        <div class="flex flex-col gap-2">
          <span>
            {plan
              ? "Você está fazendo a mudança do seu plano atual para o plano: "
              : "Você está comprando: "}
            <span class="font-bold">
              {plan ? plan.name : product && product.name}
            </span>
          </span>
          <span>
            {plan
              ? (
                <>
                  Valor da assinatura:{" "}
                  <span class="font-bold">
                    {plan &&
                      "R$ " +
                        (plan.price / 100).toFixed(2) +
                        (plan?.period == "MONTHLY" && "/mês")}
                  </span>
                </>
              )
              : (
                <>
                  Valor do produto:{" "}
                  <span class="font-bold">
                    {product && "R$ " + (product.price / 100).toFixed(2)}
                  </span>
                </>
              )}
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
              {creditCards && creditCards.length == 0 && (
                <li>
                  <div
                    class={`flex justify-center gap-2  rounded-md p-3 text-[#696969] bg-[#d4d4d4]`}
                  >
                    <span>
                      Você ainda não possui cartões cadastrados. Cadastre o
                      primeiro cartõa clicando em "Adicionar Novo Cartão".
                    </span>
                  </div>
                </li>
              )}
              {(creditCards && creditCards.length) > 0 &&
                creditCards.map((card, i) => {
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
            <CreditCardInput
              onChange={(value) => setCreditCardNumber(value)}
              value={creditCardNumber}
            />
            <fieldset class="w-full sm:w-[48%] flex flex-col">
              <legend class="label-text text-xs text-[#585858] p-1 pt-2">
                Validade do Cartão
              </legend>
              <div class="flex gap-2">
                <input
                  placeholder="Mês (Ex: 05)"
                  class="input rounded-md text-[#8b8b8b] border-none w-1/2"
                  value={creditCardExpMonth}
                  maxLength={2}
                  onChange={(e) =>
                    e.target && setCreditCardExpMonth(e.currentTarget.value)}
                />
                <input
                  placeholder="Ano (Ex: 2030)"
                  class="input rounded-md text-[#8b8b8b] border-none w-1/2"
                  value={creditCardExpYear}
                  maxlength={4}
                  onChange={(e) =>
                    e.target && setCreditCardExpYear(e.currentTarget.value)}
                />
              </div>
            </fieldset>
            <CVVInput
              value={creditCardCCV}
              onChange={(value) => setCreditCardCCV(value)}
            />
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
                maxLength={11}
                value={holderCPF}
                onChange={(e) =>
                  e.target && setHolderCPF(e.currentTarget.value)}
              />
            </label>
          </form>
        </div>
        <div>
          <form class="flex flex-wrap gap-[2%]">
            <div class="w-full flex flex-col my-2">
              <span class="label-text>text-xs text-[#585858]">
                Endereço de Cobrança
              </span>
            </div>
            <label class="w-full sm:w-[48%]  flex flex-col">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">
                  CEP
                </span>
              </div>
              <input
                class="input rounded-md text-[#8b8b8b] border-none w-full"
                placeholder="CEP"
                value={cep}
                onChange={(e) => e.target && setCep(e.currentTarget.value)}
              />
            </label>
            <label class="w-full sm:w-[48%]  flex flex-col">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">
                  Rua
                </span>
              </div>
              <input
                class="input rounded-md text-[#8b8b8b] border-none w-full"
                placeholder="Rua"
                value={addressStreet}
                onChange={(e) =>
                  e.target && setAddressStreet(e.currentTarget.value)}
              />
            </label>
            <label class="w-full sm:w-[48%]  flex flex-col">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">
                  Número
                </span>
              </div>
              <input
                class="input rounded-md text-[#8b8b8b] border-none w-full"
                placeholder="Número"
                value={addressNumber}
                onChange={(e) =>
                  e.target && setAddressNumber(e.currentTarget.value)}
              />
            </label>
            <label class="w-full sm:w-[48%]  flex flex-col">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">
                  Complemeto
                </span>
              </div>
              <input
                class="input rounded-md text-[#8b8b8b] border-none w-full"
                placeholder="Complemento"
                value={addressComplement}
                onChange={(e) =>
                  e.target && setAddressComplement(e.currentTarget.value)}
              />
            </label>
            <label class="w-full sm:w-[48%]  flex flex-col">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">
                  Telefone
                </span>
              </div>
              <input
                class="input rounded-md text-[#8b8b8b] border-none w-full"
                placeholder="Telefone"
                value={phone}
                onChange={(e) => e.target && setPhone(e.currentTarget.value)}
              />
            </label>
          </form>
        </div>

        <button
          class="btn btn-secondary text-white"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Processando..." : "Confirmar Pedido"}
        </button>
        <button
          onClick={() => (displayCheckoutUpsellModal.value = false)}
          class="btn btn-ghost uppercase font-medium"
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

export default CheckoutUpsellModalPrescriber;
