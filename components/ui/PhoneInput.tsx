interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const maskPhone = (value: string) =>
  value
    .replace(/\D/g, "") // Remove qualquer caractere que não seja dígito
    .replace(/^(\d{2})(\d)/, "($1) $2") // Adiciona parênteses ao redor dos primeiros 2 dígitos
    .replace(/(\d{5})(\d)/, "$1-$2"); // Adiciona um hífen após os 5 primeiros dígitos restantes

const PhoneInput = ({ value, onChange, label = "Telefone" }: Props) => {
  return (
    <label class="w-full flex flex-col">
      <div class="label pb-1">
        <span class="label-text text-xs text-[#585858]">{label}</span>
      </div>
      <input
        class="input input-sm rounded-md text-[#8b8b8b] border-none w-full"
        placeholder="(61) 99812-1416"
        type="tel"
        maxLength={15}
        value={value}
        onChange={(e) => onChange(maskPhone(e.currentTarget.value))}
      />
    </label>
  );
};

export default PhoneInput;
