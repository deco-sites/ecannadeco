import { invoke } from "../../runtime.ts";
import { useState } from "preact/hooks";

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
      console.log({ data });
      localStorage.setItem(
        "AccessToken",
        data.data.AuthenticationResult.AccessToken,
      );
      setLoading(false);
      window.location.href = "/meus-dados";
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
          <input
            placeholder="Email"
            class="input rounded-md text-[#8b8b8b] outline-none"
            name="email"
            value={email}
            onChange={(e) => e.target && setEmail(e.currentTarget.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            class="input rounded-md text-[#8b8b8b] outline-none"
            value={password}
            onChange={(e) => e.target && setPassword(e.currentTarget.value)}
            name="email"
          />
        </div>
        <button
          type={"submit"}
          class="btn btn-primary text-white mt-5 disabled:loading border-none uppercase text-sm font-semibold"
        >
          {loading ? "Entrando..." : "ENTRAR"}
        </button>
      </form>
    </div>
  );
}

export default SignInForm;
