export interface Props {
  token: string;
  name: string;
  email: string;
}

const prescriberCreatePetient = async (
  { token, name, email }: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch(
      `https://api.ecanna.com.br/prescribers/patients`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          name,
          email,
        }),
      },
    );
    const res = await response.json();
    console.log({ res });
    return res;
  } catch (e) {
    return e;
  }
};

export default prescriberCreatePetient;
