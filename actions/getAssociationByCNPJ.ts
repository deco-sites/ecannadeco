import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

export interface Props {
  cnpj: string;
}

const getAssociation = async (
  { cnpj }: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch(
      `${API_URL}/associations/cnpj/${cnpj}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const res = await response.json();
    return res._doc;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default getAssociation;