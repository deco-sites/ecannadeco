import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

const getPlans = async (_req: Request): Promise<unknown | null> => {
  try {
    const response = await fetch(
      API_URL + "/products/subscriptions",
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

export default getPlans;
