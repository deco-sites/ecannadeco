export interface Props {
  token: string;
  body: {
    newPassword: string;
    oldPassword: string;
  };
}

const changePassword = async (
  { token, body }: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch(
      "http://http://development.eba-93ecmjzh.us-east-1.elasticbeanstalk.com//auth/change-password",
      {
        method: "PUT",
        body: JSON.stringify(body),
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

export default changePassword;
