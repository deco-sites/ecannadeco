import { TreatmentResponse } from "deco-sites/ecannadeco/components/ui/PatientTreatmentReportLive.tsx";

export interface Props {
  token: string;
  treatmentId: string;
}

const prescriberGetTreatmentByPatient = async (
  { token, treatmentId }: Props,
  _req: Request,
): Promise<TreatmentResponse | null> => {
  try {
    const response = await fetch(
      `https://api.ecanna.com.br/prescribers/treatments/${treatmentId}`,
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
    return res;
  } catch (e) {
    return e;
  }
};

export default prescriberGetTreatmentByPatient;
