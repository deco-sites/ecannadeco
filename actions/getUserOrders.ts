import { Product } from "deco-sites/ecannadeco/components/ui/CheckoutUpsellModal.tsx";

export interface Props {
  token: string;
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
  user_data?: {
    name: string;
    email?: string;
    association?: {
      name: string;
    };
    address?: {
      street: string;
      number: string;
      complement: string;
      neighborhood: string;
      city: string;
      state: string;
      cep: string;
    }[];
    pdf_card?: string;
  };
}

export interface PaginationOrderResponse {
  docs: Order[];
  totalDocs: number;
  totalPages: number;
  page: number;
}

const getUserOrders = async (
  { token }: Props,
  _req: Request,
): Promise<PaginationOrderResponse> => {
  try {
    const response = await fetch("https://api.ecanna.com.br/orders/", {
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

export default getUserOrders;
