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
        <button
          type={"submit"}
          class="btn bg-[#2B2B30] text-white mt-5 disabled:loading border-none"
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}

export default SignInForm;
