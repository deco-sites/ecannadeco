export interface Props {
  email: string;
  cpf: string;
  password: string;
  registryType: string;
  registryNumber: string;
  registryState: string;
  name: string;
}

const signUpCognitoPrescriber = async (
  props: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch(
      "http://localhost/prescribers/sign-up",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: props.email,
          cpf: props.cpf,
          password: props.password,
          name: props.name,
          registry_type: props.registryType,
          registry_number: props.registryNumber,
          registry_state: props.registryState,
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

export default signUpCognitoPrescriber;
