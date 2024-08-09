import { asset } from "$fresh/runtime.ts";
import type { JSX } from "preact";

export type AvailableIcons =
  | "ArrowsPointingOut"
  | "Attachment"
  | "Anexo"
  | "Bars3"
  | "Calendar"
  | "Celebration"
  | "Check"
  | "Chart"
  | "ChevronLeft"
  | "ChevronRight"
  | "ChevronUp"
  | "ChevronDown"
  | "CreditCard"
  | "CardID"
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
  | "Folder"
  | "Form"
  | "GoBack"
  | "Heart"
  | "HeartBeat"
  | "Hungry"
  | "Headache"
  | "Help"
  | "Hourglass"
  | "Instagram"
  | "Info"
  | "QRicon"
  | "CircleCheck"
  | "Law"
  | "Linkedin"
  | "LoyaltyClub"
  | "Minus"
  | "MapPin"
  | "MagnifyingGlass"
  | "Mastercard"
  | "Monitor"
  | "Message"
  | "MedCanna"
  | "Medical"
  | "Nausea"
  | "Phone"
  | "Profile"
  | "Pix"
  | "Plus"
  | "Pending"
  | "QuestionMarkCircle"
  | "QRCode"
  | "Return"
  | "Ruler"
  | "ShoppingCart"
  | "Shipping"
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

function Icon({
  id,
  strokeWidth = 16,
  size,
  width,
  height,
  ...otherProps
}: Props) {
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
