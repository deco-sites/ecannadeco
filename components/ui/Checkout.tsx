import { Sku } from "deco-sites/ecannadeco/actions/adminGetOrders.ts";
import CheckoutForm from "../../islands/CheckoutForm.tsx";
import FormWrap from "./FormWrap.tsx";

export type Plan = {
  _id: string;
  name: string;
  plan?: string;
  price: number;
  description: string;
  plan_description: [string];
  skus: string[];
  period: string;
  status: string;
  created_at: string;
  updated_at: string;
  startBilling?: number;
};

function Checkout() {
  return (
    <FormWrap large={true}>
      <CheckoutForm />
    </FormWrap>
  );
}

export default Checkout;
