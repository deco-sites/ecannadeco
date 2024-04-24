export interface Props {
  token: string;
}

const getUser = async (
  { token }: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch(
      "http://http://production.eba-93ecmjzh.us-east-1.elasticbeanstalk.com//profile",
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

export default getUser;
