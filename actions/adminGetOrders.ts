import { Product } from "deco-sites/ecannadeco/components/ui/CheckoutUpsellModal.tsx";

export interface Props {
  token: string;
  params?: {
    status?: string;
    page: number;
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
  items: {
    sku: Sku;
    quantity: number;
  }[];
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
  let url = `https://service.ecanna.com.br/admin/orders/`;

  if (params) {
    const query = `?limit=${params.limit}&page=${params.page}${
      params.status && `&status=${params.status}`
    }`;
    url = `https://service.ecanna.com.br/admin/orders${query}`;
  }

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
