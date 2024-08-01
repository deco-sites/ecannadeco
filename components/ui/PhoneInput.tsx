import { useEffect, useState } from "preact/hooks";

export interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const maskPhone = (value: string) => {
  const cleanedValue = value.replace(/\D/g, ""); // Remove qualquer caractere que não seja dígito

  if (cleanedValue.length <= 10) {
    // Formata como (XX) XXXX-XXXX para números de 10 dígitos
    return cleanedValue
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    // Formata como (XX) XXXXX-XXXX para números de 11 dígitos
    return cleanedValue
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }
};

const PhoneInput = ({ value, onChange, label = "Telefone" }: Props) => {
  const [countryCode, setCountryCode] = useState("+55");
  const [phoneNumber, setPhoneNumber] = useState(value);

  useEffect(() => {
    if (countryCode && phoneNumber) {
      onChange(`${countryCode} ${phoneNumber}`);
    }
  }, [countryCode, phoneNumber]);
  return (
    <label class="w-full flex flex-col">
      <div class="label pb-1">
        <span class="label-text text-xs text-[#585858]">{label}</span>
      </div>
      <div class="flex gap-2">
        <input
          class="input input-sm rounded-md text-[#8b8b8b] border-none w-20"
          placeholder="+55"
          type="tel"
          maxLength={4}
          value={countryCode}
          onChange={(e) => setCountryCode(e.currentTarget.value)}
        />
        <input
          class="input input-sm rounded-md text-[#8b8b8b] border-none w-full"
          placeholder="(XX) XXXXX-XXXX"
          type="tel"
          maxLength={15}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(maskPhone(e.currentTarget.value))}
        />
      </div>
    </label>
  );
};

export default PhoneInput;
