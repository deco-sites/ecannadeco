import { invoke } from "../../runtime.ts";
import { useState } from "preact/hooks";
import StepTimeline from "../../components/ui/StepTimeline.tsx";

export interface Props {
  formTitle?: string;
}

function SignUpForm({ formTitle }: Props) {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [termsAgree, setTermsAgree] = useState<boolean>(false);
  const [cpfError, setCpfError] = useState("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (name == "" || cpf == "" || email == "" || password == "") {
      alert("Preencha todos os campos");
      return null;
    }
    if (cpfError != "") {
      alert("Digite um cpf válido");
      return null;
    }
    if (termsAgree) {
      setLoading(true);
      try {
        const dataSignup = await invoke["deco-sites/ecannadeco"].actions
          .cognitoSignUp(
            { email, password, name, cpf },
          );

        const dataS = dataSignup as { errors?: Array<unknown> };

        console.log({ dataS });

        if (dataS.errors && dataS.errors.length > 0) {
          alert(
            "Não foi possível fazer signup. Verifique as informações fornecidas e tente novamente.",
          );
          setLoading(false);
        } else {
          localStorage.setItem("emailConfirm", email);
          localStorage.setItem("cpfUserAsaas", cpf);
          localStorage.setItem("nameUserAsaas", name);
          setLoading(false);
          window.location.href = "/confirmar-cadastro";
        }
      } catch (e) {
        alert(
          "Não foi possível fazer signup. Verifique as informações fornecidas e tente novamente.",
        );
        console.log({ e });
        setLoading(false);
      }
    } else {
      alert(
        "Você deve concordar com os Termos de Uso e Políticas de Privacidade para continuar seu cadastro",
      );
    }
  };

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

  const handleCPFInputChange = (event: Event) => {
    const inputValue = (event.target as HTMLInputElement).value;
    setCpf(inputValue);
    setCpfError(validarCPF(inputValue) ? "" : "CPF inválido");
  };

  return (
    <div class="max-w-[480px] flex flex-col">
      <StepTimeline step={1} />
      <form
        class="form-control flex flex-col gap-2"
        onSubmit={(e) => handleSubmit(e)}
      >
        <span class="text-2xl text-[#8b8b8b] font-semibold text-center my-4">
          Criar Conta
        </span>
        <label class="w-full">
          <div class="label pb-1">
            <span class="label-text text-xs text-[#585858]">
              Nome
            </span>
          </div>
          <input
            class="input rounded-md text-[#8b8b8b] border-none w-full"
            placeholder="Seu nome completo"
            name="nome"
            value={name}
            onChange={(e) => {
              setName(e.currentTarget.value);
            }}
          />
        </label>
        <label class="w-full">
          <div class="label pb-1">
            <span class="label-text text-xs text-[#585858]">
              CPF
            </span>
          </div>
          <input
            class="input rounded-md text-[#8b8b8b] border-none w-full"
            placeholder="Seu CPF"
            name="cpf"
            value={cpf}
            onChange={(e) => {
              handleCPFInputChange(e);
            }}
          />
          {cpfError !== "" && (
            <div class="label">
              <span class="label-text-alt text-red-500">{cpfError}</span>
            </div>
          )}
        </label>
        <label class="w-full">
          <div class="label pb-1">
            <span class="label-text text-xs text-[#585858]">
              Email
            </span>
          </div>
          <input
            class="input rounded-md text-[#8b8b8b] border-none w-full"
            placeholder="Seu email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.currentTarget.value);
            }}
          />
        </label>
        <label class="w-full">
          <div class="label pb-1">
            <span class="label-text text-xs text-[#585858]">
              Senha
            </span>
          </div>
          <input
            class="input rounded-md text-[#8b8b8b] border-none w-full"
            type="password"
            placeholder="Senha de 8 caracteres"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.currentTarget.value);
            }}
          />
        </label>

        <label class="cursor-pointer label flex justify-start gap-2">
          <input
            type="checkbox"
            checked={termsAgree}
            class="checkbox checkbox-xs border-[#8b8b8b] bg-white"
            onChange={(e) => {
              setTermsAgree(e.currentTarget.checked);
            }}
          />
          <span class="label-text text-xs text-[#8b8b8b]">
            Concordo com os <a class="underline" href="#">Termos de Uso</a> e
            {" "}
            <a class="underline" href="#">Políticas de Privacidade</a>
          </span>
        </label>
        <button
          type={"submit"}
          class="btn btn-primary text-white mt-5 disabled:loading border-none"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;
