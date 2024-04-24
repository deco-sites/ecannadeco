export interface Props {
  docId: string;
  token: string;
}

const deleteDocument = async (
  props: Props,
  _req: Request,
): Promise<unknown | null> => {
  console.log({ docId: props.docId });
  try {
    const response = await fetch(
      `http://development.eba-93ecmjzh.us-east-1.elasticbeanstalk.com/documents/${props.docId}`,
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

export default deleteDocument;
