import { TreatmentResponse } from "deco-sites/ecannadeco/components/ui/PatientTreatmentReportLive.tsx";
import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

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
      `${API_URL}/prescribers/treatments/${treatmentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      },
    );
    const res = await response.json();
    return res;
  } catch (e) {
    return e;
  }
};

export default prescriberGetTreatmentByPatient;
