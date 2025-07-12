"use client";


import ProductCard from "@/components/card"
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";

const DiscountProducts = ({initialData}) => {

  console.log(initialData)

     // No saved cars
  if (!initialData?.data || initialData?.data.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Heart className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">No Wishlisted Products</h3>
        <p className="text-gray-500 mb-6 max-w-md">
          You haven't Wishlisted any Products yet. Browse our listings and click the
          heart icon to save Products for later.
        </p>
        <Button variant="default" asChild>
          <Link href="/shop">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
      {initialData?.data?.map((product) => (
        <ProductCard key={product.id} product={{ ...product}} />
      ))}
    </div>
  )
}
export default DiscountProducts