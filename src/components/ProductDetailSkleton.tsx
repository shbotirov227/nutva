"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {

  const commonClass = "rounded-xl bg-gray-200 border border-gray-300 shadow-[10px_10px_10px_rgba(0,0,0,0.1),_10px_10px_10px_rgba(0,0,0,0.1)]"

  return (
    <div className="pt-32 pb-10">
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="flex">
              <Skeleton className={`w-[600px] h-[300px] rounded-xl ${commonClass}`} />
            </div>
            <div className="flex flex-col gap-4">
              <Skeleton className={`h-10 w-1/2 ${commonClass}`} />
              <Skeleton className={`h-6 w-full ${commonClass}`} />
              <Skeleton className={`h-6 w-3/4 ${commonClass}`} />
              <Skeleton className={`h-6 w-1/2 ${commonClass}`} />
              <Skeleton className={`h-[60px] w-1/3 mt-4 ${commonClass}`} />
            </div>
          </div>

          <div className="flex gap-4 my-10">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className={`w-40 h-12 rounded-md ${commonClass}`} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
            <div className="flex flex-col gap-4">
              <Skeleton className={`h-6 w-full ${commonClass}`} />
              <Skeleton className={`h-6 w-5/6 ${commonClass}`} />
              <Skeleton className={`h-6 w-4/6 ${commonClass}`} />
              <Skeleton className={`h-6 w-3/4 ${commonClass}`} />
              <Skeleton className={`h-6 w-full ${commonClass}`} />
              <Skeleton className={`h-6 w-2/3 ${commonClass}`} />
            </div>
            <div className="flex justify-center">
              <Skeleton className={`w-[400px] h-[200px] rounded-xl ${commonClass}`} />
            </div>
          </div>

          <div className="my-12 space-y-6">
            <Skeleton className={`w-full h-20 rounded-xl ${commonClass}`} />
            <Skeleton className={`w-full h-20 rounded-xl ${commonClass}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
