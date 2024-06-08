import { invoke } from "../../runtime.ts";
import { useState } from "preact/hooks";
import Icon from "../../components/ui/Icon.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";

export interface Props {
  formTitle?: string;
}

function CheckoutForm() {
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
  const [cpfError, setCpfError] = useState("");

  let planSku = "";
  let planName = "";
  let planPrice = "";
  let planPeriod = "";

  if (IS_BROWSER) {
    setHolderEmail(localStorage.getItem("emailConfirm") || "");
    setName(localStorage.getItem("nameUserAsaas") || "");
    setCPF(localStorage.getItem("cpfUserAsaas") || "");
    setHolderPhone(localStorage.getItem("phoneUserAsaas") || "");

    planSku = localStorage.getItem("planSKU") || "";
    planName = localStorage.getItem("planName") || "";
    planPrice = localStorage.getItem("planPrice") || "";
    planPeriod = localStorage.getItem("planPeriod") || "";
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);

    if (planSku == "" || planName == "" || planPrice == "") {
      alert(
        "Não foi escolhido nenhum plano. Escolha um plano e continue para o pagamento",
      );
      window.location.href = "/confirmar-cadastro/plano";
    } else if (holderEmail == "") {
      alert("Não foi encontrado email. Reinicie o cadastro");
      window.location.href = "/cadastrar";
    } else if (cpf == "" || name == "") {
      alert(
        "Não foi encontrado o usuário deste processo de pagamento. Por favor, reinicie o cadastro",
      );
      window.location.href = "/cadastrar";
    } else {
      try {
        const r = await invoke["deco-sites/ecannadeco"].actions.checkout({
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

          window.location.href = "/entrar";
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

  const maskCreditCardNumber = (creditCardNumber: string) => {
    if (creditCardNumber.length < 16) return creditCardNumber;

    // Recebe um número de cartão de crédito com 16 dígitos e insere os caracteres de formatação
    return creditCardNumber.replace(
      /(\d{4})(\d{4})(\d{4})(\d{4})/,
      "$1 $2 $3 $4",
    );
  };

  const stripCardNumberNonNumericCharacters = (str: string) => {
    return str.replace(/[^\d]/g, "");
  };

  const handleCardNumberInputChange = (event: Event) => {
    const inputValue = (event.target as HTMLInputElement).value;
    setCreditCardNumber(stripCardNumberNonNumericCharacters(inputValue));
  };

  const maskCPF = (cpf: string) => {
    if (cpf.length < 11) return cpf;

    // Recebe um CPF com 11 dígitos e insere os caracteres de formatação
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const stripCPFNonNumericCharacters = (str: string) => {
    return str.replace(/[^\d]/g, "");
  };

  const handleCPFInputChange = (event: Event) => {
    const inputValue = (event.target as HTMLInputElement).value;
    setHolderCPF(stripCPFNonNumericCharacters(inputValue));
    setCpfError(validarCPF(inputValue) ? "" : "CPF inválido");
  };

  // const handleHolderPhoneChange = (event: Event) => {
  //   const inputValue = (event.target as HTMLInputElement).value;
  //   console.log({inputValue, holderPhone})
  //   setHolderPhone(stripWhatsappNonNumericCharacters(inputValue));
  //   setHolderPhoneError(
  //     validateWhatsapp(inputValue) ? "" : "Número de WhatsApp inválido"
  //   );
  // };

  const maskWhatsAppNumber = (whatsAppNumber: string) => {
    if (whatsAppNumber.length < 11) return whatsAppNumber;

    // Recebe um número de WhatsApp nacional e insere os caracteres de formatação
    return whatsAppNumber.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  // const stripWhatsappNonNumericCharacters = (str: string) => {
  //   return str.replace(/[^\d]/g, "");
  // };

  // const validateWhatsapp = (whatsAppNumber: string) => {
  //   // Verifica se o número tem o formato correto com DDD no início e 11 dígitos
  //   const regex = /^\d{11}$/;
  //   return regex.test(whatsAppNumber);
  // };

  const validarCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]/g, ""); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(.)\1+$/.test(cpf)) return false; // Verifica se o CPF tem 11 dígitos e não é uma sequência repetida

    // Calcula o primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    const dv1 = resto >= 10 ? 0 : resto;

    // Verifica se o primeiro dígito verificador é válido
    if (parseInt(cpf.charAt(9)) !== dv1) return false;

    // Calcula o segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    const dv2 = resto >= 10 ? 0 : resto;

    // Verifica se o segundo dígito verificador é válido
    if (parseInt(cpf.charAt(10)) !== dv2) return false;

    return true; // CPF válido
  };

  return (
    <div class="flex w-full justify-center">
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
              value={maskCreditCardNumber(creditCardNumber)}
              onChange={(e) => handleCardNumberInputChange(e)}
            />
          </label>
          <fieldset class="w-full sm:w-[48%]">
            <legend class="label-text text-xs text-[#585858] p-1 pt-2">
              Validade do Cartão
            </legend>
            <div class="flex gap-2">
              <input
                type="text"
                placeholder="mm"
                pattern="\d{2}"
                maxLength={2}
                class="input rounded-md text-[#8b8b8b] border-none w-1/2"
                value={creditCardExpMonth}
                onChange={(e) =>
                  e.target && setCreditCardExpMonth(e.currentTarget.value)}
              />
              <input
                type="text"
                placeholder="aaaa"
                pattern="\d{4}"
                maxLength={4}
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
              pattern="\d{3}"
              maxLength={3}
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
              value={maskCPF(holderCPF)}
              onChange={(e) => handleCPFInputChange(e)}
            />
            {cpfError !== "" && (
              <div class="label">
                <span class="label-text-alt text-red-500">{cpfError}</span>
              </div>
            )}
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
              type="text"
              class="input rounded-md text-[#8b8b8b] border-none w-full disabled:bg-[#e3e3e3]"
              placeholder="Número com Whatsapp"
              name="holderPhone"
              value={maskWhatsAppNumber(holderPhone)}
              // onChange={(e) => handleHolderPhoneChange(e)}
              disabled
            />
            {
              /* {holderPhoneError !== "" && (
              <div class="label">
                <span class="label-text-alt text-red-500">
                  {holderPhoneError}
                </span>
              </div>
            )} */
            }
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
                onChange={(e) =>
                  e.target &&
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

        {planName && planPrice && planPeriod && (
          <div class="bg-white border flex flex-col items-center mt-4 py-4">
            <span>
              Plano Escolhido: <span class="font-semibold">{planName}</span>
            </span>
            <span>
              Valor:{" "}
              <span class="font-semibold">
                R$ {(Number(planPrice) / 100).toFixed(2)} /
                {planPeriod == "MONTHLY" && "mês"}
              </span>
            </span>
          </div>
        )}

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

export default CheckoutForm;
