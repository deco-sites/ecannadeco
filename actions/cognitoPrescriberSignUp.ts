export interface Props {
  email: string;
  password: string;
  registryType: string;
  registryNumber: string;
  registryState: string;
}

const signUpCognitoPrescriber = async (
  props: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch("http://192.168.0.7/prescribers/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: props.email,
        password: props.password,
        registry_type: props.registryType,
        registry_number: props.registryNumber,
        registry_state: props.registryState,
      }),
    });

    const res = await response.json();
    return res;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default signUpCognitoPrescriber;
