import { TreatmentResponse } from "deco-sites/ecannadeco/components/ui/PatientTreatmentReportLive.tsx";

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
      `https://api.ecanna.com.br/treatments/${id}`,
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
