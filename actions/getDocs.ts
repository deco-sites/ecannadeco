export interface Props {
  token: string;
}

const getDocs = async (
  { token }: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch("https://api.ecanna.com.br/documents", {
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

export default getDocs;
