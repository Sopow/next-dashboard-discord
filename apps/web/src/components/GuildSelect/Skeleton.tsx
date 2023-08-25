import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import React from "react";

const GuildSkeleton = () => (
  <SkeletonTheme baseColor="#231f31" highlightColor="#16131d">
    <div
      className="h-fit rounded-t-3xl"
      style={{
        background:
          "linear-gradient(0deg, hsla(251, 30%, 7%, 1) 0%, hsla(252, 17%, 17%, 1) 100%)",
      }}
    >
      <div className="w-full overflow-clip rounded-t-3xl shadow transition-all duration-200">
        <div className="relative flex h-40 items-center justify-center overflow-hidden">
          <div className={`absolute h-full w-full bg-gray-800 blur-md`}>
            <Skeleton width={"100%"} height={"100%"} />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-around gap-2 py-4">
        <div className="flex flex-col items-start justify-center">
          <Skeleton width={100} />
          <Skeleton width={50} />
        </div>
        <Skeleton width={100} height={40} />
      </div>
    </div>
  </SkeletonTheme>
);

export default GuildSkeleton;