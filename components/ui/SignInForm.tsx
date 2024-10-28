import { invoke } from "../../runtime.ts";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

export interface Props {
  formTitle?: string;
}

interface SignInResponse {
  data: {
    AuthenticationResult: {
      AccessToken: string;
    };
  };
}

function SignInForm({ formTitle }: Props) {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await invoke["deco-sites/ecannadeco"].actions
        .cognitoSignIn(
          { email, password },
        ) as SignInResponse;
      if (IS_BROWSER) {
        localStorage.setItem(
          "AccessToken",
          data.data.AuthenticationResult.AccessToken,
        );
      }
      setLoading(false);
      window.location.href = "/dashboard";
      setEmail("");
      setPassword("");
    } catch (e) {
      alert(
        "Usuário ou senha incorretos",
      );
      console.log({ e });
      setLoading(false);
    }
  };

  return (
    <div class="max-w-[480px] md:max-w-[600px]">
      <form
        class="form-control justify-start gap-2"
        onSubmit={(e) => handleSubmit(e)}
      >
        <span class="text-2xl text-[#8b8b8b] font-semibold text-center my-4">
          {formTitle}
        </span>
        <div class="flex flex-col gap-4">
          <label class="w-full">
            <div class="label pb-1">
              <span class="label-text text-xs text-[#585858]">
                Email
              </span>
            </div>
            <input
              class="input rounded-md text-[#8b8b8b] border border-[#f1f1f1] w-full"
              placeholder="Seu email"
              name="email"
              value={email}
              onChange={(e) => e.target && setEmail(e.currentTarget.value)}
            />
          </label>
          <label class="w-full">
            <div class="label pb-1">
              <span class="label-text text-xs text-[#585858]">
                Senha
              </span>
            </div>
            <input
              type="password"
              class="input rounded-md text-[#8b8b8b] border border-[#f1f1f1] w-full"
              placeholder="Sua senha"
              name="password"
              value={password}
              onChange={(e) => e.target && setPassword(e.currentTarget.value)}
            />
            <div class="label">
              <span class="label-text-alt"></span>
              <a
                href="/recuperar-senha"
                class="label-text-alt text-xs text-[#585858] underline"
              >
                Esqueci minha senha
              </a>
            </div>
          </label>
        </div>
        <button
          type={"submit"}
          class="btn btn-primary text-white mt-5 disabled:loading border-none uppercase text-sm font-semibold"
        >
          {loading ? "Entrando..." : "ENTRAR"}
        </button>
        <span class="pt-2 text-xs text-[#8b8b8b]">
          Não tem conta?{" "}
          <a class="underline" href={"/cadastrar"}>Cadastre-se</a>
        </span>
      </form>
    </div>
  );
}

export default SignInForm;
