export interface Props {
  status:
    | "PAID"
    | "PENDING"
    | "CANCELED"
    | "IN_PRODUCTION"
    | "PENDING_SHIPPING"
    | "SHIPPED"
    | "DELIVERED";
}

function OrderStatus({ status }: Props) {
  const style = {
    "PAID": {
      title: "PAGO",
      style: "bg-[#2ea714]",
    },
    "PENDING": {
      title: "PENDENTE",
      style: "bg-[#e27234]",
    },
    "CANCELED": {
      title: "CANCELADO",
      style: "bg-[#e82222]",
    },
    "IN_PRODUCTION": {
      title: "EM PRODUÇÃO",
      style: "bg-primary",
    },
    "PENDING_SHIPPING": {
      title: "ENVIO PENDENTE",
      style: "bg-primary",
    },
    "SHIPPED": {
      title: "ENVIADO",
      style: "bg-primary",
    },
    "DELIVERED": {
      title: "ENTREGUE",
      style: "bg-[#2ea714]",
    },
  };

  return (
    <span
      class={`badge badge-sm border-none text-white text-[10px] sm:text-xs md:text-sm ${
        style[status].style
      }`}
    >
      {style[status].title}
    </span>
  );
}

export default OrderStatus;
