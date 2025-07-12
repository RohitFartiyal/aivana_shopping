"use client"

import { Suspense } from "react";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";


export default function Layout({ children }) {
    return (
        <div>
            <Suspense
                fallback={
                    <div className="flex gap-6 mx-10 lg:mt-30 mt-38">
                        {/* Sidebar skeleton */}
                        <aside className="w-64 space-y-6 hidden md:block">
                            <div className="space-y-4">
                                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                                ))}
                            </div>
                            <div className="space-y-4">
                                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                                ))}
                            </div>
                            <div className="h-10 bg-gray-200 rounded animate-pulse w-full mt-4" />
                        </aside>

                        {/* Product grid skeleton */}
                        <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Card key={i} className="space-y-2">
                                    <div className="w-full aspect-square bg-gray-200 rounded-md animate-pulse" />
                                    <CardContent className="space-y-2 p-2">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                                        <div className="flex space-x-2">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-10" />
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-6" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </main>
                    </div>
                }>
                {children}
            </Suspense>
        </div>
    );
}