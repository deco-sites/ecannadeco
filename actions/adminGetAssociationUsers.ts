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
  email: string;
  cognito_id: string;
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
    let url = `http://localhost:3000/profile/admin`;

    if (params) {
      const query = `?limit=${params.limit}&page=${params.page}${
        params.email && `&email=${params.email}`
      }`;
      url = `http://localhost:3000/profile/admin${query}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const res = await response.json();
    return res;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default getAssociation;
