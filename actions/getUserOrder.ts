import { Product } from "deco-sites/ecannadeco/components/ui/CheckoutUpsellModal.tsx";
import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

export interface Props {
  token: string;
  orderId: string;
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
  payment: {
    status: string;
  };
  created_at: string;
  updated_at: string;
  items: {
    sku: Sku;
    quantity: number;
  }[];
  user_data?: {
    email: string;
  };
}

export interface OrderResponse {
  order: Order;
}

const getUserOrder = async (
  { token, orderId }: Props,
  _req: Request,
): Promise<Order> => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const res = await response.json();
    return res;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default getUserOrder;
