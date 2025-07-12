"use client"

import { Suspense } from "react";
import { BarLoader } from "react-spinners";


export default function Layout({ children }) {
    return (
        <div>
            <Suspense
                fallback={<BarLoader className="text-center mt-10" width={"100%"} color="#6899d3" />}>
                    {children}
            </Suspense>
        </div>
    );
}