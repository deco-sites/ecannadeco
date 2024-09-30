import { invoke } from "../../runtime.ts";
import { useEffect, useState } from "preact/hooks";
import StepTimeline from "../../components/ui/StepTimeline.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
// import { firstMessages, isEmail, required, validate } from "validasaur";
import type { Association } from "../../components/ui/UserAssociatedSignup.tsx";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  formTitle?: string;
}

function SignUpForm({ formTitle = "Criar Conta" }: Props) {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [termsAgree, setTermsAgree] = useState<boolean>(false);
  const [cpfError, setCpfError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [whatsappError, setWhatsappError] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [interest, setInterest] = useState("");
  const [associationCNPJ, setAssociationCNPJ] = useState("");
  const [dealName, setDealName] = useState("");
  const [associationName, setAssociationName] = useState("");
  const [associationLogo, setAssociationLogo] = useState("");
  // const { displayAlert, alertText, alertType } = useUI();

  useEffect(() => {
    if (IS_BROWSER) {
      const params = new URLSearchParams(globalThis.location.search);
      const cnpj = params.get("cnpj");
      const ref = localStorage.getItem("referral");
      if (cnpj) {
        setAssociationCNPJ(cnpj);
        invoke["deco-sites/ecannadeco"].actions
          .getAssociationByCNPJ({
            cnpj,
          })
          .then((r) => {
            console.log({ associationResponse: r });
            const resp = r as Association;
            setAssociationName(resp.name);
            setAssociationLogo(resp.logo_url);
            setLoading(false);
          });
      }
      if (ref) {
        setDealName(ref);
      }
      const servicePipeline = localStorage.getItem("servicePipeline");
      setInterest(servicePipeline || "");
    }
  }, []);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    // const inputs = {
    //   email,
    //   password,
    //   name,
    //   cpf,
    //   whatsapp,
    // };

    // const [_passes, errors] = await validate(inputs, {
    //   name: required,
    //   cpf: required,
    //   email: [required, isEmail],
    //   password: required,
    //   whatsapp: required,
    // });

    // const firstErrors = firstMessages(errors);

    // if (errors) {
    //   const firstField = Object.keys(firstErrors)[0];
    //   const firstErrorMessage = firstErrors[firstField];
    //   displayAlert.value = true;
    //   alertText.value = String(firstErrorMessage);
    //   alertType.value = "error";
    //   return null;
    // }
    if (
      cpfError != "" ||
      emailError != "" ||
      passwordError != "" ||
      whatsappError != ""
    ) {
      alert("Preencha os campos corretamente para prosseguir!");
      return null;
    }

    if (termsAgree) {
      setLoading(true);
      try {
        const dataSignup = await invoke[
          "deco-sites/ecannadeco"
        ].actions.cognitoSignUp({
          email,
          password,
          name,
          cpf,
          phone: whatsapp,
          interest,
          associationCNPJ,
          dealName,
        });

        console.log({ dataSignup });

        const dataS = dataSignup as {
          errors?: Array<unknown>;
          message?: string;
          data?: { association?: { _id: string }; plan: string };
        };

        const association = dataS.data?.association;
        const plan = dataS.data?.plan;

        if (dataS.message) {
          alert(`Não foi possível fazer signup: ${dataS.message}`);
          setLoading(false);
        } else {
          if (IS_BROWSER) {
            localStorage.setItem("emailConfirm", email);
            localStorage.setItem("cpfUserAsaas", cpf);
            localStorage.setItem("nameUserAsaas", name);
            localStorage.setItem("phoneUserAsaas", whatsapp);
            if (association) {
              localStorage.setItem("associationSignup", association._id);
              localStorage.setItem("nameUserAssociationSignup", name);
            }
            if (plan) {
              localStorage.setItem("userPlan", plan);
            }
          }

          setLoading(false);
          window.location.href = "/confirmar-cadastro";
        }
      } catch (e) {
        alert(`Não foi possível fazer signup: ${e}`);
        setLoading(false);
      }
    } else {
      console.log({ email, password, name, cpf, phone: whatsapp, interest });
      alert(
        "Você deve concordar com os Termos de Uso e Políticas de Privacidade para continuar seu cadastro",
      );
    }
  };

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(password);
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateWhatsapp = (whatsAppNumber: string) => {
    // Verifica se o número tem o formato correto com DDD no início e 11 dígitos
    const regex = /^\d{11}$/;
    return regex.test(whatsAppNumber);
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

  const handleEmailInputChange = (event: Event) => {
    let inputValue = (event.target as HTMLInputElement).value;
    inputValue = inputValue.toLowerCase(); // Força todas as letras a estarem em minúsculas
    setEmail(inputValue);
    if (validateEmail(inputValue)) {
      setEmailError("");
    } else {
      setEmailError("Email inválido");
    }
  };

  const handlePasswordInputChange = (event: Event) => {
    const inputValue = (event.target as HTMLInputElement).value;
    setPassword(inputValue);
    if (validatePassword(inputValue)) {
      setPasswordError("");
    } else {
      setPasswordError(
        "Corrija: Sua senha deve conter pelo menos 8 caracteres, incluindo: letras maiúsculas, minúsculas, números e caracteres especiais ( $ # % ! )",
      );
    }
  };

  const handleCPFInputChange = (event: Event) => {
    const inputValue = (event.target as HTMLInputElement).value;
    setCpf(stripCPFNonNumericCharacters(inputValue));
    setCpfError(validarCPF(inputValue) ? "" : "CPF inválido");
  };

  const handleWhatsAppInputChange = (event: Event) => {
    const inputValue = (event.target as HTMLInputElement).value;
    setWhatsapp(stripWhatsappNonNumericCharacters(inputValue));
    setWhatsappError(
      validateWhatsapp(inputValue) ? "" : "Número de WhatsApp inválido",
    );
  };

  const maskCPF = (cpf: string) => {
    if (cpf.length < 11) return cpf;

    // Recebe um CPF com 11 dígitos e insere os caracteres de formatação
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const stripCPFNonNumericCharacters = (str: string) => {
    return str.replace(/[^\d]/g, "");
  };

  const maskWhatsAppNumber = (whatsAppNumber: string) => {
    if (whatsAppNumber.length < 11) return whatsAppNumber;

    // Recebe um número de WhatsApp nacional e insere os caracteres de formatação
    return whatsAppNumber.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const stripWhatsappNonNumericCharacters = (str: string) => {
    return str.replace(/[^\d]/g, "");
  };

  return (
    <div class="max-w-[480px] flex flex-col">
      <StepTimeline step={1} />
      {associationName
        ? (
          <div class="bg-white rounded-md p-4 flex flex-col items-center gap-4">
            <Image
              src={associationLogo}
              alt={`logo ${associationName}`}
              width={117}
              height={32}
            />
            <span class="text-center text-xs">
              Você está se cadastrando como associado da{" "}
              <span class="font-bold">{associationName}</span>
              {" "}
            </span>
            <span class="text-xs text-center text-red-500">
              Caso você não possua vínculo com a {associationName}, se cadastre
              {" "}
              <a class="text-blue-600 underline" href="/cadastrar">
                clicando aqui
              </a>
            </span>
          </div>
        )
        : null}
      <form
        class="form-control flex flex-col gap-2"
        onSubmit={(e) => handleSubmit(e)}
      >
        <span class="text-2xl text-[#8b8b8b] font-semibold text-center my-4">
          {formTitle}
        </span>
        <label class="w-full">
          <div class="label pb-1">
            <span class="label-text text-xs text-[#585858]">Nome</span>
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
            <span class="label-text text-xs text-[#585858]">CPF</span>
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
            <span class="label-text text-xs text-[#585858]">Whatsapp</span>
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
            <span class="label-text text-xs text-[#585858]">Senha</span>
          </div>
          <input
            class="input rounded-md text-[#8b8b8b] border-none w-full"
            type="password"
            placeholder="Senha (8 caracteres)"
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
            <a target="_blank" class="underline" href="/termos-de-uso">
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

export default SignUpForm;
