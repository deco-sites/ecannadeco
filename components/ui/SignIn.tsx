import SignInForm from "deco-sites/ecannadeco/islands/SignInForm.tsx";

export interface Props {
  textSection: {
    title: string;
    /** @format html */
    text: string;
  };
  formTitle: string;
}

function SignIn(
  { textSection, formTitle }: Props,
) {
  return (
    <div
      id="SignIn"
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
        <SignInForm />
      </div>
    </div>
  );
}

export default SignIn;
