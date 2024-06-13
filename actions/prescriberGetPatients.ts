export interface Props {
  token: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface Response {
  docs: Patient[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  limit: number;
}

export type Patient = {
  _id: string;
  name: string;
  profile: {
    email: string;
  };
  lastReport?: string | Date;
  status?: string;
};

const prescriberGetPetients = async (
  { token, search, page = 1, limit = 6 }: Props,
  _req: Request,
): Promise<Response | null> => {
  try {
    let query = `?page=${page}&limit=${limit}`;
    query += search ? `&search=${search}` : "";

    const response = await fetch(
      `https://api.ecanna.com.br/prescribers/patients${query}`,
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
    return res.patients;
  } catch (e) {
    return e;
  }
};

export default prescriberGetPetients;
