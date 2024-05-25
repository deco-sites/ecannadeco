export interface Props {
  token: string;
  patientId: string;
}

const prescriberGetTreatmentsByPatient = async (
  { token, patientId }: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch(
      `https://api.ecanna.com.br/prescribers/treatments?patient=${patientId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      },
    );
    const res = await response.json();
    return res.docs;
  } catch (e) {
    return e;
  }
};

export default prescriberGetTreatmentsByPatient;
