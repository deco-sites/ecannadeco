import { Treatment } from "deco-sites/ecannadeco/components/ui/PrescriberPatientsLive.tsx";
import { API_URL } from "deco-sites/ecannadeco/sdk/constants.ts";

export interface Props {
  companyName: string;
  companyPerson: string;
  whatsapp: string;
  benefitDescription: string;
  productDescription: string;
}

const prescriberCreateTreatment = async (
  {
    companyName,
    companyPerson,
    whatsapp,
    benefitDescription,
    productDescription,
  }: Props,
  _req: Request,
): Promise<unknown | null> => {
  try {
    const response = await fetch(
      `${API_URL}/automations/interested-partner`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          companyPerson,
          whatsapp,
          benefitDescription,
          productDescription,
        }),
      },
    );
    const res = await response.json();
    return res;
  } catch (e) {
    return e;
  }
};

export default prescriberCreateTreatment;
