import FormWrap from "../../components/ui/FormWrap.tsx";

function RootNavigationTree() {
  return (
    <FormWrap>
      <div class="flex flex-col gap-4">
        <span class="text-2xl text-[#8b8b8b] font-semibold text-center my-4">
          Você é
        </span>
        <a href="/entrar" class="btn btn-primary w-full">
          Paciente
        </a>
        <a href="/prescritor/entrar" class="btn btn-primary w-full">
          Prescritor
        </a>
      </div>
    </FormWrap>
  );
}

export default RootNavigationTree;
