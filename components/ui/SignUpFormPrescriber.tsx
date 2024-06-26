import { invoke } from "../../runtime.ts";
import { useState } from "preact/hooks";
import StepTimeline from "./StepTimeline.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";

export interface Props {
  formTitle?: string;
}

function SignUpFormPrescriber({
  formTitle = "Prescritor - Criar Conta",
}: Props) {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [registryType, setRegistryType] = useState<string>("");
  const [registryNumber, setRegistryNumber] = useState<string>("");
  const [registryState, setRegistryState] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [termsAgree, setTermsAgree] = useState<boolean>(false);
  const [cpfError, setCpfError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

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

  const maskCPF = (cpf: string) => {
    if (cpf.length < 11) return cpf;

    // Recebe um CPF com 11 dígitos e insere os caracteres de formatação
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const handleCPFInputChange = (event: Event) => {
    const inputValue = (event.target as HTMLInputElement).value;
    setCpf(stripCPFNonNumericCharacters(inputValue));
    setCpfError(validarCPF(inputValue) ? "" : "CPF inválido");
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailInputChange = (event: Event) => {
    const inputValue = (event.target as HTMLInputElement).value;
    setEmail(inputValue);
    if (validateEmail(inputValue)) {
      setEmailError("");
    } else {
      setEmailError("Email inválido");
    }
  };

  const stripCPFNonNumericCharacters = (str: string) => {
    return str.replace(/[^\d]/g, "");
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (name == "" || registryType == "" || email == "" || password == "") {
      alert("Preencha todos os campos");
      return null;
    }
    if (termsAgree) {
      setLoading(true);
      try {
        const dataSignup = await invoke[
          "deco-sites/ecannadeco"
        ].actions.cognitoPrescriberSignUp({
          email,
          password,
          registryType,
          registryNumber,
          registryState,
          name,
          cpf,
        });

        const dataS = dataSignup as {
          errors?: Array<unknown>;
        };

        if (dataS.errors && dataS.errors.length > 0) {
          alert(
            "Não foi possível fazer signup. Verifique as informações fornecidas e tente novamente.",
          );
          setLoading(false);
        } else {
          if (IS_BROWSER) {
            localStorage.setItem("prescriberEmailConfirm", email);
            localStorage.setItem("prescriberNameUserAsaas", name);
            localStorage.setItem("prescriberCpfUserAsaas", cpf);
          }

          setLoading(false);
          window.location.href = "/prescritor/confirmar-cadastro";
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

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(password);
  };

  const handlePasswordInputChange = (event: Event) => {
    const inputValue = (event.target as HTMLInputElement).value;
    setPassword(inputValue);
    if (validatePassword(inputValue)) {
      setPasswordError("");
    } else {
      setPasswordError(
        "A senha deve conter pelo menos 8 caracteres, incluindo: letras maiúsculas, minúsculas, números e caracteres especiais.",
      );
    }
  };

  return (
    <div class="max-w-[480px] flex flex-col">
      <StepTimeline step={1} />
      <form
        class="form-control flex flex-col gap-2"
        onSubmit={(e) => handleSubmit(e)}
      >
        <span class="text-2xl text-[#8b8b8b] font-semibold text-center my-4">
          {formTitle}
        </span>
        <label class="w-full">
          <div class="label pb-1">
            <span class="label-text text-xs text-[#585858]">
              Nome Profissional (ex: Dra. Dani Silva)*
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
            <span class="label-text text-xs text-[#585858]">Email</span>
          </div>
          <input
            class="input rounded-md text-[#8b8b8b] border-none w-full"
            placeholder="Seu email"
            name="email"
            value={email}
            onChange={(e) => {
              handleEmailInputChange(e);
            }}
          />
          {emailError !== "" && (
            <div class="label">
              <span class="label-text-alt text-red-500">{emailError}</span>
            </div>
          )}
        </label>
        <label class="w-full">
          <div class="label pb-1">
            <span class="label-text text-xs text-[#585858]">
              CPF (somente números)
            </span>
          </div>
          <input
            class="input rounded-md text-[#8b8b8b] border-none w-full"
            placeholder="Seu CPF"
            name="cpf"
            value={maskCPF(cpf)}
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
        <label className="w-full">
          <div className="label pb-1">
            <span className="label-text text-xs text-[#585858]">
              Tipo de Registro Profissional
            </span>
          </div>
          <select
            class="select rounded-md text-[#8b8b8b] border-none w-full"
            name="registryType"
            value={registryType}
            onChange={(e) => {
              setRegistryType(e.currentTarget.value);
            }}
          >
            <option value="">Selecione (CRM, CRO, CRMV)</option>
            <option value="CRM">CRM - Médico</option>
            <option value="CRM">CRMV - Veterinário</option>
            <option value="CRO">CRO - Dentista</option>
          </select>
        </label>
        <label className="w-full">
          <div className="label pb-1">
            <span className="label-text text-xs text-[#585858]">
              UF de Registro
            </span>
          </div>
          <select
            class="select rounded-md text-[#8b8b8b] border-none w-full"
            name="registryState"
            value={registryState}
            onChange={(e) => {
              setRegistryState(e.currentTarget.value);
            }}
          >
            <option value="">Selecione</option>
            <option value="AC">Acre (AC)</option>
            <option value="AL">Alagoas (AL)</option>
            <option value="AP">Amapá (AP)</option>
            <option value="AM">Amazonas (AM)</option>
            <option value="BA">Bahia (BA)</option>
            <option value="CE">Ceará (CE)</option>
            <option value="DF">Distrito Federal (DF)</option>
            <option value="ES">Espírito Santo (ES)</option>
            <option value="GO">Goiás (GO)</option>
            <option value="MA">Maranhão (MA)</option>
            <option value="MT">Mato Grosso (MT)</option>
            <option value="MS">Mato Grosso do Sul (MS)</option>
            <option value="MG">Minas Gerais (MG)</option>
            <option value="PA">Pará (PA)</option>
            <option value="PB">Paraíba (PB)</option>
            <option value="PR">Paraná (PR)</option>
            <option value="PE">Pernambuco (PE)</option>
            <option value="PI">Piauí (PI)</option>
            <option value="RJ">Rio de Janeiro (RJ)</option>
            <option value="RN">Rio Grande do Norte (RN)</option>
            <option value="RS">Rio Grande do Sul (RS)</option>
            <option value="RO">Rondônia (RO)</option>
            <option value="RR">Roraima (RR)</option>
            <option value="SC">Santa Catarina (SC)</option>
            <option value="SP">São Paulo (SP)</option>
            <option value="SE">Sergipe (SE)</option>
            <option value="TO">Tocantins (TO)</option>
          </select>
        </label>

        <label class="w-full">
          <div class="label pb-1">
            <span class="label-text text-xs text-[#585858]">
              Número do Registro
            </span>
          </div>
          <input
            class="input rounded-md text-[#8b8b8b] border-none w-full"
            placeholder="000000-0"
            name="registryNumber"
            value={registryNumber}
            onChange={(e) => {
              setRegistryNumber(e.currentTarget.value);
            }}
          />
        </label>
        <label class="w-full">
          <div class="label pb-1">
            <span class="label-text text-xs text-[#585858]">
              Senha (8 caracteres)
            </span>
          </div>
          <input
            class="input rounded-md text-[#8b8b8b] border-none w-full"
            type="password"
            placeholder="1 maiúscula, 1 minúscula, 1 caracter especial"
            name="password"
            value={password}
            onChange={(e) => {
              handlePasswordInputChange(e);
            }}
          />
          {passwordError !== "" && (
            <div class="label">
              <span class="label-text-alt text-red-500">{passwordError}</span>
            </div>
          )}
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
            Concordo com os{" "}
            <a
              target="_blank"
              class="underline"
              href="/prescritor/termos-de-uso"
            >
              Termos de Uso e Políticas de Privacidade
            </a>
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

export default SignUpFormPrescriber;
