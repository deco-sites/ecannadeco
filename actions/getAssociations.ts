import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

const getAssociation = async (): Promise<unknown | null> => {
  try {
    const response = await fetch(
      `${API_URL}/associations?limit=100`,
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

export default getAssociation;
