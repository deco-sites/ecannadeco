export interface Props {
  email: string;
  password: string;
  name: string;
  cpf: string;
  phone: string;
  interest?: string;
}

const signUpCognito = async (
  props: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch("https://api.ecanna.com.br/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: props.email,
        password: props.password,
        name: props.name,
        cpf: props.cpf,
        phone: props.phone,
        interest: props.interest,
      }),
    });

    if (response.status > 400) {
      throw new Error("Erro ao criar conta");
    }

    const res = await response.json();
    return res;
  } catch (e) {
    throw e;
  }
};

export default signUpCognito;
