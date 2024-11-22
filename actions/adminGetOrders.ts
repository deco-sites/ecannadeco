import { Product } from "deco-sites/ecannadeco/components/ui/CheckoutUpsellModal.tsx";
import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

export interface Props {
  token: string;
  params?: {
    status?: string;
    type?: string;
    page: number;
    isExpo?: boolean;
    limit: number;
  };
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
  items: Sku[];
  user_data?: {
    name: string;
    email: string;
    cognito_id: string;
    tag?: string;
    pdf_card?: string;
    association: {
      name: string;
    }[];
    address: {
      street?: string;
      number?: string;
      complement?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
      cep?: string;
    }[];
  };
}

export interface PaginationOrderResponse {
  docs: Order[];
  totalDocs: number;
  totalPages: number;
  page: number;
  limit?: number;
  pagingCounter?: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

const adminGetOrders = async (
  { token, params }: Props,
  _req: Request,
): Promise<PaginationOrderResponse> => {
  let url = `${API_URL}/admin/orders?limit=100`;

  if (params) {
    const query = `?limit=${params.limit}&page=${params.page}${
      params.status && `&status=${params.status}`
    }${(params.type && params.type !== "") && `&type=${params.type}`}${
      params.isExpo ? `&isExpo=${params.isExpo}` : ""
    }`;
    url = `${API_URL}/admin/orders${query}`;
  }

  console.log({ url });

  try {
    const response = await fetch(url, {
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

export default adminGetOrders;
