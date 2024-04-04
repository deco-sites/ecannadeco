const StepTimeline = ({ step }: { step: number }) => {
  return (
    <div class="flex items-center justify-between mb-4">
      <div class="h-6 w-6 rounded-full bg-primary text-white flex justify-center items-center">
        <span class="text-sm font-semibold">1</span>
      </div>
      <hr class="bg-primary h-1 w-[82%]" />
      <div
        class={`h-6 w-6 rounded-full ${
          step == 2 ? "bg-primary text-white" : "bg-white text-[#8b8b8b]"
        } flex justify-center items-center`}
      >
        <span class="text-sm font-semibold">2</span>
      </div>
    </div>
    // <ul class="timeline">
    //   <li class="w-[50%]">
    //     <div class="timeline-middle">
    //       <div class="h-5 w-5 rounded-full bg-primary flex justify-center items-center">
    //         <span class="text-white text-xs font-semibold">1</span>
    //       </div>
    //     </div>
    //     <hr class="bg-primary" />
    //   </li>
    //   <li class="w-[50%]">
    //     <hr class="bg-primary" />
    //     <div class="timeline-middle">
    //       <div class="h-5 w-5 rounded-full bg-primary flex justify-center items-center">
    //         <span class="text-white text-xs font-semibold">1</span>
    //       </div>
    //     </div>
    //     <div class="timeline-end w-0"></div>
    //   </li>
    // </ul>
  );
};

export default StepTimeline;
