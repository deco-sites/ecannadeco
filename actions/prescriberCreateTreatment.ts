import { Treatment } from "deco-sites/ecannadeco/components/ui/PrescriberPatientsLive.tsx";
import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

export interface Props {
  token: string;
  treatment: Treatment | null;
}

const prescriberCreateTreatment = async (
  { token, treatment }: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch(
      `${API_URL}/prescribers/treatments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          patient: treatment?.patient?._id,
          medications: treatment?.medications,
        }),
      },
    );
    const res = await response.json();
    return res;
  } catch (e) {
    return e;
  }
};

export default prescriberCreateTreatment;
