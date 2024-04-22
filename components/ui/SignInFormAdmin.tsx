import { invoke } from "../../runtime.ts";
import { useState } from "preact/hooks";

export interface Props {
  formTitle?: string;
}

interface SignInResponse {
  AuthenticationResult: {
    AccessToken: string;
  };
}

function SignInFormAdmin({ formTitle }: Props) {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await invoke["deco-sites/ecannadeco"].actions
        .cognitoAdminSignIn(
          { email, password },
        ) as SignInResponse;
      console.log({ data });
      localStorage.setItem(
        "AdminAccessToken",
        data.AuthenticationResult.AccessToken,
      );
      setLoading(false);
      window.location.href = "/sys/admin/orders";
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
              class="input rounded-md text-[#8b8b8b] border-none w-full"
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
              class="input rounded-md text-[#8b8b8b] border-none w-full"
              placeholder="Sua senha"
              name="password"
              value={password}
              onChange={(e) => e.target && setPassword(e.currentTarget.value)}
            />
          </label>
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

export default SignInFormAdmin;
