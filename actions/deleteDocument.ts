export interface Props {
  docId: string;
  token: string;
}

const signUpCognito = async (
  props: Props,
  _req: Request,
): Promise<unknown | null> => {
  console.log({ docId: props.docId });
  try {
    const response = await fetch(
      `http://localhost:3000/documents/${props.docId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: props.token,
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

export default signUpCognito;
