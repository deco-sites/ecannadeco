import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

export interface Props {
  term: string;
}

const getDealByName = async (
  { term }: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch(
      `${API_URL}/deals/${term}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const res = await response.json();
    return res;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default getDealByName;
