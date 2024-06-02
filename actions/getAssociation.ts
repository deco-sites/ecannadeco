export interface Props {
  id: string;
}

const getAssociation = async (
  { id }: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch(
      `https://api.ecanna.com.br/associations/${id}`,
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
