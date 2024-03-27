import { invoke } from "../../runtime.ts";
import { useState } from "preact/hooks";
import { Plan } from "../../components/ui/Checkout.tsx";

export interface Props {
  formTitle?: string;
  plans: Plan[];
}

function CheckoutForm({ formTitle, plans }: Props) {
  const email = localStorage.getItem("emailConfirmCheckout");
  const [code, setCode] = useState<string>("");
  const [cpf, setCPF] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [plan, setPlan] = useState<string>("");
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
  const [billingAddressNumber, setBillingAddressNumber] = useState<
    string
  >("");
  const [billingAddressComplement, setBillingAddressComplement] = useState<
    string
  >("");
  const [cids, setCids] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [termsAgree, setTermsAgree] = useState<boolean>(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (termsAgree) {
      setLoading(true);
      try {
        await invoke["deco-sites/ecannadeco"].actions
          .checkout(
            {
              email: holderEmail,
              code,
              cids,
              cpf_cnpj: cpf,
              name,
              sku: plan,
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
            },
          );
        setLoading(false);

        alert(
          "Assinatura criada!",
        );

        // window.location.href = "/";
      } catch (e) {
        alert(
          "Não foi possível fazer o checkout. Verifique as informações fornecidas e tente novamente.",
        );
        setLoading(false);
      }
    } else {
      alert(
        "Você deve concordar com os Termos de Uso e Políticas de Privacidade para continuar seu cadastro",
      );
    }
  };

  return (
    <div class="max-w-[480px]">
      <form
        class="form-control justify-start gap-2 py-8 px-10 bg-[#931C31] rounded-xl"
        onSubmit={(event) => {
          handleSubmit(event);
        }}
      >
        <span class="text-sm text-white font-semibold w-[80%] mb-4">
          {formTitle}
        </span>

        {/* Confirmation code */}
        <label class="cursor-pointer label flex justify-start gap-2">
          <span>
            Insira o código de confirmação de cadastro enviado para{" "}
            <span class="font-bold">{email}</span>
          </span>
          <input
            placeholder="Código"
            class="input input-bordered"
            name="code"
            value={code}
            onChange={(e) => e.target && setCode(e.currentTarget.value)}
          />
        </label>

        {/* Personal Info */}
        <h3>Seus Dados</h3>
        <input
          placeholder="Nome Completo"
          class="input input-bordered"
          value={name}
          onChange={(e) => e.target && setName(e.currentTarget.value)}
        />
        <input
          placeholder="CPF"
          class="input input-bordered"
          value={cpf}
          onChange={(e) => e.target && setCPF(e.currentTarget.value)}
        />

        {/* Plan Selection */}
        <h3>Selecione o Plano</h3>

        <select
          class="select select-bordered"
          value={plan}
          onChange={(e) => e.target && setPlan(e.currentTarget.value)}
        >
          {plans.map((plan) => (
            <option
              value={plan.skus[0]}
              onClick={(e) => {
                e.preventDefault();
                setPlan(plan.skus[0]);
              }}
            >
              {plan.name}
            </option>
          ))}
        </select>

        {/* Creditcard Info */}
        <h3>Dados do Cartão</h3>
        <input
          placeholder="Número do Cartão"
          class="input input-bordered"
          value={creditCardNumber}
          onChange={(e) =>
            e.target && setCreditCardNumber(e.currentTarget.value)}
        />
        <fieldset>
          <legend>Validade do Cartão</legend>
          <input
            placeholder="Mês"
            class="input input-bordered"
            value={creditCardExpMonth}
            onChange={(e) =>
              e.target && setCreditCardExpMonth(e.currentTarget.value)}
          />
          <input
            placeholder="Ano"
            class="input input-bordered"
            value={creditCardExpYear}
            onChange={(e) =>
              e.target && setCreditCardExpYear(e.currentTarget.value)}
          />
        </fieldset>
        <input
          placeholder="Código Verificador"
          class="input input-bordered"
          value={creditCardCCV}
          onChange={(e) => e.target && setCreditCardCCV(e.currentTarget.value)}
        />

        {/* Creditcard Holder Info */}
        <h3>Dados do Titular do Cartão</h3>
        <input
          placeholder="Nome do Titular"
          class="input input-bordered"
          name="code"
          value={holderName}
          onChange={(e) => e.target && setHolderName(e.currentTarget.value)}
        />
        <input
          placeholder="CPF do Titular"
          class="input input-bordered"
          name="code"
          value={holderCPF}
          onChange={(e) => e.target && setHolderCPF(e.currentTarget.value)}
        />
        <input
          placeholder="Email do Titular"
          class="input input-bordered"
          name="code"
          value={holderEmail}
          onChange={(e) => e.target && setHolderEmail(e.currentTarget.value)}
        />
        <input
          placeholder="Telefone do Titular"
          class="input input-bordered"
          name="code"
          value={holderPhone}
          onChange={(e) => e.target && setHolderPhone(e.currentTarget.value)}
        />

        {/* Billing Address */}
        <h3>Endereço de Cobrança</h3>
        <input
          placeholder="CEP*"
          class="input input-bordered"
          name="code"
          value={billingAddressPostalCode}
          onChange={(e) =>
            e.target && setBillingAddressPostalCode(e.currentTarget.value)}
        />
        <input
          placeholder="Número*"
          class="input input-bordered"
          name="code"
          value={billingAddressNumber}
          onChange={(e) =>
            e.target && setBillingAddressNumber(e.currentTarget.value)}
        />
        <input
          placeholder="Complemento"
          class="input input-bordered"
          name="code"
          value={billingAddressComplement}
          onChange={(e) =>
            e.target && setBillingAddressComplement(e.currentTarget.value)}
        />
        <button
          type={"submit"}
          class="btn bg-[#2B2B30] text-white mt-5 disabled:loading border-none"
        >
          {loading ? "Concluindo..." : "Concluir Cadastro"}
        </button>
      </form>
    </div>
  );
}

export default CheckoutForm;
