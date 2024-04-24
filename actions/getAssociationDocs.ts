export interface Props {
  token: string;
  associationId: string;
}

const getDocs = async (
  { token, associationId }: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch(
      `http://http://development.eba-93ecmjzh.us-east-1.elasticbeanstalk.com//documents/association/${associationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
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

export default getDocs;
