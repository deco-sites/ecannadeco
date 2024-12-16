import { invoke } from "../../runtime.ts";
import { useState } from "preact/hooks";
import StepTimeline from "./StepTimeline.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
// import { firstMessages, isEmail, required, validate } from "validasaur";
import { useUI } from "../../sdk/useUI.ts";

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
  const [whatsappError, setWhatsappError] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const { displayAlert, alertText, alertType } = useUI();

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

    // const inputs = {
    //   name,
    //   registryType,
    //   email,
    //   password,
    //   whatsapp,
    //   registryNumber,
    //   registryState,
    //   termsAgree,
    // };

    // const [_passes, errors] = await validate(inputs, {
    //   name: required,
    //   registryType: required,
    //   email: [required, isEmail],
    //   password: required,
    //   whatsapp: required,
    //   registryNumber: required,
    //   registryState: required,
    //   termsAgree: required,
    // });

    // const firstErrors = firstMessages(errors);
    // console.log({ errors });

    // if (errors) {
    //   const firstField = Object.keys(firstErrors)[0];
    //   const firstErrorMessage = firstErrors[firstField];
    //   displayAlert.value = true;
    //   alertText.value = String(firstErrorMessage);
    //   alertType.value = "error";
    //   return null;
    // }
    if (whatsappError || emailError) {
      displayAlert.value = true;
      alertText.value =
        "Corrija o erro das informações (em vermelho) para continuar";
      alertType.value = "error";
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
          phone: "+55" + whatsapp,
          cpf,
        });

        const dataS = dataSignup as {
          errors?: Array<unknown>;
        };

        if (dataS.errors && dataS.errors.length > 0) {
          displayAlert.value = true;
          alertText.value =
            "Não foi possível fazer signup. Verifique as informações fornecidas e tente novamente.";
          alertType.value = "error";

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
        displayAlert.value = true;
        alertText.value =
          "Não foi possível fazer signup. Verifique as informações fornecidas e tente novamente.";
        alertType.value = "error";
        console.log({ e });
        setLoading(false);
      }
    } else {
      displayAlert.value = true;
      alertText.value =
        "Você deve concordar com os Termos de Uso e Políticas de Privacidade para continuar seu cadastro";
      alertType.value = "error";
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

  const validateWhatsapp = (whatsAppNumber: string) => {
    // Verifica se o número tem o formato correto com DDD no início e 11 dígitos
    const regex = /^\d{11}$/;
    return regex.test(whatsAppNumber);
  };

  const maskWhatsAppNumber = (whatsAppNumber: string) => {
    if (whatsAppNumber.length < 11) return whatsAppNumber;

    // Recebe um número de WhatsApp nacional e insere os caracteres de formatação
    return whatsAppNumber.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const stripWhatsappNonNumericCharacters = (str: string) => {
    return str.replace(/[^\d]/g, "");
  };

  const handleWhatsAppInputChange = (event: Event) => {
    const inputValue = (event.target as HTMLInputElement).value;
    setWhatsapp(stripWhatsappNonNumericCharacters(inputValue));
    setWhatsappError(
      validateWhatsapp(inputValue) ? "" : "Número de WhatsApp inválido",
    );
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
            <span class="label-text text-xs text-[#585858]">
              Whatsapp (somente números)
            </span>
          </div>
          <input
            class="input rounded-md text-[#8b8b8b] border-none w-full"
            placeholder="Seu whatsapp"
            name="whatsapp"
            value={maskWhatsAppNumber(whatsapp)}
            onChange={(e) => {
              handleWhatsAppInputChange(e);
            }}
          />
          {whatsappError !== "" && (
            <div class="label">
              <span class="label-text-alt text-red-500">{whatsappError}</span>
            </div>
          )}
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
            <option value="">Selecione</option>
            <option value="CRM">CRM - Conselho Médico</option>
            <option value="CRMV">CRMV - Conselho Veterinário</option>
            <option value="CRO">CRO - Conselho Dentista</option>
            <option value="CRP">CRP - Conselho Psicólogo</option>
            <option value="CRF">CRF - Conselho Farmacêutico</option>
            <option value="CREFITO">CREFITO - Conselho de Fisioterapia</option>
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
