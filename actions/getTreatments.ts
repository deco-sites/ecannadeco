export interface Props {
  token: string;
}

export type Treatment = {
  _id: string;
  updated_at: string;
  status?: "NEUTRAL" | "GOOD" | "BAD";
  medications: {
    name: string;
    dosage: string;
  }[];
  isActive: boolean;
  prescriber?: {
    _id: string;
    name: string;
    registry_type: string;
    registry_state: string;
    registry_number: string;
  };
  patient?: {
    _id: string;
    name: string;
  };
  prescription?: File;
  treatmentJourneyStatus:
    | "DEFAULT"
    | "RECEIVED_PRESCRIPTION"
    | "BOUGHT_MEDICATION"
    | "RECEIVED_MEDICATION"
    | "STARTED_TREATMENT"
    | "ABANDONED"
    | "CONCLUDED";
};

const getTreatments = async (
  { token }: Props,
  _req: Request,
): Promise<Treatment[] | null> => {
  try {
    const response = await fetch(
      `https://api.ecanna.com.br/treatments`,
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

export default getTreatments;
