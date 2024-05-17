import { asset } from "$fresh/runtime.ts";
import type { JSX } from "preact";

export type AvailableIcons =
  | "ArrowsPointingOut"
  | "Anexo"
  | "Bars3"
  | "Calendar"
  | "Check"
  | "ChevronLeft"
  | "ChevronRight"
  | "ChevronUp"
  | "ChevronDown"
  | "CreditCard"
  | "Close"
  | "Deco"
  | "Diners"
  | "Discord"
  | "Discount"
  | "Dizziness"
  | "Download"
  | "Elo"
  | "Ecanna"
  | "Edit"
  | "Facebook"
  | "FilterList"
  | "Focus"
  | "Heart"
  | "Hungry"
  | "Headache"
  | "Instagram"
  | "Info"
  | "QRicon"
  | "CircleCheck"
  | "Linkedin"
  | "Minus"
  | "MapPin"
  | "MagnifyingGlass"
  | "Mastercard"
  | "Message"
  | "MedCanna"
  | "Nausea"
  | "Phone"
  | "Profile"
  | "Pix"
  | "Plus"
  | "QuestionMarkCircle"
  | "Return"
  | "Ruler"
  | "ShoppingCart"
  | "Secure"
  | "Star"
  | "Sleep"
  | "Tiktok"
  | "Drop"
  | "Trash"
  | "Truck"
  | "Twitter"
  | "Upload"
  | "User"
  | "Update"
  | "Visa"
  | "WhatsApp"
  | "XMark"
  | "Zoom"
  | "Alert"
  | "AlertInfo"
  | "AlertSuccess"
  | "AlertWarning"
  | "AlertError"
  | "UserData"
  | "HappyFace"
  | "SadFace"
  | "share";

interface Props extends JSX.SVGAttributes<SVGSVGElement> {
  /**
   * Symbol id from element to render. Take a look at `/static/icons.svg`.
   *
   * Example: <Icon id="Bell" />
   */
  id: AvailableIcons;
  size?: number;
}

function Icon(
  { id, strokeWidth = 16, size, width, height, ...otherProps }: Props,
) {
  return (
    <svg
      {...otherProps}
      width={width ?? size}
      height={height ?? size}
      strokeWidth={strokeWidth}
    >
      <use href={asset(`/sprites.svg#${id}`)} />
    </svg>
  );
}

export default Icon;
