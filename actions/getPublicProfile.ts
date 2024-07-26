import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

export interface Props {
  id: string;
  pin: string;
}

export interface Cid {
  _id: string;
  full_code: string;
  name: string;
}

export interface Document {
  title: string;
  file_url: string;
  category: string;
}

export interface Association {
  name: string;
  cnpj: string;
}

export interface PublicProfile {
  _id: string;
  cpf: string;
  email: string;
  avatar_photo: string;
  name: string;
  cids: Cid[];
  association: Association;
  plan: string;
  documents: Document[];
  associationDocuments: Document[];
  pin: string;
}

const getPublicProfile = async (
  { id, pin }: Props,
  _req: Request,
): Promise<PublicProfile> => {
  try {
    const response = await fetch(
      `${API_URL}/auth/public/` + id + "?pin=" + pin,
    );

    const res = await response.json();
    console.log({ responsePublicProfile: res });
    return res;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default getPublicProfile;
