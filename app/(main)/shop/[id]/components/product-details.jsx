"use client";

import { Button } from "@/components/ui/button";
import { Calendar, CarFrontIcon, Check, Loader2, MessageCircle, MessageCircleOff, Minus, Plus, ShoppingBag, SlidersVerticalIcon, Star, TrendingUp } from "lucide-react"
import Image from "next/image"
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import PostReview from "./postReview";
import useFetch from "@/hooks/use-fetch";
import { allReview } from "@/actions/review";
import { addToCart } from "@/actions/cart";
import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { Separator } from "@/components/ui/separator";
import { updateProductRatting } from "@/actions/product";
import { useAuth } from "@clerk/nextjs";


const Productdetails = ({ product }) => {

    const { isSignedIn } = useAuth()

    console.log(isSignedIn)

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentColorIndex, setCurrentColorIndex] = useState(0);
    const [size, setSize] = useState("")
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("review");

    const increment = () => {
        if (quantity < 10) setQuantity(prev => prev + 1)
        if (quantity >= 10) toast.warning("Maximum value reached")
    }
    const decrement = () => {
        if (quantity > 1) setQuantity(prev => prev - 1)
        if (quantity <= 1) toast.warning("Minimum value reached")
    }

    const { loading: cartLoading, fn: fetchCart, data: cartData } = useFetch(addToCart)
    const { loading, fn: fetchReviews, data: reviewData } = useFetch(allReview)
    const { loading: productUpdating, fn: updateProduct, data: productData } = useFetch(updateProductRatting)
    useEffect(() => {
        if (product?.id) {
            fetchReviews(product.id);
        }
    }, [product?.id]);


    // add to cart submit
    const cart = async () => {
        if (isSignedIn == false) {
            toast.warning("Please Login")
            return
        }
        if (size == "") {
            toast.warning("Select any size")
            return
        }

        const data = {
            size: size,
            color: product?.colors[currentColorIndex].color,
            quantity: quantity,
            image: product?.colors[currentColorIndex].images[0],
            productId: product?.id
        }
        await fetchCart(data)


    }

    const pathname = usePathname();

    const pathSegments = pathname.split('/').filter((segment) => segment)

    const pathArray = pathSegments.map((segment, i) => {
        const href = '/' + pathSegments.slice(0, i + 1).join('/')
        return {
            name: decodeURIComponent(segment),
            href,
        }
    })



    const allSizes = ["XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "3X-Large", "4X-Large",];

    const total = reviewData?.data.reduce((sum, item) => sum + item.ratting, 0);
    const average = total / reviewData?.data.length;
    // console.log(cartData)
    useEffect(() => {
        if (cartData?.success) {
            toast.success("Item Added");
        } else if (cartData?.success === false) {
            toast.warning("Item Already Added");
        }
    }, [cartData]);


    return (
        <div>

            <div className="flex mb-5">
                <Breadcrumb>
                    <BreadcrumbList>
                        {/* Static Home Item */}
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        {/* Dynamic Path Segments */}
                        {pathArray.map((item, index) => {
                            const isLast = index === pathArray.length - 1

                            return (
                                <React.Fragment key={index}>
                                    <BreadcrumbSeparator />

                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage className="uppercase sm:max-w-full max-w-[215px]  truncate inline-block">{product?.name}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link href={item.href}>{item.name}</Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </React.Fragment>
                            )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">

                {/* Image Gallery */}
                <div className="w-full md:h-[500px] sm:h-[400px] h-[500px] xl:w-6/12 lg:w-8/12  lg:gap-10 md:gap-10 sm:gap-10 flex sm:flex-row flex-col-reverse ">
                    <div className="lg:w-[15%] md:w-[10%] sm:w-[15%] w-full sm:mt-0 mt-5 sm:overflow-y-auto overflow-x-auto scrollbar-hide">
                        <div className="sm:max-h-[500px] h-full  w-full text-center flex sm:flex-col sm:gap-0 flex-row gap-2 ">
                            {product?.colors[currentColorIndex].images.map((image, idx) => (
                                <div className={`relative 2xl:aspect-6/5 xl:aspect-auto sm:w-[100%] w-18 sm:h-[75px] h-[60px] mb-3 flex-shrink-0 cursor-pointer transition duration-200 ${idx === currentImageIndex
                                    ? "border-2 border-gray-400"
                                    : "opacity-70 hover:opacity-100"
                                    }
                                    `} key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                >
                                    <Image
                                        key={idx}
                                        src={image}
                                        fill
                                        alt="jj"
                                        priority
                                        className="object-cover"

                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-8/10 md:w-[80%] sm:w-[80%] h-full overflow-hidden">
                        <div className="xl:aspect-10/9 h-full overflow-hidden relative border rounded-md">
                            <Image
                                src={product?.colors[currentColorIndex].images[currentImageIndex]}
                                fill
                                // className="object-cover"
                                alt="jj"
                                priority
                                className="h-full w-full object-cover"

                            />
                        </div>
                    </div>
                </div>


                {/* Product Details */}
                <div className="w-full lg:w-6/12 flex flex-col gap-2 ">
                    <h1 className="font-extrabold lg:text-4xl sm:text-2xl text-xl uppercase ">{product?.name}</h1>
                    {/* star */}
                    <div className="mb-2 flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                            <Star
                                key={i}
                                className={`h-5 w-5 mr-1 transition-colors ${i < average ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-400"
                                    }`}
                            />
                        ))}
                        <span className="ml-5 text-gray-600 text-xs">{average.toFixed(1)} / 5</span>
                    </div>

                    {/* price */}
                    <div className="flex gap-5 mb-4">
                        <div className="text-lg font-bold flex gap-2">
                            <span className="text-gray-800">{product?.discount !== 0 && `₹${Math.round(product?.price * (1 - product?.discount / 100)).toLocaleString('en-IN')}`}</span>
                            <span>{product?.discount !== 0 ? <span className="line-through text-gray-500">₹{Math.round(product?.price).toLocaleString('en-IN')}</span> : <span>₹{Math.round(product?.price).toLocaleString('en-IN')}</span>}</span>
                        </div>
                        {product?.discount !== 0 && <span className="bg-red-300 py-1 px-4 rounded-2xl font-bold text-sm text-red-700">-{product?.discount}%</span>}
                    </div>

                    {/* description */}
                    <div className="sm:text-sm text-xs text-gray-500 sm:mr-10 mr-0 mb-2">
                        <span>{product?.description}</span>
                    </div>
                    <Separator />

                    {/* colors */}
                    <div className="flex flex-col gap-2 my-2">
                        <h3 className="text-md text-gray-600 font-sans">Select Colors</h3>
                        <div className="flex gap-2">
                            {
                                product?.colors.map((color, id) => (
                                    <div key={id} className="flex justify-center items-center w-8 h-8 rounded-full cursor-pointer  hover:opacity-60 transition duration-200" style={{ backgroundColor: color.color }}
                                        onClick={() => {
                                            setCurrentColorIndex(id)
                                            setCurrentImageIndex(0)
                                            if (id !== currentColorIndex) setSize("")

                                        }}
                                    >
                                        {id === currentColorIndex
                                            ? (<Check color="white" size={15} />)
                                            : ("")
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    {/* size */}
                    <div className="my-2">
                        <h3 className="text-gray-600 mb-2">Select Size</h3>
                        <div className="flex flex-wrap gap-2">
                            {allSizes.map((sizes) => {
                                const isAvailable = product?.colors[currentColorIndex].size.includes(sizes);
                                const handleClick = () => {
                                    if (size === sizes) {
                                        setSize("")
                                        return
                                    }
                                    if (isAvailable) {
                                        setSize(sizes)
                                    } else {
                                        toast.error("Size not available")
                                    }
                                };

                                return (
                                    <Button
                                        key={sizes}
                                        variant={`${size === sizes && isAvailable ? "default" : "outline"}`}
                                        className={` sm:h-12 h-8 font-bold sm:text-sm text-xs ${isAvailable ? "" : "opacity-50 cursor-not-allowed"
                                            }`}
                                        onClick={() => handleClick(isAvailable)}
                                    >
                                        {sizes}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    <Separator />

                    {/* cart */}
                    <div className="mt-5 flex gap-4">
                        <div className="flex items-center gap-8 ">
                            <Button variant="outline" size="icon" onClick={decrement} className={`${quantity == 1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <div className="text-lg font-medium">{quantity}</div>
                            <Button variant="outline" size="icon" onClick={increment}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="w-full">
                            <Button
                                className={`w-full ${size == "" ? "cursor-not-allowed" : "cursor-pointer"}`}
                                onClick={() => cart()}
                                disabled={cartLoading}
                            >
                                {cartLoading ? (<span className="flex gap-2 items-center">Adding <Loader2 className="animate-spin" /></span>) : "Add to Cart"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6 mt-10">
                <Tabs defaultValue="review" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full">
                        <TabsTrigger value="review" className="cursor-pointer">Ratting & Reviews</TabsTrigger>
                        <TabsTrigger value="products" className="cursor-pointer">Product Details</TabsTrigger>
                    </TabsList>

                    <TabsContent value="review">
                        <div>
                            <div className="flex items-center justify-between mt-2">
                                <h1 className="sm:text-md text-sm">All Reviews ({reviewData?.data.length})</h1>
                                <div className="flex items-center sm:gap-6 gap-3">
                                    <div className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition sm:block hidden">
                                        <SlidersVerticalIcon className="sm:h-5 sm:w-5 h-4 w-4" />
                                    </div>
                                    <Select>
                                        <SelectTrigger className="w-[100px] text-sm bg-gray-100">
                                            <SelectValue placeholder="Sort By" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">Default</SelectItem>
                                            <SelectItem value="dark">New to old</SelectItem>
                                            <SelectItem value="system">Old to new</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <PostReview
                                        id={product?.id}
                                        onSuccess={() => {
                                            fetchReviews(product.id);
                                            updateProduct(product.id, { ratting: average });
                                        }}
                                        rv={reviewData?.data.length}
                                    />

                                </div>
                            </div>

                            {/* reviews */}
                            <div className="my-10">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center space-y-4 p-10 max-w-xl mx-auto border rounded-2xl bg-muted/50 shadow-md">
                                        <ClipLoader color="#3b82f6" size={50} />
                                        <h2 className="text-lg font-semibold text-gray-700">Loading Product...</h2>
                                        <p className="text-sm text-gray-500 max-w-xs text-center">
                                            Please wait while we fetch the product details for you.
                                        </p>
                                    </div>
                                ) : reviewData?.data?.length === 0 ? (
                                    <Card className="w-full max-w-xl mx-auto mt-12 p-10 text-center rounded-2xl border bg-muted/50 shadow-sm">
                                        <div className="flex flex-col items-center space-y-4">
                                            <MessageCircle className="h-10 w-10 text-gray-400" />
                                            <h2 className="text-xl font-semibold text-gray-800">No Reviews Available</h2>
                                            <p className="text-sm text-muted-foreground max-w-md">
                                                This product hasn’t received any reviews yet. Once customers share their experience,
                                                you’ll see them here.
                                            </p>
                                            <div className="border shadow bg-white rounded-lg py-2 px-4 flex gap-2 items-center">Be the First to post review</div>
                                        </div>
                                    </Card>
                                ) : (
                                    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4  my-4">
                                        {reviewData?.data?.map((data, idx) => (
                                            <Card className="min-h-[160px]  px-5" key={idx}>
                                                <div className="flex flex-col  h-full justify-between">
                                                    <div>
                                                        <div className="mb-2 flex">
                                                            {Array.from({ length: 5 }, (_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-4 w-4 transition-colors ${i < data.ratting ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-400"
                                                                        }`}
                                                                />
                                                            ))}
                                                            <span className="ml-5 text-gray-600 text-xs">
                                                                {data.ratting.toFixed(1)} / 5
                                                            </span>
                                                        </div>
                                                        <h1 className="text-xs uppercase text-gray-400">{data.user?.name}</h1>
                                                    </div>
                                                    <p className="text-xs my-2 text-gray-900">{data.review}</p>
                                                    <h3 className=" text-xs text-gray-400">
                                                        Posted On{" "}
                                                        {new Date(data.createdAt).toLocaleString("en-IN", {
                                                            dateStyle: "medium",
                                                        })}
                                                    </h3>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>



                        </div>
                    </TabsContent>
                    <TabsContent value="products" className="flex justify-center">
                        <div className="lg:w-[70%] w-full p-6 space-y-4 rounded-2xl shadow-lg border border-gray-200 my-10 bg-white">
                            <h1 className="sm:text-3xl text-xl font-bold text-gray-900">{product?.name}</h1>
                            <h2 className="text-xl text-gray-600">{product?.brand}</h2>

                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.round(average)
                                                ? "fill-yellow-400 stroke-yellow-400"
                                                : "stroke-gray-300"
                                                }`}
                                        />
                                    ))}
                                    <span className="ml-2 text-gray-700 font-semibold">
                                        {average.toFixed(1)}
                                    </span>
                                </div>
                                <span className="text-sm text-green-600 font-semibold">
                                    {product?.discount ? `${product.discount}% OFF` : ""}
                                </span>
                            </div>

                            <p className="text-2xl font-semibold text-gray-900">
                                ₹{product?.price.toLocaleString()}
                            </p>

                            <div className="flex gap-2">
                                {product?.colors.map((color, id) => (
                                    <div
                                        key={id}
                                        className="w-8 h-8 rounded-full cursor-pointer border border-gray-300 hover:opacity-70 transition"
                                        style={{ backgroundColor: color.color }}
                                        title={color.color}
                                    />
                                ))}
                            </div>

                            <div className="text-gray-700 space-y-1">
                                <p>
                                    <span className="font-semibold">Category:</span> {product?.category}
                                </p>
                                <p>
                                    <span className="font-semibold">Dress Type:</span> {product?.dressType}
                                </p>
                            </div>

                            <p className="text-gray-800 text-xs sm:text-sm">{product?.description}</p>

                            <p className="text-sm text-gray-500">
                                Added on:{" "}
                                {product?.createdAt
                                    ? new Date(product.createdAt).toLocaleDateString("en-IN", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })
                                    : "N/A"}
                            </p>
                        </div>

                    </TabsContent>
                </Tabs>

            </div>
        </div>
    )
}
export default Productdetails