import { invoke } from "../../runtime.ts";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

export interface Props {
  formTitle?: string;
}

function ForgotPasswordForm({ formTitle = "Recuperar Senha" }: Props) {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (email == "") {
      alert("Preencha todos os campos");
      return null;
    }
    setLoading(true);
    try {
      const dataSignup = await invoke["deco-sites/ecannadeco"].actions
        .forgotPassword(
          { email },
        );

      const dataS = dataSignup as { errors?: Array<unknown> };

      console.log({ dataS });

      if (dataS.errors && dataS.errors.length > 0) {
        alert(
          "Não foi possível fazer signup. Verifique as informações fornecidas e tente novamente.",
        );
        setLoading(false);
      } else {
        if (IS_BROWSER) {
          localStorage.setItem("emailForgotPassword", email);
        }
        setLoading(false);
        window.location.href = "/confirmar-recuperar-senha";
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
          {formTitle}
        </span>
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

        <button
          type={"submit"}
          class="btn btn-primary text-white mt-5 disabled:loading border-none"
        >
          {loading ? "Enviando..." : "Enviar Código"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;
