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
      <div class="rounded-xl bg-[#eeeeee] shadow-md px-2 py-4 sm:p-14 w-[95%] sm:max-w-[960px]">
        <div class="flex flex-col items-center">
          {children}
        </div>
      </div>
    </div>
  );
}

export default PageWrap;
