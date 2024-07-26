import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

export interface Props {
  token: string;
  params?: {
    email?: string;
    page: number;
    limit: number;
  };
}

export type AssociationUsers = {
  _id: string;
  qrcode_url: string;
  email: string;
  cognito_id: string;
  associationApproved?: boolean;
  cognito_data: {
    cpf: string;
    name: string;
  };
}[];

export type AssociationUsersResponse = {
  message?: string;
  docs?: AssociationUsers;
  totalDocs?: number;
  limit?: number;
  totalPages?: number;
  page?: number;
  pagingCounter?: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
};

const getAssociation = async (
  { token, params }: Props,
  _req: Request,
): Promise<AssociationUsersResponse> => {
  try {
    let url = `${API_URL}/profile/admin`;

    if (params) {
      const query = `?limit=${params.limit}&page=${params.page}${
        params.email && `&email=${params.email}`
      }`;
      url = `${API_URL}/profile/admin${query}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const res = await response.json();
    console.log({ res });
    return res;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default getAssociation;
