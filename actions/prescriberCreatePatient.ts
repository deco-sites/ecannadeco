import { API_URL } from "../sdk/constants.ts";

export interface Props {
  token: string;
  name: string;
  email: string;
  phone: string;
}

const prescriberCreatePetient = async (
  { token, name, email, phone }: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch(
      `${API_URL}/prescribers/patients`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          name,
          email,
          phone: phone.replace(/\D/g, ""),
        }),
      },
    );
    // TODO: handle errors
    const res = await response.json();
    console.log({ res });
    return res;
  } catch (e) {
    return e;
  }
};

export default prescriberCreatePetient;
