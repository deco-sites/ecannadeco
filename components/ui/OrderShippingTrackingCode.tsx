import { invoke } from "../../runtime.ts";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

type Status =
  | "PAID"
  | "PENDING"
  | "CANCELED"
  | "IN_PRODUCTION"
  | "PENDING_SHIPPING"
  | "SHIPPED"
  | "DELIVERED";

export interface Props {
  id?: string;
  code: string;
  adminView?: boolean;
}

function OrderShippingTrackingCode({ code, id, adminView }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [trackingCode, setTrackingCode] = useState(code);

  const handleSaveCode = async () => {
    setIsLoading(true);

    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AdminAccessToken") || "";
    }

    try {
      const res = await invoke[
        "deco-sites/ecannadeco"
      ].actions.adminUpdateOrder({
        token: accessToken,
        orderId: id,
        shippingTrackingCode: trackingCode,
      });
      console.log({ res });
      setIsLoading(false);
    } catch (e) {
      console.log({ e });
      alert(
        "Houve um erro neste operação. Não foi possível salvar novo status",
      );
      setIsLoading(false);
      return e;
    }
  };

  return isLoading
    ? <span class="loading loading-spinner" />
    : adminView
    ? (
      <div class="join">
        <label class="join-item">
          <div class="label pb-1">
            <span class="label-text text-xs text-[#585858]">
              Código Rastreio
            </span>
          </div>
          <input
            placeholder="..."
            name="código"
            class="input input-xs rounded-md text-[#8b8b8b] border-none"
            // disabled={addressStreet != "" ? true : false}
            value={trackingCode}
            onChange={(e) => {
              setTrackingCode(e.currentTarget.value);
            }}
            // onFocus={() => setDisplayCidResults(true)}
            // onBlur={() => setDisplayCidResults(false)}
          />
          <button
            class="btn btn-xs btn-ghost bg-[#dedede] text-[#5d5d5d] join-item"
            onClick={() => handleSaveCode()}
          >
            Salvar{" "}
            {isLoading && (
              <span class="loading loading-spinner text-green-600"></span>
            )}
          </button>
        </label>
      </div>
    )
    : (
      <div class="my-2 p-2 bg-white rounded-md w-fit">
        <span class={``}>
          Código de Rastreamento: <span class="font-bold">{trackingCode}</span>
        </span>
      </div>
    );
}

export default OrderShippingTrackingCode;
