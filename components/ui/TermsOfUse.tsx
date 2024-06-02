interface Props {
  title: string;
  /**@format html*/
  text: string;
}

function TermsOfUse(props: Props) {
  const {
    title,
    text,
  } = props;

  return (
    <div class="w-full flex justify-center">
      <div class="w-[90%] max-w-[800px] px-4 py-8 flex flex-col gap-4 items-center justify-center">
        <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center mb-10">
          {title}
        </h3>
        <div>
          <div dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      </div>
    </div>
  );
}

export default TermsOfUse;
