"use client"

import { Suspense } from "react";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


export default function Layout({ children }) {
    return (
        <div>
            <Suspense
                fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="border rounded-xl p-4 shadow-sm bg-white space-y-4"
                            >
                                <Skeleton className="h-48 w-full rounded-lg" /> {/* Image / header */}
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-3/4" /> {/* Title */}
                                    <Skeleton className="h-4 w-1/2" /> {/* Sub info */}
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <Skeleton className="h-8 w-20 rounded" /> {/* Button */}
                                    <Skeleton className="h-8 w-20 rounded" /> {/* Button */}
                                </div>
                            </div>
                        ))}
                    </div>
                }>
                {children}
            </Suspense>
        </div>
    );
}