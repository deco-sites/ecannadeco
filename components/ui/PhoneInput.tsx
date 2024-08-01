interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const maskPhone = (value: string) => {
  // Remove espaços, caracteres especiais e o sinal de "+"
  const cleanedValue = value.replace(/\D/g, "");

  // Verifica se o número tem o código de país +55
  if (cleanedValue.startsWith("55")) {
    const phoneNumber = cleanedValue.slice(2); // Remove o código do país (+55)

    // Verifica o tamanho do número restante
    if (phoneNumber.length === 10) {
      // Formato (XX) XXXX-XXXX para números com 10 dígitos
      return `+55 (${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 6)}-${
        phoneNumber.slice(6)
      }`;
    } else if (phoneNumber.length === 11) {
      // Formato (XX) XXXXX-XXXX para números com 11 dígitos
      return `+55 (${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${
        phoneNumber.slice(7)
      }`;
    }
  }

  // Caso contrário, formata como padrão internacional
  return `+${cleanedValue}`;
};

const PhoneInput = ({ value, onChange, label = "Telefone" }: Props) => {
  return (
    <label class="w-full flex flex-col">
      <div class="label pb-1">
        <span class="label-text text-xs text-[#585858]">{label}</span>
      </div>
      <input
        class="input input-sm rounded-md text-[#8b8b8b] border-none w-full"
        placeholder="+55 (XX) XXXXX-XXXX"
        type="tel"
        maxLength={19}
        value={value}
        onChange={(e) => onChange(maskPhone(e.currentTarget.value))}
      />
    </label>
  );
};

export default PhoneInput;
