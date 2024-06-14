interface CVVInputProps {
  value: string;
  onChange: (value: string) => void;
}

const maskCVV = (value: string) => {
  return value.replace(/\D/g, "").slice(0, 4);
};

const CVVInput = ({ value, onChange }: CVVInputProps) => {
  return (
    <label class="w-full sm:w-[48%] flex flex-col">
      <div class="label pb-1">
        <span class="label-text text-xs text-[#585858]">
          Código Verificador
        </span>
      </div>
      <input
        class="input rounded-md text-[#8b8b8b] border-none w-full"
        placeholder="Código Verificador"
        maxLength={4}
        value={value}
        onChange={(e) => onChange(maskCVV(e.currentTarget.value))}
      />
    </label>
  );
};

export default CVVInput;
