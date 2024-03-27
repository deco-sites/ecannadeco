/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
// import { useUI } from "../../sdk/useUI.ts";
import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import { Plan } from "../../components/ui/Checkout.tsx";

function MyAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [email, setEmail] = useState("");
  const [currentPlan, setCurrentPlan] = useState<string>("");
  const [newPlan, setNewPlan] = useState<Plan>();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  useEffect(() => {
    // Pega accessCode no localStorage para verificar se ainda está válida a sessão via api
    const accessToken = localStorage.getItem("AccessToken") || "";

    if (accessToken === "") {
      window.location.href = "/";
    }

    try {
      setIsLoading(true);

      invoke["deco-sites/ecannadeco"].actions.getUser({
        token: accessToken,
      }).then((r) => {
        const res = r as {
          data: { UserAttributes: { Name: string; Value: string }[] };
          dataProfile: { plan: string };
        };

        const email = res.data.UserAttributes.find((a) =>
          a["Name"] === "email"
        );

        console.log({ currentPlan: res.dataProfile.plan });

        setEmail(email?.Value || "");
        setCurrentPlan(res.dataProfile.plan);
        setNewPlan(plans.find((p) => p.name === res.dataProfile.plan));

        setIsLoading(false);
      });

      const params = fetch(
        `http://localhost:3000/v1/products/subscriptions`,
      ).then(async (r) => {
        const c = await r.json();
        console.log({ plans: c.docs });

        const plansList = c.docs as Plan[];
        setPlans(plansList);
      });
    } catch (e) {
      alert(
        "Não foi possível carregar dados do usuário. Tente novamente mais tarde ou contecte o suporte.",
      );
      setIsLoading(false);
    }
  }, []); // Passando um array de dependências vazio

  const handleChangePassword = () => {
    if ((confirmNewPassword !== newPassword) || (!currentPassword)) {
      alert(
        "Verifique os campos necessários para alterar a senha e tente novamente.",
      );
    } else {
      try {
        setIsChanging(true);

        invoke["deco-sites/ecannadeco"].actions.changePassword({
          token: localStorage.getItem("AccessToken") || "",
          body: {
            newPassword: confirmNewPassword,
            oldPassword: currentPassword,
          },
        }).then((r) => {
          const res = r as { message?: string };
          if (res.message) {
            alert(res.message);
          } else {
            console.log({ r });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setIsChanging(false);
            alert("senha alterada com sucesso!");
          }
        });
      } catch (e) {
        alert(
          "Não foi possível alterar a senha. Tente mais tarde",
        );
        setIsChanging(false);
      }
    }
  };

  return (
    <div class="container flex justify-center">
      <div class="w-[70%] p-16 bg-slate-300">
        {isLoading
          ? <span class="loading loading-spinner text-green-600"></span>
          : (
            <div class="flex flex-col gap-4">
              <div class="flex justify-center mb-8">
                <h3 class="text-xl font-semibold">Minha Conta</h3>
              </div>
              <div>
                <label class="input input-bordered flex items-center gap-2">
                  <div class="label">
                    <span class="label-text">Email</span>
                  </div>
                  <input
                    placeholder="Email"
                    name="email"
                    disabled
                    value={email}
                  />
                </label>
              </div>
              <div>
                <h3>Alterar Senha</h3>
                <label class="input input-bordered flex items-center gap-2">
                  <div class="label">
                    <span class="label-text">Senha Atual</span>
                  </div>
                  <input
                    type="password"
                    placeholder="até 8 caracteres"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={(e) =>
                      e.target &&
                      setCurrentPassword(e.currentTarget.value)}
                    disabled={isChanging}
                  />
                </label>
                <label class="input input-bordered flex items-center gap-2">
                  <div class="label">
                    <span class="label-text">Nova Senha</span>
                  </div>
                  <input
                    type="password"
                    placeholder="até 8 caracteres"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) =>
                      e.target &&
                      setNewPassword(e.currentTarget.value)}
                    disabled={isChanging}
                  />
                </label>
                <label
                  class={`input input-bordered flex items-center gap-2 ${
                    confirmNewPassword !== newPassword && "input-error"
                  }`}
                >
                  <div class="label">
                    <span class="label-text">Confirmar Nova Senha</span>
                  </div>
                  <input
                    type="password"
                    placeholder="até 8 caracteres"
                    name="ConfirmNewPassword"
                    value={confirmNewPassword}
                    onChange={(e) =>
                      e.target &&
                      setConfirmNewPassword(e.currentTarget.value)}
                    disabled={isChanging}
                  />
                  {confirmNewPassword !== newPassword && (
                    <div class="label">
                      <span class="label-text-alt"></span>
                      <span class="label-text-alt text-red-500">
                        Não é igual à nova senha
                      </span>
                    </div>
                  )}
                </label>

                <button class="btn btn-outline" onClick={handleChangePassword}>
                  Alterar Senha{" "}
                  {isChanging && (
                    <span class="loading loading-spinner text-green-600"></span>
                  )}
                </button>
              </div>
              <div>
                <h3>Plano</h3>
                <select
                  class="select select-bordered"
                  value={newPlan?.name}
                  onChange={(e) =>
                    e.target &&
                    setNewPlan(
                      plans.find((p) => p.name === e.currentTarget.value),
                    )}
                >
                  {plans.map((plan) => (
                    <option
                      value={plan.skus[0]}
                      onClick={(e) =>
                        e.target &&
                        setNewPlan(
                          plans.find((p) => p.name === e.currentTarget.value),
                        )}
                    >
                      {plan.name + (plan.name == currentPlan ? " (atual)" : "")}
                    </option>
                  ))}
                </select>
                <button
                  class="btn btn-outline"
                  disabled={newPlan?.name == currentPlan}
                >
                  Alterar Plano
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default MyAccount;
