import { ComponentChildren } from "preact";
import Icon from "../../components/ui/Icon.tsx";

interface Props {
  children?: ComponentChildren;
  large?: boolean;
}

function FormWrap(props: Props) {
  const {
    children,
    large,
  } = props;

  return (
    <div class="container grid-cols-1 md:grid-cols-2 flex flex-col a md:flex-row my-8">
      <div class="flex w-full justify-center md:flex md:px-24 mt-8 md:mt-0">
        <div
          class={` ${
            !large && "max-w-[370px]"
          } py-10 px-14 bg-[#ededed] rounded-xl relative w-full`}
        >
          <div class="absolute top-[-43px] left-1/2 transform -translate-x-1/2">
            <div class="relative bg-white rounded-full h-[73px] w-[73px] shadow-md">
              <div class="absolute text-secondary left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
                <Icon id="Ecanna" width={49} height={35} />
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default FormWrap;
