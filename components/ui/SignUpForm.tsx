import { invoke } from "../../runtime.ts";
import { useState } from "preact/hooks";

export interface Props {
  formTitle?: string;
}

function SignUpForm({ formTitle }: Props) {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [termsAgree, setTermsAgree] = useState<boolean>(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (termsAgree) {
      setLoading(true);
      try {
        const dataSignup = await invoke["deco-sites/ecannadeco"].actions
          .cognitoSignUp(
            { email, password },
          );
        localStorage.setItem("emailConfirmCheckout", email);
        setLoading(false);
        window.location.href = "/confirmar-cadastro";
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
    <div class="max-w-[480px]">
      <form
        class="form-control justify-start gap-2 py-8 px-10 bg-[#931C31] rounded-xl"
        onSubmit={(e) => handleSubmit(e)}
      >
        <span class="text-sm text-white font-semibold w-[80%] mb-4">
          {formTitle}
        </span>
        <input
          placeholder="Email"
          class="input input-bordered"
          name="email"
          value={email}
          onChange={(e) => e.target && setEmail(e.currentTarget.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          class="input input-bordered"
          value={password}
          onChange={(e) => e.target && setPassword(e.currentTarget.value)}
          name="email"
        />
        <label class="cursor-pointer label flex justify-start gap-2">
          <input
            type="checkbox"
            checked={termsAgree}
            class="checkbox checkbox-xs border-white"
            onChange={(e) => {
              setTermsAgree(e.currentTarget.checked);
            }}
          />
          <span class="label-text text-xs text-white">
            Concordo com os <a href="#">Termos de Uso</a> e{" "}
            <a href="#">Políticas de Privacidade</a>
          </span>
        </label>
        <button
          type={"submit"}
          class="btn bg-[#2B2B30] text-white mt-5 disabled:loading border-none"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;
