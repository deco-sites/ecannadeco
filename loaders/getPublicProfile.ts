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
}

const getPublicProfile = async (
  { slug }: Props,
  _req: Request,
): Promise<PublicProfile> => {
  try {
    const response = await fetch(
      "http://http://production.eba-93ecmjzh.us-east-1.elasticbeanstalk.com//auth/public/" +
        slug,
    );

    const res = await response.json();
    return res;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default getPublicProfile;
