import type { RequestURLParam } from "apps/website/functions/requestToParam.ts";

export interface Props {
  slug: RequestURLParam;
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
}

export interface PublicProfile {
  cpf: string;
  avatar_photo: string;
  name: string;
  cids: Cid[];
  association: Association;
  plan: string;
  documents: Document[];
}

const getPublicProfile = async (
  { slug }: Props,
  _req: Request,
): Promise<PublicProfile> => {
  try {
    const response = await fetch("http://localhost:3000/auth/public/" + slug);

    const res = await response.json();
    return res;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default getPublicProfile;
