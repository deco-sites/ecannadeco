export interface Props {
  id: string;
  token: string;
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

export type AssociationAdmin = {
  _id: string;
  user: string;
  name: string;
  cnpj: string;
  logo_url: string;
  status: string;
  association_users: AssociationUsers;
};

const getAssociation = async (
  { id, token }: Props,
  _req: Request,
): Promise<AssociationAdmin> => {
  try {
    const response = await fetch(
      `http://localhost:3000/associations/admin/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      },
    );

    console.log({ responseAdminAssociation: response });

    const res = await response.json();
    return res;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default getAssociation;
