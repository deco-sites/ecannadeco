export interface Props {
  email: string;
  subject: string;
  content: string;
}

const signUpCognito = async (
  props: Props,
  _req: Request,
): Promise<unknown | null> => {
  const params = {
    fields: [
      {
        name: "email",
        value: props.email,
      },
      {
        name: "TICKET.subject",
        value: props.subject,
      },
      {
        name: "TICKET.content",
        value: props.content,
      },
    ],
  };
  try {
    const response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/43817859/88ccb64a-bb13-4c72-ade6-1bb9e6157946`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      },
    );

    const res = await response.json();
    return res;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default signUpCognito;
