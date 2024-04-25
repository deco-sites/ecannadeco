export interface Props {
  token: string;
}

const signOut = async (
  { token }: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch(
      "https://service.ecanna.com.br/auth/sign-out",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
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

export default signOut;
