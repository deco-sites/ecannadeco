import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";
export interface Props {
  token: string;
}

const getUserPrescriber = async (
  { token }: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch(`${API_URL}/prescribers/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const res = await response.json();
    return res;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default getUserPrescriber;
