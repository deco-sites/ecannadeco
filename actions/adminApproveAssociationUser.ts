import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

export interface Props {
  token: string;
  id: string;
}

const adminApproveAssociationUser = async (
  { token, id }: Props,
  _req: Request,
) => {
  try {
    const url = `${API_URL}/admin/approve-association-user`;

    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify({ associationUser: id }),
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

export default adminApproveAssociationUser;
