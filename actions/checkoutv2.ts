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
  holder_info?: {
    full_name: string;
    email: string;
    cpf_cnpj: string;
    postal_code: string;
    address_number: string;
    address_complement: string;
    phone: string;
  };
}

const checkoutv2 = async (
  props: Props,
  _req: Request,
): Promise<unknown | null> => {
  const params = { ...props };
  delete params.token;

  const response = await fetch("https://api.ecanna.com.br/checkout/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: props.token || "",
    },
    body: JSON.stringify(params),
  });

  if (response.status > 401) {
    throw new Error("Unauthorized");
  }

  const res = await response.json();
  return res;
};

export default checkoutv2;
