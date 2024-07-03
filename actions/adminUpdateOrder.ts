import { Product } from "deco-sites/ecannadeco/components/ui/CheckoutUpsellModal.tsx";

export interface Props {
  token: string;
  orderId: string;
  newStatus: string;
}

export interface Sku {
  _id: string;
  name: string;
  product: string | Product;
}

export interface Order {
  _id: string;
  value: number;
  type: string;
  status:
    | "PAID"
    | "PENDING"
    | "CANCELED"
    | "IN_PRODUCTION"
    | "PENDING_SHIPPING"
    | "SHIPPED"
    | "DELIVERED";
  subscription: string;
  payment: string;
  created_at: string;
  updated_at: string;
  items: {
    sku: Sku;
    quantity: number;
  }[];
}

const adminUpdateOrder = async (
  { token, orderId, newStatus }: Props,
  _req: Request,
): Promise<unknown> => {
  const url = `https://api.ecanna.com.br/admin/orders/${orderId}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    const res = await response.json();
    return res;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default adminUpdateOrder;
