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
    phone: string;
  };
}

const changeSubscription = async (
  props: Props,
  _req: Request,
): Promise<unknown | null> => {
  const params = { ...props };
  delete params.token;
  try {
    const response = await fetch(
      "http://http://production.eba-93ecmjzh.us-east-1.elasticbeanstalk.com//checkout/upgrade",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: props.token!,
        },
        body: JSON.stringify({ ...params }),
      },
    );

    const res = await response.json();
    return res;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default changeSubscription;
