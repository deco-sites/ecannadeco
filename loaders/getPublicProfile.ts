import type { RequestURLParam } from "apps/website/functions/requestToParam.ts";
import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

export interface Props {
  slug: RequestURLParam;
  pin: RequestURLParam;
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
  associationApproved?: boolean;
}

const getPublicProfile = async (
  { slug, pin }: Props,
  _req: Request,
): Promise<PublicProfile> => {
  try {
    const response = await fetch(
      `${API_URL}/auth/public/${slug}?pin=${pin}`,
    );

    const res = await response.json();
    if (!res._id) {
      res._id = slug;
    }
    return res;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default getPublicProfile;
