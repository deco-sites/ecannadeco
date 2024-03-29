import SignInForm from "deco-sites/ecannadeco/islands/SignInForm.tsx";
import FormWrap from "../../components/ui/FormWrap.tsx";

export interface Props {
  formTitle: string;
}

function SignIn(
  { formTitle }: Props,
) {
  return (
    <FormWrap>
      <SignInForm formTitle={formTitle} />
    </FormWrap>
  );
}

export default SignIn;
