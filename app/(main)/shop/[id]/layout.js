"use client"


import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";


export default function Layout({ children }) {


  return (
    <div className="pt-25">
      <Suspense
        fallback={
          <div className="mt-2 mx-4 animate-pulse">
            {/* Mobile layout */}
            <div className="flex flex-col gap-4 sm:hidden">
              <Skeleton className="h-[300px] w-full rounded-md" /> {/* Big product image */}
              <Skeleton className="h-6 w-3/4" /> {/* Title */}
              <Skeleton className="h-4 w-24" /> {/* Rating */}
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" /> {/* Price */}
                <Skeleton className="h-6 w-16" /> {/* Original price */}
                <Skeleton className="h-6 w-10 rounded-xl" /> {/* Discount */}
              </div>
              <Skeleton className="h-16 w-full" /> {/* Description */}
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded-full" />
                ))}
              </div>
              <Skeleton className="h-10 w-full rounded-md" /> {/* Add to cart */}
            </div>

            {/* Desktop / tablet layout */}
            <div className="hidden sm:block">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Image Gallery */}
                <div className="w-full h-[500px] lg:w-6/12 flex gap-6">
                  <div className="w-[15%] space-y-3 overflow-hidden">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="aspect-[6/5] h-[80px] rounded-md" />
                    ))}
                  </div>
                  <div className="w-8/10 h-full">
                    <Skeleton className="aspect-[10/9] h-full w-full rounded-md" />
                  </div>
                </div>

                {/* Product Details */}
                <div className="w-full lg:w-6/12 space-y-5">
                  <Skeleton className="h-8 w-3/4" /> {/* Title */}
                  <Skeleton className="h-4 w-32" /> {/* Stars / rating */}
                  <div className="flex gap-4">
                    <Skeleton className="h-6 w-24" /> {/* Discounted price */}
                    <Skeleton className="h-6 w-16" /> {/* Original price */}
                    <Skeleton className="h-6 w-12 rounded-xl" /> {/* Discount tag */}
                  </div>
                  <Skeleton className="h-20 w-full" /> {/* Description */}
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <div className="flex gap-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="w-8 h-8 rounded-full" />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <div className="flex gap-2 flex-wrap">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-16 rounded-md" />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-5">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-10 w-10 rounded-md" />
                    </div>
                    <Skeleton className="w-full h-10 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

      >

        <div>{children}</div>
      </Suspense>
    </div>
  );
}