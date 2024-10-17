import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

export interface Props {
  token?: string;
  items: {
    sku: string;
    quantity: number;
  }[];
  credit_card_token?: string;
  credit_card?: {
    holder: string;
    number: string;
    exp_month: string;
    exp_year: string;
    ccv: string;
  };
  pix?: boolean;
  voucher?: string;
  holder_info?: {
    full_name: string;
    email: string;
    birth_date: string;
    cpf_cnpj: string;
    postal_code: string;
    address_number: string;
    address_complement: string;
    address_state: string;
    address_city: string;
    address_street: string;
    phone: string;
  };
}

const checkoutv2 = async (
  props: Props,
  _req: Request,
): Promise<unknown | null> => {
  const params = { ...props };
  delete params.token;

  const response = await fetch(`${API_URL}/checkout/v2`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: props.token || "",
    },
    body: JSON.stringify(params),
  });


  if(response.status === 422) {
    const res = await response.json();
    return { errors: [res.message], ...res };
  }

  if (response.status === 401) {
    throw new Error("Não autorizado");
  }

  if (response.status >= 400) {
    throw new Error("Error");
  }

  const res = await response.json();
  return res;
};

export default checkoutv2;
