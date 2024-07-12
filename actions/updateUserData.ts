import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

export interface Props {
  token: string;
  avatar_photo: string;
  name: string;
  cpf: string;
  cids: string[];
  phone: string;
  birth_date: string;
  address: {
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    addressType: "BILLING" | "SHIPPING";
  };
}

const updateUserData = async (
  props: Props,
  _req: Request,
): Promise<unknown | null> => {
  const { token, avatar_photo, name, cpf, address, cids, phone, birth_date } =
    props;

  const updateCognitoUserBody = {
    name,
    "custom:cpfcnpj": cpf,
  };

  const updateProfileBody = {
    name,
    cpf,
    avatar_photo,
    cids,
    address,
    phone,
    birth_date,
  };

  try {
    const responseUpdateProfile = await fetch(
      `${API_URL}/profile`,
      {
        method: "PUT",
        body: JSON.stringify(updateProfileBody),
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      },
    );

    const resProfile = await responseUpdateProfile.json();

    console.log({ resProfile });

    const responseUpdateCognito = await fetch(
      `${API_URL}/auth/me`,
      {
        method: "PUT",
        body: JSON.stringify(updateCognitoUserBody),
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      },
    );

    const resCognito = await responseUpdateCognito.json();

    return { resProfile, resCognito };
  } catch (e) {
    console.log({ e });
    return e;
  }
};

export default updateUserData;
