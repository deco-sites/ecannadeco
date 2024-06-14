interface ExpDateInputProps {
  value: string;
  onChange: (value: string) => void;
}

const maskExpDate = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d{1,2})/, "$1/$2")
    .slice(0, 5);
};

const ExpDateInput = ({ value, onChange }: ExpDateInputProps) => {
  return (
    <label class="w-full sm:w-[48%] flex flex-col">
      <div class="label pb-1">
        <span class="label-text text-xs text-[#585858]">
          Validade do Cartão (MM/AA)
        </span>
      </div>
      <input
        class="input rounded-md text-[#8b8b8b] border-none w-full"
        placeholder="MM/AA"
        value={value}
        onChange={(e) => onChange(maskExpDate(e.currentTarget.value))}
      />
    </label>
  );
};

export default ExpDateInput;
