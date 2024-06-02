const getPlans = async (_req: Request): Promise<unknown | null> => {
  try {
    const response = await fetch(
      "https://api.ecanna.com.br/products/subscriptions",
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
