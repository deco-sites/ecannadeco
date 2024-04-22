import SignInFormAdmin from "deco-sites/ecannadeco/islands/SignInFormAdmin.tsx";
import FormWrap from "../../components/ui/FormWrap.tsx";

export interface Props {
  formTitle: string;
}

function SignIn(
  { formTitle }: Props,
) {
  return (
    <FormWrap>
      <SignInFormAdmin formTitle={formTitle} />
    </FormWrap>
  );
}

export default SignIn;
