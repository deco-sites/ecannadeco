import { TreatmentResponse } from "deco-sites/ecannadeco/components/ui/PatientTreatmentReportLive.tsx";
import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

export interface Props {
  token: string;
  id: string;
}

const getTreatment = async (
  { token, id }: Props,
  _req: Request,
): Promise<TreatmentResponse> => {
  try {
    const response = await fetch(
      `${API_URL}/treatments/${id}`,
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

export default getTreatment;
