import CheckoutForm from "../../islands/CheckoutForm.tsx";
import FormWrap from "./FormWrap.tsx";

export type Plan = {
  _id: string;
  name: string;
  price: number;
  description: string;
  skus: string[];
  period: string;
  status: string;
  created_at: string;
  updated_at: string;
};

function Checkout() {
  return (
    <FormWrap large={true}>
      <CheckoutForm />
    </FormWrap>
  );
}

export default Checkout;
