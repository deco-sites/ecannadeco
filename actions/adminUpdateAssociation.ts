export interface Props {
  id: string;
  body: AssociationAdminUpdate;
  token: string;
}

export type AssociationAdminUpdate = {
  user?: string;
  name?: string;
  cnpj?: string;
  logo_url?: string;
};

const getAssociation = async (
  { body, token, id }: Props,
  _req: Request,
): Promise<unknown> => {
  try {
    const response = await fetch(
      `https://api.ecanna.com.br/associations/admin/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
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
