export interface Props {
  token: string;
  interest: string;
}

const generateLead = async (
  { token, interest }: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch("https://api.ecanna.com.br/auth/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        interest,
      }),
    });

    const res = await response.json();
    return res;
  } catch (e) {
    return e;
  }
};

export default generateLead;
