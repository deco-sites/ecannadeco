export interface Props {
  token: string;
}

const getTreatments = async (
  { token }: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch(
      `https://api.ecanna.com.br/treatments`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      },
    );
    const res = await response.json();
    return res.docs;
  } catch (e) {
    return e;
  }
};

export default getTreatments;
