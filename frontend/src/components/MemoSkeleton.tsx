type Props = {
  bubbleMode: "start" | "end";
};
export const MemoSkeleton = ({ bubbleMode }: Props) => {
  const mode = {
    start: "items-start",
    end: "items-end",
  };

  return (
    <>
      <div className={`w-full flex flex-col ${mode[bubbleMode]}`}>
        <div className="flex gap-x-2 items-center">
          {bubbleMode == "start" && (
            <div className="skeleton w-[40px] h-[40px] mt-7 rounded-full"></div>
          )}
          <div className={`flex flex-col ${mode[bubbleMode]} gap-y-1`}>
            <div className="skeleton w-20 h-4"></div>
            <div className="skeleton w-64 h-16"></div>
            <div className="skeleton w-28 h-4"></div>
          </div>
          {bubbleMode == "end" && (
            <div className="skeleton w-[40px] h-[40px] mt-7 rounded-full"></div>
          )}
        </div>
      </div>
    </>
  );
};
