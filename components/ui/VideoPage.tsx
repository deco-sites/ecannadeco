import PageWrap from "../../components/ui/PageWrap.tsx";

export interface Props {
  title: string;
  subtitle?: string;
  videoURL: string;
}

function VideoPage({ title, subtitle, videoURL }: Props) {
  return (
    <PageWrap>
      <div class="flex flex-col justify-between gap-10 ">
        <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
          {title}
        </h3>
        {subtitle && <span class="text-sm">{subtitle}</span>}
        <div class="w-full flex justify-center mb-4">
          <iframe
            class="w-full"
            src={videoURL}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            height="315"
            width="560"
            allowFullScreen
          />
        </div>
      </div>
    </PageWrap>
  );
}

export default VideoPage;
