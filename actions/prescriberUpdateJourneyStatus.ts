import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

export interface Props {
  token: string;
  treatmentId: string;
  status: string;
}

const getUser = async (
  { token, treatmentId, status }: Props,
  _req: Request,
): Promise<unknown | null> => {
  console.log({ token, treatmentId, status });
  try {
    const response = await fetch(
      `${API_URL}/prescribers/treatment-journey-status/${treatmentId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          treatmentJourneyStatus: status,
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
    // console.log({ e });
    return e;
  }
};

export default getUser;
