export interface Props {
  email: string;
  code: string;
}

const confirmCognitoSignup = async (
  props: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch(
      "http://http://production.eba-93ecmjzh.us-east-1.elasticbeanstalk.com//auth/confirm-signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: props.email,
          code: props.code,
        }),
      },
    );

    const res = await response.json();
    return res;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default confirmCognitoSignup;
