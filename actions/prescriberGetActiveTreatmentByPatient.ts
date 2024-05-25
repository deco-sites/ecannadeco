import { Treatment } from "deco-sites/ecannadeco/components/ui/PrescriberPatientsLive.tsx";

export interface Props {
  token: string;
  patientId: string;
}

const prescriberGetActiveTreatmentByPatient = async (
  { token, patientId }: Props,
  _req: Request,
): Promise<Treatment | null> => {
  try {
    const response = await fetch(
      `https://api.ecanna.com.br/prescribers/treatments?patient=${patientId}&isActive=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      },
    );
    const res = await response.json();
    return res.docs[0];
  } catch (e) {
    return e;
  }
};

export default prescriberGetActiveTreatmentByPatient;
