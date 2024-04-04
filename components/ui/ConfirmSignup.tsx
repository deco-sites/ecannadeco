import FormWrap from "./FormWrap.tsx";
import { useState } from "preact/hooks";
import StepTimeline from "../../components/ui/StepTimeline.tsx";
import { invoke } from "../../runtime.ts";

function ConfirmSignup() {
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(
    localStorage.getItem("emailConfirm") || "",
  );

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (code == "") {
      alert("Preencha o código");
      return null;
    }

    try {
      setLoading(true);
      const data = await invoke["deco-sites/ecannadeco"].actions
        .confirmCognitoSignup(
          { email, code },
        );
      setLoading(false);
      window.location.href = "/confirmar-cadastro/plano";
    } catch (e) {
      alert(
        "Não foi possível confirmar o email. Verifique o código fornecido e tente novamente.",
      );
      console.log({ e });
      setLoading(false);
    }
  };

  return (
    <FormWrap>
      <div class="max-w-[480px]">
        <StepTimeline step={2} />
        <form
          class="form-control flex flex-col gap-2"
          onSubmit={(e) => handleSubmit(e)}
        >
          <span class="text-2xl text-[#8b8b8b] font-semibold text-center my-4">
            Confirmar Email
          </span>
          <span class="text-center text-sm text-[#8b8b8b]">
            Insira o código de verificação enviado para{" "}
            <span class="font-bold text-[#606060]">
              {email != "" ? email : "email não econtrado"}
            </span>
          </span>
          <label class="w-full">
            <input
              class="input rounded-md text-[#8b8b8b] border-none w-full"
              placeholder="Código"
              name="code"
              value={code}
              disabled={loading || email == ""}
              onChange={(e) => {
                setCode(e.currentTarget.value);
              }}
            />
          </label>

          <button
            type={"submit"}
            class="btn btn-primary text-white mt-5 disabled:loading border-none"
          >
            {loading ? "Cadastrando..." : "Confirmar"}
          </button>
        </form>
      </div>
    </FormWrap>
  );
}

export default ConfirmSignup;
