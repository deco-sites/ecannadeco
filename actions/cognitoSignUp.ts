import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";
export interface Props {
  email: string;
  password: string;
  name: string;
  cpf?: string;
  phone: string;
  interest?: string;
  associationCNPJ?: string;
  dealName?: string;
  legacyCPF?: string;
}

const signUpCognito = async (
  props: Props,
  _req: Request,
) => {
  try {
    const cpf = props.legacyCPF ? props.legacyCPF : props.cpf;

    const response = await fetch(`${API_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: props.email,
        password: props.password,
        name: props.name,
        cpf,
        phone: props.phone,
        interest: props.interest,
        association: props.associationCNPJ,
        dealName: props.dealName,
        associationApproved: Boolean(props.legacyCPF),
      }),
    });

    const res = await response.json();
    console.log({ responseSignup: res });

    return res;
  } catch (e) {
    console.log({ e });
    throw e;
  }
};

export default signUpCognito;
