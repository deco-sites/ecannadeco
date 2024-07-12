import { useUI } from "deco-sites/ecannadeco/sdk/useUI.ts";

export default function AlertInfo() {
  const { displayAlert, alertText, alertType } = useUI();
  const alertClass = {
    warning: "alert-warning bg-yellow-500 text-black",
    error: "alert-error bg-red-500 text-white",
    success: "alert-success bg-green-500 text-white",
  };

  return (
    <div
      onClick={() => {
        displayAlert.value = false;
      }}
      role="alert"
      class={`${displayAlert.value ? "flex" : "hidden"} alert ${
        alertClass[alertType.value]
      } fixed bottom-4 z-[9999]`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="h-6 w-6 shrink-0 stroke-current"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        >
        </path>
      </svg>
      <span>{alertText}</span>
    </div>
  );
}
