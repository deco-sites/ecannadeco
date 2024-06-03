import FormWrap from "./FormWrap.tsx";
import { useState } from "preact/hooks";
import StepTimeline from "../../components/ui/StepTimeline.tsx";
import { invoke } from "../../runtime.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";

function ConfirmSignup() {
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [timer, setTimer] = useState(30);
  const [association, setAssociation] = useState("");
  const [plan, setPlan] = useState("");
  const [email, setEmail] = useState("");

  if (IS_BROWSER) {
    setAssociation(
      localStorage.getItem("associationSignup") || "",
    );
    setPlan(
      localStorage.getItem("userPlan") || "",
    );
    setEmail(
      localStorage.getItem("emailConfirm") || "",
    );
  }

  const resendConfirmationCode = async () => {
    setSending(true);
    try {
      const r = await invoke["deco-sites/ecannadeco"].actions
        .resendConfirmationCode(
          { email },
        );
      console.log({ r });
      setSending(false);
      setCodeSent(true);

      const thistimer = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer == 0) {
            setCodeSent(false);
            clearInterval(thistimer); // Stop the interval
            return (59);
          } else {
            return (prevTimer - 1);
          }
        });
      }, 1000); // Interval of 1000 milliseconds (1 second)
    } catch (e) {
      setSending(false);
      console.log(e);
      alert("Erro ao reenviar código. Contacte o suporte");
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (code == "") {
      alert("Preencha o código");
      return null;
    }

    try {
      setLoading(true);
      const r = await invoke["deco-sites/ecannadeco"].actions
        .confirmCognitoSignup(
          { email, code },
        );

      const data = r as { message?: string };

      if (data.message) {
        setLoading(false);
        alert(`Erro: ${data.message}`);
      } else {
        setLoading(false);
        if (association != "") {
          window.location.href = "/confirmar-cadastro/associacao";
        } else {
          if (plan === "TREATMENT") {
            window.location.href = "/entrar";
          } else {
            window.location.href = "/confirmar-cadastro/plano";
          }
        }
      }
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
          <div class="flex gap-2">
          </div>
          <button
            type={"submit"}
            class="btn btn-primary text-white mt-5 disabled:loading border-none"
          >
            {loading ? "Cadastrando..." : "Confirmar"}
          </button>
          {codeSent
            ? (
              <span class="text-green-500 text-xs">
                Código Enviado... {timer}s
              </span>
            )
            : (
              <button
                type="button"
                onClick={resendConfirmationCode}
                class="btn btn-ghost text-slate-400"
              >
                {sending ? "Enviando..." : "Reenviar Código"}
              </button>
            )}
        </form>
      </div>
    </FormWrap>
  );
}

export default ConfirmSignup;
