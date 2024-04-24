export interface Props {
  id: string;
  token: string;
}

export type AssociationAdmin = {
  _id: string;
  user: string;
  name: string;
  cnpj: string;
  logo_url: string;
  status: string;
};

const getAssociation = async (
  { id, token }: Props,
  _req: Request,
): Promise<AssociationAdmin> => {
  try {
    const response = await fetch(
      `http://http://development.eba-93ecmjzh.us-east-1.elasticbeanstalk.com//associations/admin/${id}`,
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
