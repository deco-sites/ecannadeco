export interface Props {
  email: string;
  password: string;
}

const signInCognito = async (
  props: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch(
      "https://api.ecanna.com.br/prescribers/sign-in",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: props.email,
          password: props.password,
        }),
      },
    );

    const res = await response.json();
    console.log({ res });
    return res;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default signInCognito;
