import { invoke } from "../../runtime.ts";
import { useState } from "preact/hooks";
import StepTimeline from "./StepTimeline.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";

export interface Props {
  formTitle?: string;
}

function SignUpFormPrescriber({ formTitle }: Props) {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [registryType, setRegistryType] = useState<string>("");
  const [registryNumber, setRegistryNumber] = useState<string>("");
  const [registryState, setRegistryState] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [termsAgree, setTermsAgree] = useState<boolean>(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (name == "" || registryType == "" || email == "" || password == "") {
      alert("Preencha todos os campos");
      return null;
    }
    if (termsAgree) {
      setLoading(true);
      try {
        const dataSignup = await invoke["deco-sites/ecannadeco"].actions
          .cognitoPrescriberSignUp(
            { email, password, registryType, registryNumber, registryState },
          );

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

  return (
    <div class="max-w-[480px] flex flex-col">
      <StepTimeline step={1} />
      <form
        class="form-control flex flex-col gap-2"
        onSubmit={(e) => handleSubmit(e)}
      >
        <span class="text-2xl text-[#8b8b8b] font-semibold text-center my-4">
          Prescritor - Criar Conta
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

export default SignUpFormPrescriber;
