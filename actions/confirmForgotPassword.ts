export interface Props {
  email: string;
  code: string;
  newPassword: string;
}

const confirmForgotPassword = async (
  props: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch(
      "https://api.ecanna.com.br/auth/forgot-password/confirm",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: props.email,
          code: props.code,
          newPassword: props.newPassword,
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

export default confirmForgotPassword;
