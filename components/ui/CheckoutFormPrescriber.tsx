import { invoke } from "../../runtime.ts";
import { useState } from "preact/hooks";
import Icon from "./Icon.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";

export interface Props {
  formTitle?: string;
}

function CheckoutFormPrescriber() {
  const [name, setName] = useState<string>("");
  const [cpf, setCPF] = useState<string>("");
  // const [creditCartHolder, setCreditCardHolder] = useState<string>("");
  const [creditCardNumber, setCreditCardNumber] = useState<string>("");
  const [creditCardExpMonth, setCreditCardExpMonth] = useState<string>("");
  const [creditCardExpYear, setCreditCardExpYear] = useState<string>("");
  const [creditCardCCV, setCreditCardCCV] = useState<string>("");
  const [holderName, setHolderName] = useState<string>("");
  const [holderEmail, setHolderEmail] = useState<string>("");
  const [holderPhone, setHolderPhone] = useState<string>("");
  const [holderCPF, setHolderCPF] = useState<string>("");
  const [billingAddressPostalCode, setBillingAddressPostalCode] = useState<
    string
  >("");
  const [billingAddressNumber, setBillingAddressNumber] = useState<string>("");
  const [billingAddressComplement, setBillingAddressComplement] = useState<
    string
  >("");
  const [billingAddressNeighborhood, setBillingAddressNeighborhood] = useState<
    string
  >("");
  const [billingAddressCity, setBillingAddressCity] = useState<string>("");
  const [billingAddressState, setBillingAddressState] = useState<string>("");
  const [billingAddressStreet, setBillingAddressStreet] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadingPostalCode, setIsLoadingPostalCode] = useState(false);
  let planSku = "";
  let planName = "";
  let planPrice = "";
  let planPeriod = "";
  let planStartBilling = "0";

  if (IS_BROWSER) {
    setHolderEmail(localStorage.getItem("prescriberEmailConfirm") || "");
    setName(localStorage.getItem("prescriberNameUserAsaas") || "");
    setCPF(localStorage.getItem("prescriberCpfUserAsaas") || "");

    planSku = localStorage.getItem("planSKUPrescriber") || "";
    planName = localStorage.getItem("planNamePrescriber") || "";
    planPrice = localStorage.getItem("planPricePrescriber") || "";
    planPeriod = localStorage.getItem("planPeriodPrescriber") || "";
    planStartBilling = localStorage.getItem("planStartBillingPrescriber") || "";
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);

    if (billingAddressNumber == "") {
      alert("Preencha o endereço corretamente antes de prosseguir.");
      return true;
    }

    if (holderPhone == "") {
      alert("Preencha o telefone corretamente antes de prosseguir.");
      return true;
    }

    if (planSku == "" || planName == "" || planPrice == "") {
      alert(
        "Não foi escolhido nenhum plano. Escolha um plano e continue para o pagamento",
      );
      window.location.href = "/prescritor/confirmar-cadastro/plano";
    } else if (holderEmail == "") {
      alert("Não foi encontrado email. Reinicie o cadastro");
      window.location.href = "/prescritor/cadastrar";
    } else if (cpf == "" || name == "") {
      alert(
        "Não foi encontrado o usuário deste processo de pagamento. Por favor, reinicie o cadastro",
      );
      window.location.href = "/prescritor/cadastrar";
    } else {
      try {
        const r = await invoke[
          "deco-sites/ecannadeco"
        ].actions.prescriberCheckout({
          name,
          cpf_cnpj: cpf,
          email: holderEmail,
          sku: planSku,
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
            postal_code: billingAddressPostalCode,
            address_number: billingAddressNumber,
            address_complement: billingAddressComplement,
            phone: holderPhone,
          },
          address: {
            cep: billingAddressPostalCode,
            street: billingAddressStreet,
            number: billingAddressNumber,
            complement: billingAddressComplement,
            neighborhood: billingAddressNeighborhood,
            city: billingAddressCity,
            state: billingAddressState,
            addressType: "BILLING",
          },
        });
        console.log({ r });

        const rCheckout = r as { errors?: Array<unknown> };

        if (rCheckout.errors && rCheckout.errors.length > 0) {
          alert(
            "Não foi possível fazer pagamento. Verifique as informações fornecidas e tente novamente.",
          );
          setLoading(false);
        } else {
          if (IS_BROWSER) {
            localStorage.setItem("planSKU", "");
            localStorage.setItem("planName", "");
            localStorage.setItem("planPrice", "");
            localStorage.setItem("planPeriod", "");
          }

          alert(
            "Assinatura criada! Agora, faça o login para acessar sua conta.",
          );

          setLoading(false);

          window.location.href = "/prescritor/entrar";
        }
      } catch (_e) {
        alert("Falha em criar assinatura. Fale com o suporte!");
      }
    }
  };

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

      setBillingAddressStreet(r.logradouro);
      setBillingAddressCity(r.localidade);
      setBillingAddressState(r.uf);
      setBillingAddressNeighborhood(r.bairro);
      setIsLoadingPostalCode(false);
    } catch (e) {
      setIsLoadingPostalCode(false);

      console.log({ e });
    }
  };

  return (
    <div class="w-full flex justify-center">
      <form
        class="form-control justify-start gap-2 max-w-[480px]"
        onSubmit={(event) => {
          handleSubmit(event);
        }}
      >
        <div class="flex flex-col items-center">
          <span class="text-2xl text-[#8b8b8b] font-semibold text-center my-4">
            Dados de Cobrança
          </span>
          <div class="flex items-center gap-3 text-[#8b8b8b] ">
            <Icon id="Secure" size={19} />
            <span class="text-sm">Checkout Seguro</span>
          </div>
        </div>

        {planName && planPrice && planPeriod && (
          <div class="bg-white border flex flex-col items-center mt-4 p-4 gap-2 text-center">
            <span>
              Plano Escolhido: <span class="font-semibold">{planName}</span>
            </span>
            <span>
              Valor:{" "}
              <span class="font-semibold">
                R$ {planName == "CARTEIRINHA"
                  ? `${(0).toFixed(2)}*`
                  : (Number(planPrice) / 100).toFixed(2)}{" "}
                /{planPeriod == "MONTHLY" && "mês"}
              </span>
            </span>
            {Number(planStartBilling) > 0 && (
              <span class="text-[10px] font-bold text-primary">
                {planStartBilling}{" "}
                dias grátis - primeira cobrança após o período grátis
              </span>
            )}
          </div>
        )}

        {/* Creditcard Info */}
        <h2 class="text-[#8b8b8b] font-semibold mb-1 mt-10 w-full">
          Dados do Cartão
        </h2>
        <div class="flex flex-wrap gap-[4%]">
          <label class="w-full sm:w-[48%]">
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
          <fieldset class="w-full sm:w-[48%]">
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
          <label class="w-full sm:w-[48%]">
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
          <label class="w-full sm:w-[48%]">
            <div class="label pb-1">
              <span class="label-text text-xs text-[#585858]">
                Nome do Titular
              </span>
            </div>
            <input
              class="input rounded-md text-[#8b8b8b] border-none w-full"
              placeholder="Nome"
              value={holderName}
              onChange={(e) => e.target && setHolderName(e.currentTarget.value)}
            />
          </label>
          <label class="w-full sm:w-[48%]">
            <div class="label pb-1">
              <span class="label-text text-xs text-[#585858]">
                CPF do Titular
              </span>
            </div>
            <input
              class="input rounded-md text-[#8b8b8b] border-none w-full"
              placeholder="CPF"
              value={holderCPF}
              onChange={(e) => e.target && setHolderCPF(e.currentTarget.value)}
            />
          </label>
        </div>

        {/* Contact Info */}
        <h2 class="text-[#8b8b8b] font-semibold mb-1 mt-10 w-full">
          Dados de Contato
        </h2>
        <div class="flex flex-wrap gap-[4%]">
          <label class="w-full sm:w-[48%]">
            <div class="label pb-1">
              <span class="label-text text-xs text-[#585858]">Email</span>
            </div>
            <input
              class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3]"
              placeholder="Email de cobrança"
              name="holderEmail"
              value={holderEmail}
              disabled
            />
          </label>
          <label class="w-full sm:w-[48%]">
            <div class="label pb-1">
              <span class="label-text text-xs text-[#585858]">Telefone</span>
            </div>
            <input
              class="input rounded-md text-[#8b8b8b] border-none w-full"
              placeholder="Número com Whatsapp"
              name="holderPhone"
              value={holderPhone}
              onChange={(e) =>
                e.target && setHolderPhone(e.currentTarget.value)}
            />
          </label>
        </div>

        {/* Billing Address */}
        <h2 class="text-[#8b8b8b] font-semibold mb-1 mt-10 w-full">
          Endereço de Cobrança
        </h2>
        <div class="flex flex-wrap gap-[4%]">
          <div class="join w-full">
            <label class="join-item w-[70%]">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">CEP</span>
              </div>
              <input
                placeholder="CEP"
                name="cep"
                class="input rounded-md text-[#8b8b8b] border-none"
                value={billingAddressPostalCode}
                onChange={(e) => e.target &&
                  setBillingAddressPostalCode(e.currentTarget.value)}
              />
              <button
                class="btn btn-ghost bg-[#dedede] text-[#5d5d5d] join-item"
                type="button"
                onClick={() =>
                  handleValidatePostalCode(billingAddressPostalCode)}
              >
                Validar CEP{" "}
                {isLoadingPostalCode && (
                  <span class="loading loading-spinner text-green-600"></span>
                )}
              </button>
            </label>
          </div>
          <div
            class={`flex flex-wrap w-full gap-[4%] ${
              billingAddressStreet == "" && "hidden"
            }`}
          >
            <label class="w-full">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">
                  Logradouro
                </span>
              </div>
              <input
                class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3]"
                placeholder="Logradouro"
                name="addressnumber"
                value={billingAddressStreet}
                disabled
              />
            </label>
            <label class="w-full sm:w-[48%]">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">Número*</span>
              </div>
              <input
                class="input rounded-md text-[#8b8b8b] border-none w-full"
                placeholder="Número"
                name="addressnumber"
                value={billingAddressNumber}
                onChange={(e) =>
                  e.target && setBillingAddressNumber(e.currentTarget.value)}
              />
            </label>
            <label class="w-full sm:w-[48%]">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">
                  Complemento
                </span>
              </div>
              <input
                class="input rounded-md text-[#8b8b8b] border-none w-full"
                placeholder="Ex: casa 9, apartamento 101"
                name="addressnumber"
                value={billingAddressComplement}
                onChange={(e) => e.target &&
                  setBillingAddressComplement(e.currentTarget.value)}
              />
            </label>
            <label class="w-full sm:w-[48%]">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">Bairro</span>
              </div>
              <input
                class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3]"
                placeholder="Bairro"
                name="addressNeighborhood"
                value={billingAddressNeighborhood}
                disabled
              />
            </label>
            <label class="w-full sm:w-[48%]">
              <div class="label pb-1">
                <span class="label-text text-xs text-[#585858]">Cidade</span>
              </div>
              <input
                class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3]"
                placeholder="Cidade"
                name="addressCity"
                value={billingAddressCity}
                disabled
              />
            </label>
          </div>
        </div>

        <button
          type={"submit"}
          class="btn bg-primary text-white rounded-md mt-5 disabled:loading border-none"
        >
          {loading ? "Concluindo..." : "Concluir"}
        </button>
      </form>
    </div>
  );
}

export default CheckoutFormPrescriber;
