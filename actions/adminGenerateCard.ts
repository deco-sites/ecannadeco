import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

export interface Props {
  token: string;
  params?: {
    cognito_id: string;
  };
}

export interface GenerateCardResponse {
  cardResponse: {
    uuid: string;
    category: string;
    url: string;
    pdf_card: string;
    tag: string;
  };
  message?: string;
}

const adminGenerateCard = async (
  { token, params }: Props,
  _req: Request,
): Promise<GenerateCardResponse> => {
  try {
    console.log("AQUI");
    console.log(`${API_URL}/admin/generate-card/${params?.cognito_id}`);
    const response = await fetch(
      `${API_URL}/admin/generate-card/${params?.cognito_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      },
    );

    const res = await response.json();

    console.log({ res });
    return res;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default adminGenerateCard;
