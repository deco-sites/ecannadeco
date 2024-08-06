import { TreatmentResponse } from "deco-sites/ecannadeco/components/ui/PatientTreatmentReportLive.tsx";
import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

export interface Props {
  token: string;
  id: string;
  goodFeelings: FeelingReport[];
  badFeelings: FeelingReport[];
}

export type FeelingReport = {
  _id: string;
  grade: number;
};

const createTreatmentReport = async (
  { token, id, goodFeelings, badFeelings }: Props,
  _req: Request,
): Promise<TreatmentResponse> => {
  try {
    const response = await fetch(
      `${API_URL}/treatment-reports`,
      {
        method: "POST",
        body: JSON.stringify({
          treatment: id,
          goodFeelings,
          badFeelings,
        }),
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

export default createTreatmentReport;
