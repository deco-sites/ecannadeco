import { useUI } from "../../sdk/useUI.ts";
import { useEffect, useState } from "preact/hooks";
import { effect } from "@preact/signals";
import Modal from "./Modal.tsx";
import { Plan } from "../../components/ui/Checkout.tsx";
import { invoke } from "../../runtime.ts";
import { Props as ChangeSubscriptionProps } from "../../actions/changeSubscription.ts";
import { Props as Checkoutv2Props } from "../../actions/checkoutv2.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import CreditCardInput from "deco-sites/ecannadeco/components/ui/CreditCardInput.tsx";
import CVVInput from "deco-sites/ecannadeco/components/ui/CVVInput.tsx";
import { useHolderInfo } from "deco-sites/ecannadeco/sdk/useHolderInfo.ts";
import { qrcode } from "qrcode";
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
  address: {
    cep: string;
    number: string;
    complement: string;
  };
  discount?: number;
}

const CheckoutUpsellModal = (props: Props) => {
  const { creditCards, plan, product, discount } = props;
  const holderInfo = useHolderInfo();
  const { displayCheckoutUpsellModal, displayAlert, alertText, alertType } =
    useUI();
  const [loading, setLoading] = useState(false);
  const [invalidForm, setInvalidForm] = useState(false);
  const [addNewCard, _setAddNewCard] = useState(true);
  // const [addNewCard, setAddNewCard] = useState(creditCards.length === 0);
  const [isLoadingPostalCode, setIsLoadingPostalCode] = useState(false);
  const [creditCardNumber, setCreditCardNumber] = useState<string>("");
  const [creditCardExpMonth, setCreditCardExpMonth] = useState<string>("");
  const [creditCardExpYear, setCreditCardExpYear] = useState<string>("");
  const [creditCardCCV, setCreditCardCCV] = useState<string>("");
  const [holderName, setHolderName] = useState<string>("");
  const [holderCPF, setHolderCPF] = useState<string>("");
  const [cep, setCep] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressNumber, setAddressNumber] = useState<string>("");
  const [addressComplement, setAddressComplement] = useState<string>("");
  const [pixCode, setPixCode] = useState<string>("");
  const [isPix, setIsPix] = useState(plan ? false : true);
  const [pixImg, setPixImg] = useState<string | QRCode>("");
  const [paymentType, setPaymentType] = useState<string>(
    plan ? "CREDIT_CARD" : "PIX"
  );
  const [clipboardText, setClipboardText] = useState("Copiar");
  const [cardSelected, _setCardSelected] = useState(0);
  const [filledFields, setFilledFields] = useState(false);
  const [orderId, setOrderId] = useState<string>("");

  const handleValidatePostalCode = async (code: string) => {
    setIsLoadingPostalCode(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${code}/json`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const r = await response.json();

      setAddressStreet(r.logradouro);
      setAddressCity(r.localidade);
      setAddressState(r.uf);
      setIsLoadingPostalCode(false);
    } catch (e) {
      setIsLoadingPostalCode(false);

      console.log({ e });
    }
  };

  const handleCheckout = async () => {
    setLoading(true);

    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AccessToken") || "";
    }

    let paramsChangeSubscription = {} as ChangeSubscriptionProps;
    let paramsCheckoutV2 = {} as Checkoutv2Props;

    if (addNewCard) {
      if (plan) {
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
            email: holderInfo.value?.email!,
            phone,
            full_name: holderName,
            cpf_cnpj: holderCPF,
            postal_code: cep,
            address_number: addressNumber,
            address_complement: addressComplement,
            address_city: addressCity,
            address_state: addressState,
            address_street: addressStreet,
          },
        };
      }

      if (product) {
        paramsCheckoutV2 = {
          token: accessToken,
          items: [
            {
              sku: product!.skus[0],
              quantity: 1,
            },
          ],
          pix: isPix,
          holder_info: {
            email: holderInfo.value?.email!,
            phone,
            full_name: holderName,
            birth_date: birthDate,
            cpf_cnpj: holderCPF,
            postal_code: cep,
            address_number: addressNumber,
            address_complement: addressComplement,
            address_city: addressCity,
            address_state: addressState,
            address_street: addressStreet,
          },
        };

        if (!isPix) {
          paramsCheckoutV2.credit_card = {
            holder: holderName,
            number: creditCardNumber,
            exp_month: creditCardExpMonth,
            exp_year: creditCardExpYear,
            ccv: creditCardCCV,
          };
        }
      }
    } else {
      if (plan) {
        paramsChangeSubscription = {
          token: accessToken,
          sku: plan!.skus[0],
          credit_card_token: creditCards[cardSelected].token,
        };
      } else if (product) {
        paramsCheckoutV2 = {
          token: accessToken,
          items: [
            {
              sku: product!.skus[0],
              quantity: 1,
            },
          ],
          credit_card_token: creditCards[cardSelected].token,
        };
      }
    }

    console.log({ paramsChangeSubscription, paramsCheckoutV2 });

    try {
      //choose which checkout to call based on wheter its selling plan or product
      if (plan) {
        const rchangeSubs = await invoke[
          "deco-sites/ecannadeco"
        ].actions.changeSubscription(paramsChangeSubscription);

        const respChangesubs = rchangeSubs as {
          errors?: unknown[];
          message?: string;
        };

        if (respChangesubs.errors) {
          throw new Error();
        }
      } else if (product) {
        const rcheckoutv2 = await invoke[
          "deco-sites/ecannadeco"
        ].actions.checkoutv2(paramsCheckoutV2);

        const respCheckoutV2 = rcheckoutv2 as {
          errors?: unknown[];
          message?: string;
          qrCode?: string;
          _id?: string;
        };

        if (respCheckoutV2.errors) {
          throw new Error();
        }
        if (isPix) {
          setPixCode(respCheckoutV2?.qrCode || "");
          setOrderId(respCheckoutV2?._id || "");
        }
      }

      // displayCheckoutUpsellModal.value = false;
      displayAlert.value = true;
      alertText.value = "Operação realizada com sucesso!";
      alertType.value = "success";
      displayCheckoutUpsellModal.value = false;
      setTimeout(function () {
        globalThis.location.reload();
      }, 2000);
      setLoading(false);
    } catch (_e) {
      displayAlert.value = true;
      alertText.value =
        "Não foi possível finalizar o checkout. Contacte o suporte.";
      alertType.value = "error";
      setLoading(false);
    }
  };

  effect(() => {
    if (plan) {
      setPaymentType("CREDIT_CARD");
      setIsPix(false);
    }

    if (holderInfo.value && filledFields === false) {
      setHolderName(holderInfo.value.full_name);
      setHolderCPF(holderInfo.value.cpf_cnpj);
      setCep(holderInfo.value.postal_code);
      setAddressNumber(holderInfo.value.address_number);
      setAddressComplement(holderInfo.value.address_complement);
      setAddressCity(holderInfo.value.address_city);
      setAddressState(holderInfo.value.address_state);
      setAddressStreet(holderInfo.value.address_street);
      setPhone(holderInfo.value.phone);
      setBirthDate((holderInfo.value.birth_date || "").slice(0, 10));
      setFilledFields(true);
    }
  });

  useEffect(() => {
    async function generateQRCode() {
      const qr = await qrcode(pixCode);
      setPixImg(qr.toString());
    }
    if (pixCode) {
      generateQRCode();
    }
  }, [pixCode]);

  useEffect(() => {
    if (isPix) {
      if (
        cep &&
        addressNumber &&
        holderCPF &&
        birthDate &&
        phone &&
        addressStreet &&
        addressCity &&
        addressState &&
        holderName
      ) {
        setInvalidForm(false);
      } else {
        setInvalidForm(true);
      }
    } else {
      if (
        ((!cardSelected &&
          creditCardNumber &&
          creditCardExpMonth &&
          creditCardExpYear &&
          creditCardCCV &&
          holderName) ||
          cardSelected) &&
        cep &&
        addressNumber &&
        holderCPF &&
        birthDate &&
        phone &&
        addressStreet &&
        addressCity &&
        addressState
      ) {
        setInvalidForm(false);
      } else {
        setInvalidForm(true);
      }
    }
  }, [
    cardSelected,
    creditCardNumber,
    creditCardExpMonth,
    creditCardExpYear,
    creditCardCCV,
    holderName,
    cep,
    addressNumber,
    holderCPF,
    phone,
    addressStreet,
    addressCity,
    addressState,
    birthDate,
  ]);

  function ConfirmOrder() {
    const currentPrice = plan ? plan.price : product ? product.price : 0;
    return (
      <>
        <h3 class="text-xl text-[#8b8b8b] font-semibold text-center mb-4">
          Confirmar Pedido
        </h3>
        <div class="flex flex-col gap-2 text-sm">
          <span>
            {plan
              ? "Você está fazendo a mudança do seu plano atual para o plano: "
              : "Você está pedindo: "}
            <span class="font-bold">
              {plan ? plan.name : product && product.name}
            </span>
          </span>
          {discount !== 1 ? (
            <span>
              {plan ? (
                <>
                  Valor da assinatura:{" "}
                  <span class="font-bold">
                    {plan &&
                      "R$ " +
                        (discount
                          ? (plan.price / 100) * (1 - discount)
                          : plan.price / 100
                        ).toFixed(2) +
                        (plan?.period == "MONTHLY" ? "/mês" : "") +
                        (plan?.period == "YEARLY" ? "/ano" : "")}
                  </span>
                </>
              ) : (
                <>
                  Valor do produto:{" "}
                  <span class="font-bold">
                    {product && product.price > 0
                      ? "R$ " + (product.price / 100).toFixed(2)
                      : "Grátis"}
                  </span>
                </>
              )}
            </span>
          ) : null}
        </div>

        {/* Forma de Pagamento */}

        {currentPrice && currentPrice > 0 && discount !== 1 ? (
          <div class="flex flex-col text-sm">
            <div class="label pb-1">
              <span class="label-text text-xs text-[#585858]">
                Forma de Pagamento
              </span>
            </div>
            <select
              name="payment-type"
              class="select select-sm w-full max-w-xs"
              disabled={plan ? true : false}
              value={paymentType}
              onChange={(e) => {
                if (e.target) {
                  setPaymentType(e.currentTarget.value);
                  setIsPix(e.currentTarget.value === "PIX");
                }
              }}
            >
              <option name="PIX" value="PIX">
                PIX
              </option>
              <option name="CREDIT_CARD" value="CREDIT_CARD">
                Cartão de Crédito
              </option>
            </select>
          </div>
        ) : null}

        {/* Cartão de crédito */}

        {!isPix && (
          <>
            <div>
              {/* {(creditCards && creditCards.length) > 0 &&
                creditCards.map((card, i) => {
                  return (
                    <div>
                      <ul
                        class={`${
                          addNewCard && "hidden"
                        } bg-[#e1e1e1] p-3 text-xs flex flex-col gap-2`}
                      >
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
                              <span class="font-bold">
                                {"*****" + card.number}
                              </span>
                            </span>
                            <span>
                              Bandeira{" "}
                              <span class="font-bold">{card.brand}</span>
                            </span>
                          </div>
                        </li>
                      </ul>
                      <span
                        class={`text-xs cursor-pointer underline ${
                          addNewCard && !creditCards.length && "hidden"
                        }`}
                        onClick={() => setAddNewCard(!addNewCard)}
                      >
                        {addNewCard
                          ? "- Usar cartão salvo"
                          : "+ Adicionar Novo Cartão"}
                      </span>
                    </div>
                  );
                })} */}
            </div>
            {discount !== 1 ? (
              <div class={`${!addNewCard && "hidden"}`}>
                <form class="flex flex-wrap gap-[2%]">
                  <div class="flex w-[80%]">
                    <CreditCardInput
                      onChange={(value) => setCreditCardNumber(value)}
                      value={creditCardNumber}
                    />
                  </div>
                  <div class="flex w-[18%]">
                    <CVVInput
                      value={creditCardCCV}
                      onChange={(value) => setCreditCardCCV(value)}
                    />
                  </div>
                  <fieldset class="w-full sm:w-[48%] flex flex-col">
                    <legend class="label-text text-xs text-[#585858] p-1 pt-2">
                      Validade do Cartão
                    </legend>
                    <div class="flex gap-2">
                      <input
                        placeholder="Mês (Ex: 05)"
                        class="input input-sm rounded-md text-[#8b8b8b] border-none w-1/2"
                        value={creditCardExpMonth}
                        maxLength={2}
                        onChange={(e) =>
                          e.target &&
                          setCreditCardExpMonth(e.currentTarget.value)
                        }
                      />
                      <input
                        placeholder="Ano (Ex: 2030)"
                        class="input input-sm rounded-md text-[#8b8b8b] border-none w-1/2"
                        value={creditCardExpYear}
                        maxlength={4}
                        onChange={(e) =>
                          e.target &&
                          setCreditCardExpYear(e.currentTarget.value)
                        }
                      />
                    </div>
                  </fieldset>
                </form>
              </div>
            ) : null}
          </>
        )}

        <div>
          <div class="flex flex-col md:flex-row md:gap-4 gap-1">
            <label class="w-full sm:w-[48%]  flex flex-col">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">Nome</span>
              </div>
              <input
                class="input input-sm rounded-md text-[#8b8b8b] border-none w-full"
                placeholder="Nome"
                value={holderName}
                onChange={(e) =>
                  e.target && setHolderName(e.currentTarget.value)
                }
              />
            </label>
            <label class="w-full sm:w-[48%]  flex flex-col">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">CPF</span>
              </div>
              <input
                class="input input-sm rounded-md text-[#8b8b8b] border-none w-full"
                placeholder="CPF"
                value={holderCPF}
                onChange={(e) =>
                  e.target && setHolderCPF(e.currentTarget.value)
                }
              />
            </label>
            <label class="w-full sm:w-[48%]  flex flex-col">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">
                  Data de Nascimento
                </span>
              </div>
              <input
                class={`input input-sm rounded-md text-[#8b8b8b] w-full ${
                  birthDate ? " border-none" : "border border-red-700"
                }`}
                type="date"
                placeholder="Data de Nascimento"
                value={birthDate}
                onChange={(e) =>
                  e.target && setBirthDate(e.currentTarget.value)
                }
              />
            </label>
          </div>
          <div class="flex flex-wrap gap-[2%]">
            <div class="flex flex-wrap gap-5 justify-left w-full">
              <div class="join">
                <label class="join-item">
                  <div class="label pb-1">
                    <span class="label-text text-xs text-[#585858]">CEP</span>
                  </div>
                  <input
                    placeholder="CEP"
                    name="cep"
                    type="tel"
                    class="input input-sm rounded-md text-[#8b8b8b] border-none"
                    // disabled={addressStreet != "" ? true : false}
                    value={cep}
                    onChange={(e) => {
                      setCep(e.currentTarget.value);
                    }}
                    // onFocus={() => setDisplayCidResults(true)}
                    // onBlur={() => setDisplayCidResults(false)}
                  />
                  <button
                    class="btn btn-sm btn-ghost bg-[#dedede] text-[#5d5d5d] join-item"
                    onClick={() => handleValidatePostalCode(cep)}
                  >
                    Validar CEP{" "}
                    {isLoadingPostalCode && (
                      <span class="loading loading-spinner text-green-600"></span>
                    )}
                  </button>
                </label>
              </div>
              <div
                class={`flex flex-wrap gap-[2%] justify-left ${
                  addressCity !== "" ? "" : "hidden"
                }`}
              >
                <label class="w-full sm:w-[32%]">
                  <div class="label pb-1">
                    <span class="label-text text-xs text-[#585858]">
                      Logradouro/Rua
                    </span>
                  </div>
                  <input
                    class={`input input-sm rounded-md text-[#8b8b8b] ${
                      addressStreet === ""
                        ? "border border-red-600"
                        : "border-none"
                    } w-full disabled:bg-[#e3e3e3]`}
                    placeholder="logradouro"
                    name="cep"
                    // disabled
                    value={addressStreet}
                    onChange={(e) => {
                      setAddressStreet(e.currentTarget.value);
                    }}
                  />
                </label>
                <label class="w-full sm:w-[32%]">
                  <div class="label pb-1">
                    <span class="label-text text-xs text-[#585858]">
                      Número
                    </span>
                  </div>
                  <input
                    class={`input input-sm rounded-md text-[#8b8b8b] ${
                      addressNumber === ""
                        ? "border border-red-600"
                        : "border-none"
                    } w-full`}
                    placeholder="número"
                    type="tel"
                    name="numero"
                    value={addressNumber}
                    onChange={(e) => {
                      setAddressNumber(e.currentTarget.value);
                    }}
                  />
                </label>
                <label class="w-full sm:w-[32%]">
                  <div class="label pb-1">
                    <span class="label-text text-xs text-[#585858]">
                      Complemento
                    </span>
                  </div>
                  <input
                    class={`input input-sm rounded-md text-[#8b8b8b] ${
                      addressComplement === ""
                        ? "border border-red-600"
                        : "border-none"
                    } w-full`}
                    placeholder="complemento"
                    name="complemento"
                    type="text"
                    value={addressComplement}
                    onChange={(e) => {
                      setAddressComplement(e.currentTarget.value);
                    }}
                  />
                </label>
                <label class="w-full sm:w-[32%]">
                  <div class="label pb-1">
                    <span class="label-text text-xs text-[#585858]">
                      Cidade / Estado
                    </span>
                  </div>
                  <input
                    class="input input-sm rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3]"
                    placeholder="Cidade / Estado"
                    name="cidadeestado"
                    disabled
                    value={`${addressCity + "/" + addressState}`}
                  />
                </label>
                <div class="w-full sm:w-[32%]">
                  <label class="w-full">
                    <div class="label pb-1">
                      <span class="label-text text-xs text-[#585858]">
                        Telefone
                      </span>
                    </div>
                    <input
                      class="input input-sm rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3]"
                      placeholder="Telefone"
                      type="tel"
                      name="phone"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.currentTarget.value);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <span
            class={`text-red-700 ${!invalidForm ? "hidden" : "flex text-xs"}`}
            onClick={() => {
              console.log({
                cep,
                addressNumber,
                holderCPF,
                birthDate,
                phone,
                addressStreet,
                addressCity,
                addressState,
                holderName,
              });
            }}
          >
            * Verifique se todos os campos estão preenchidos corretamente
          </span>

          <button
            class="my-4 btn btn-sm btn-secondary text-white"
            onClick={handleCheckout}
            disabled={loading || invalidForm}
          >
            {loading ? "Processando..." : "Confirmar Pedido"}
          </button>
          <button
            onClick={() => (displayCheckoutUpsellModal.value = false)}
            class="btn btn-sm btn-ghost uppercase font-medium"
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </>
    );
  }

  async function confirmPayment() {
    const responseOrder = await invoke[
      "deco-sites/ecannadeco"
    ].actions.getUserOrder({
      token: localStorage.getItem("AccessToken")!,
      orderId,
    });

    if (responseOrder.payment.status === "CONFIRMED") {
      displayAlert.value = true;
      alertText.value = "Pagamento efetuado com sucesso!";
      alertType.value = "success";
    } else {
      displayAlert.value = true;
      alertText.value =
        "Ainda não conseguimos conferir seu pagamento. Por favor, aguarde alguns minutos.";
      alertType.value = "error";
    }

    displayCheckoutUpsellModal.value = false;
  }

  function PixPaymentStep() {
    return (
      <div class="flex flex-col gap-2">
        <h3 class="text-xl text-[#8b8b8b] font-semibold text-center">
          Confirmar pagamento
        </h3>
        <span class="text-xs">Código PIX:</span>
        <div class="flex">
          <div class="rounded-sm border border-gray-500 bg-gray-200 text-black px-1 h-9 leading-9 w-96 overflow-clip">
            {pixCode}
          </div>
          <button
            class="btn h-9 min-h-9 btn-secondary"
            onClick={() => {
              navigator.clipboard.writeText(pixCode);
              setClipboardText("Copiado!");
            }}
          >
            {clipboardText}
          </button>
        </div>
        <img
          src={pixImg.toString()}
          class="m-auto"
          alt="QR Code"
          width="120"
          height="120"
        />
        <button
          class="btn btn-secondary text-white"
          onClick={() => confirmPayment()}
          disabled={loading || invalidForm}
        >
          {loading ? "Processando..." : "Confirmar Pagamento"}
        </button>
        <button
          onClick={() => (displayCheckoutUpsellModal.value = false)}
          class="btn btn-ghost uppercase font-medium"
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <Modal
      loading="lazy"
      open={displayCheckoutUpsellModal.value}
      onClose={() => (displayCheckoutUpsellModal.value = false)}
    >
      <div class="flex flex-col py-4 px-8 gap-3 bg-[#EDEDED] rounded-xl max-w-[90%] max-h-[90vh] overflow-scroll">
        <div class="container max-w-lg flex-col gap-3">
          {pixCode ? PixPaymentStep() : ConfirmOrder()}
        </div>
      </div>
    </Modal>
  );
};

export default CheckoutUpsellModal;
