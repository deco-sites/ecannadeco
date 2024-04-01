import { ComponentChildren } from "preact";

interface Props {
  children?: ComponentChildren;
}

function PageWrap(props: Props) {
  const {
    children,
  } = props;

  return (
    <div class="flex justify-center">
      <div class="rounded-xl bg-[#ededed] shadow-md px-2 py-4 sm:p-14 w-[90%] sm:max-w-[800px]">
        <div class="flex flex-col items-center">
          {children}
        </div>
      </div>
    </div>
  );
}

export default PageWrap;
