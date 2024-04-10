import { invoke } from "../../runtime.ts";
import { useState } from "preact/hooks";
import StepTimeline from "./StepTimeline.tsx";

export interface Props {
  formTitle?: string;
}

function ConfirmForgotPasswordForm({ formTitle }: Props) {
  const [email, setEmail] = useState<string>(
    localStorage.getItem("emailForgotPassword") || "",
  );
  const [code, setCode] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (email == "" || code == "" || password == "" || confirmPassword == "") {
      alert("Preencha todos os campos");
      return null;
    }
    setLoading(true);
    try {
      const data = await invoke["deco-sites/ecannadeco"].actions
        .confirmForgotPassword(
          { email, newPassword: confirmPassword, code },
        );

      const dataS = data as { message?: string };

      console.log({ dataS });

      if (dataS.message) {
        alert(
          `Não foi possível fazer essa operação: ${dataS.message}`,
        );
        setLoading(false);
      } else {
        alert(
          "Sua senha foi alterada com sucesso! Agora, você já pode fazer login na sua conta.",
        );
        localStorage.setItem("emailConfirm", "");
        setLoading(false);
        window.location.href = "/entrar";
      }
    } catch (e) {
      alert(
        "Não foi possível realizar esta operação. Contacte o suporte.",
      );
      console.log({ e });
      setLoading(false);
    }
  };

  return (
    <div class="max-w-[480px] flex flex-col">
      <form
        class="form-control flex flex-col gap-2"
        onSubmit={(e) => handleSubmit(e)}
      >
        <span class="text-2xl text-[#8b8b8b] font-semibold text-center my-4">
          Recuperar Senha
        </span>
        <span class="text-center text-sm">
          Informe o código enviado para <span class="font-bold">{email}</span>
          {" "}
          e crie uma nova senha
        </span>
        <label class="w-full">
          <div class="label pb-1">
            <span class="label-text text-xs text-[#585858]">
              Código
            </span>
          </div>
          <input
            class="input rounded-md text-[#8b8b8b] border-none w-full"
            placeholder="Código aqui"
            name="code"
            value={code}
            onChange={(e) => {
              setCode(e.currentTarget.value);
            }}
          />
        </label>
        <label class="w-full">
          <div class="label pb-1">
            <span class="label-text text-xs text-[#585858]">
              Nova Senha
            </span>
          </div>
          <input
            type="password"
            class="input rounded-md text-[#8b8b8b] border-none w-full"
            placeholder="Nova senha"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.currentTarget.value);
            }}
          />
        </label>
        <label class="w-full">
          <div class="label pb-1">
            <span class="label-text text-xs text-[#585858]">
              Confirmar Senha
            </span>
          </div>
          <input
            type="password"
            class="input rounded-md text-[#8b8b8b] border-none w-full"
            placeholder="Confirmar nova senha"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.currentTarget.value);
            }}
          />
          {confirmPassword !== password && (
            <div class="label">
              <span class="label-text-alt"></span>
              <span class="label-text-alt text-red-500">
                Não é igual à nova senha
              </span>
            </div>
          )}
        </label>

        <button
          type={"submit"}
          class="btn btn-primary text-white mt-5 disabled:loading border-none"
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}

export default ConfirmForgotPasswordForm;
