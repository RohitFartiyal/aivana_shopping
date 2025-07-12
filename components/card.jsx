"use client"

import {
  Card,
  CardContent
} from "@/components/ui/card"
import { featuredCars } from "@/lib/data";
import { Button } from "./ui/button";
import Image from "next/image";
import { Heart, Loader2, ShoppingBag, ShoppingBasket, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toggleSavedproduct } from "@/actions/product-listting";
import { useAuth } from "@clerk/nextjs";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";


const ProductCard = (product) => {

  const { isSignedIn } = useAuth();
  const [isSaved, setIsSaved] = useState(product.product?.wishlisted)
  const router = useRouter();

  // Use the useFetch hook
  const {
    loading: isToggling,
    fn: toggleSavedProductFn,
    data: toggleResult,
    error: toggleError,
  } = useFetch(toggleSavedproduct);

  // Handle toggle result with useEffect
  useEffect(() => {
    if (toggleResult?.success && toggleResult.saved !== isSaved) {
      setIsSaved(toggleResult.saved);
      toast.success(toggleResult.message);
    }
  }, [toggleResult, isSaved]);

   // Handle save/unsave Product
  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      toast.error("Please sign in to save cars");
      // router.push("/sign-in");
      return;
    }

    if (isToggling) return;

    // Call the toggleSavedCar function using our useFetch hook
    await toggleSavedProductFn(product.product.id);
  };



  return (
    <div>
      <Card className="overflow-hidden hover:shadow-lg transition group">
        <div className="relative h-65">
          {product.product?.colors[0].images[0] && product.product?.colors[0].images.length > 0 ? (
            <div className="relative w-full h-full">
              <Image
                src={product.product?.colors[0].images[0]}
                alt={`hh`}
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <ShoppingBag className="h-15 w-15 text-gray-400" />
            </div>
          )}



          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 bg-white/90 rounded-full p-1.5 ${isSaved && isSignedIn
              ? "text-red-500 hover:text-red-600"
              : "text-gray-600 hover:text-gray-900"
              }`}
            onClick={handleToggleSave}
            disabled={isToggling}
          >
            {isToggling ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart className={isSaved && isSignedIn ? "fill-current" : ""} size={20} />
            )}
          </Button>
        </div>

        <CardContent className="px-5 pt-2">
          <div className="flex flex-col mb-2">


            {/* name */}
            <div className="mb-2 flex items-center justify-between mr-5">
              <h3 className="text-md font-bold  line-clamp-1">
                {product.product?.name}
              </h3>
            </div>

            {/* star */}
            <div className="mb-2 flex">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 transition-colors ${i < product.product?.ratting ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-400"
                    }`}
                />
              ))}
              <span className="ml-5 text-gray-600 text-xs">{product.product?.ratting.toFixed(1) == 5.0 ? 5 : product.product?.ratting.toFixed(1)} / 5</span>
            </div>


            {/* price */}
            <div className="flex gap-5 mb-4">
              <div className="text-lg font-bold flex gap-2">
                <span className="text-gray-800">{product.product?.discount !==0 && `₹${Math.round(product.product?.price * (1 - product.product?.discount / 100)).toLocaleString('en-IN')}`}</span>
                <span>{product.product?.discount !==0 ? <span className="line-through text-gray-500">₹{Math.round(product.product?.price).toLocaleString('en-IN')}</span> : <span>₹{Math.round(product.product?.price).toLocaleString('en-IN')}</span>}</span>
              </div>
              {product.product?.discount !==0 && <span className="bg-red-300 py-1 px-4 rounded-2xl font-bold text-sm text-red-700">-{product.product?.discount}%</span>}
            </div>

          </div>

          <div className="flex justify-between">
            <Button
              className="flex-1"
              onClick={() => {
                router.push(`/shop/${product.product.id}`);
              }}
            >
              View Product
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default ProductCard