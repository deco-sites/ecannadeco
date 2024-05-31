export interface Props {
  token: string;
  search?: string;
}

const prescriberGetPetients = async (
  { token, search }: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const query = search ? `?search=${search}` : "";
    const response = await fetch(
      `https://api.ecanna.com.br/prescribers/patients${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        
      },
    );
    const res = await response.json();
    console.log({ res });
    return res.patients.docs;
  } catch (e) {
    return e;
  }
};

export default prescriberGetPetients;
