export interface Props {
  term: string;
  token: string;
}

const getCids = async (
  { term, token }: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch(
      `http://development.eba-93ecmjzh.us-east-1.elasticbeanstalk.com/cids?name=${term}`,
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

export default getCids;
