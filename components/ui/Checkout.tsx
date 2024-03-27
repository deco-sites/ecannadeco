import CheckoutForm from "../../islands/CheckoutForm.tsx";

export interface Props {
  textSection: {
    title: string;
    /** @format html */
    text: string;
  };
  formTitle: string;
}

function Checkout<T>(
  { textSection, formTitle, plans }: LoaderProps<T>,
) {
  return (
    <div
      id="Checkout"
      class="container grid-cols-1 md:grid-cols-2 flex flex-col a md:flex-row my-24"
    >
      <div class="justify-center col-span-1 w-full md:w-[50%] flex md:justify-end">
        <div class="max-w-[480px] flex flex-col gap-4">
          <span class="font-semibold">{textSection.title}</span>
          <div
            class="text-sm text-left"
            dangerouslySetInnerHTML={{ __html: textSection.text || "" }}
          />
        </div>
      </div>
      <div class="flex w-full md:w-[50%] justify-center md:flex md:justify-start md:px-24 mt-8 md:mt-0">
        {plans.map((plan: Plan) => (
          <div class="flex flex-col gap-4">
            <span class="font-semibold">{plan.name}</span>
            <span class="text-sm text-left">{plan.description}</span>
            <span class="text-sm text-left">{plan.price}</span>
          </div>
        ))}
        <CheckoutForm plans={plans} />
      </div>
    </div>
  );
}

interface LoaderProps<T> {
  textSection: {
    title: string;
    /** @format html */
    text: string;
  };
  formTitle: string;
  plans: Plan[];
}

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

export const loader = async (props: Props, req: Request) => {
  const params = await fetch(
    `http://localhost:3000/v1/products/subscriptions`,
  ).then(async (r) => {
    const c = await r.json();
    return {
      ...props,
      plans: c.docs as Plan[],
    };
  });
  return params;
};

export default Checkout;
