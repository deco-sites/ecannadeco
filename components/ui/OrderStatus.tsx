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
  status: Status;
  adminView?: boolean;
}

function OrderStatus({ status, id, adminView }: Props) {
  const [statusState, setStatusState] = useState(status);
  const [isLoading, setIsLoading] = useState(false);

  const style = {
    PAID: {
      title: "PAGO",
      style: "bg-[#2ea714]",
    },
    PENDING: {
      title: "PENDENTE",
      style: "bg-[#e27234]",
    },
    CANCELED: {
      title: "CANCELADO",
      style: "bg-[#e82222]",
    },
    IN_PRODUCTION: {
      title: "EM PRODUÇÃO",
      style: "bg-primary",
    },
    PENDING_SHIPPING: {
      title: "ENVIO PENDENTE",
      style: "bg-primary",
    },
    SHIPPED: {
      title: "ENVIADO",
      style: "bg-primary",
    },
    DELIVERED: {
      title: "ENTREGUE",
      style: "bg-[#2ea714]",
    },
  };

  const handleChangeStatus = async (newStatus: Status) => {
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
        newStatus,
      });
      console.log({ res });
      setStatusState(newStatus);
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
      <select
        value={statusState}
        onChange={(e) => {
          handleChangeStatus(e.currentTarget.value as Status);
        }}
        class={`select select-xs select-primary rounded-full max-w-xs text-white border-none ${
          style[statusState].style
        } ${
          (statusState === "DELIVERED" || statusState === "CANCELED") &&
          "pointer-events-none"
        }`}
      >
        <option disabled selected>
          Altere o Status
        </option>
        <option value="">Todos</option>
        <option value="PAID">Pago</option>
        <option value="PENDING">Pendente</option>
        <option value="CANCELED">Cancelado</option>
        <option value="IN_PRODUCTION">Em Produção</option>
        <option value="PENDING_SHIPPING">Envio Pendente</option>
        <option value="SHIPPED">Enviado</option>
        <option value="DELIVERED">Entregue</option>
      </select>
    )
    : (
      <span
        class={`badge badge-sm border-none text-white text-[10px] sm:text-xs ${
          style[status].style
        }`}
      >
        {style[status].title}
      </span>
    );
}

export default OrderStatus;
