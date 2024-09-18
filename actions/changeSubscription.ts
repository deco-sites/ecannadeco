import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

export interface Props {
  token?: string;
  sku: string;
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
    address_street: string;
    address_state: string;
    address_city: string;
    phone: string;
  };
}

const changeSubscription = async (
  props: Props,
  _req: Request,
): Promise<unknown | null> => {
  const params = { ...props };
  delete params.token;
  const complement = props.holder_info?.address_complement ?? "não informado";
  const response = await fetch(
    `${API_URL}/checkout/upgrade`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token!,
      },
      body: JSON.stringify({
        sku: params.sku,
        credit_card_token: params.credit_card_token,
        credit_card: params.credit_card,
        holder_info: { ...params.holder_info, address_complement: complement },
      }),
    },
  );

  if (response.status > 401) {
    throw new Error("Unauthorized");
  }

  const res = await response.json();
  return res;
};

export default changeSubscription;
