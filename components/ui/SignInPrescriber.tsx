import SignInFormPrescriber from "deco-sites/ecannadeco/islands/SignInFormPrescriber.tsx";
import FormWrap from "./FormWrap.tsx";

export interface Props {
  formTitle: string;
}

function SignIn(
  { formTitle }: Props,
) {
  return (
    <FormWrap>
      <SignInFormPrescriber formTitle={formTitle} />
    </FormWrap>
  );
}

export default SignIn;
