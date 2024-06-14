import { Treatment } from "deco-sites/ecannadeco/components/ui/PrescriberPatientsLive.tsx";

export interface Props {
  token: string;
  patientId: string;
  isActive: boolean;
  page?: number;
}

export interface Response {
  docs: Treatment[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  limit: number;
}

const prescriberGetTreatmentsByPatient = async (
  { token, patientId, page = 1, isActive = true }: Props,
  _req: Request,
): Promise<Response | null> => {
  try {
    const response = await fetch(
      `https://api.ecanna.com.br/prescribers/treatments?patient=${patientId}&page=${page}&isActive=${isActive}`,
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

export default prescriberGetTreatmentsByPatient;
