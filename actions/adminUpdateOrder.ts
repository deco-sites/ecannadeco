import { Product } from "deco-sites/ecannadeco/components/ui/CheckoutUpsellModal.tsx";
import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

export interface Props {
  token: string;
  orderId: string;
  newStatus?: string;
  shippingTrackingCode?: string;
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
  shipping_tracking_code?: string;
  items: {
    sku: Sku;
    quantity: number;
  }[];
}

const adminUpdateOrder = async (
  { token, orderId, newStatus, shippingTrackingCode }: Props,
  _req: Request,
): Promise<unknown> => {
  const url = `${API_URL}/admin/orders/${orderId}`;

  let body = {};
  if (newStatus) {
    body = { status: newStatus };
  } else if (shippingTrackingCode) {
    body = { shipping_tracking_code: shippingTrackingCode };
  }

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const res = await response.json();
    return res;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default adminUpdateOrder;
