import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

export interface Props {
  email: string;
  cpf: string;
  password: string;
  registryType: string;
  registryNumber: string;
  registryState: string;
  phone: string;
  name: string;
}

const signUpCognitoPrescriber = async (
  props: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch(
      API_URL + "/prescribers/sign-up",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: props.email,
          cpf: props.cpf,
          password: props.password,
          name: props.name,
          phone: props.phone,
          registry_type: props.registryType,
          registry_number: props.registryNumber,
          registry_state: props.registryState,
        }),
      },
    );
    const statusCode = response.status;
    const res = await response.json();
    if (statusCode >= 400) {
      throw res.message;
    }

    return res;
  } catch (e) {
    throw new Error(e);
  }
};

export default signUpCognitoPrescriber;
