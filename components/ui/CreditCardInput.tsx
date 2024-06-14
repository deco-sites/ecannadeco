interface CreditCardInputProps {
  value: string;
  onChange: (value: string) => void;
}

const maskCardNumber = (value: string) => {
  return value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
};

const CreditCardInput = ({ value, onChange }: CreditCardInputProps) => {
  return (
    <label class="w-full sm:w-[48%] flex flex-col">
      <div class="label pb-1">
        <span class="label-text text-xs text-[#585858]">Número do Cartão</span>
      </div>
      <input
        class="input rounded-md text-[#8b8b8b] border-none w-full"
        placeholder="0000 0000 0000 0000"
        maxLength={19}
        value={value}
        onChange={(e) => onChange(maskCardNumber(e.currentTarget.value))}
      />
    </label>
  );
};

export default CreditCardInput;
