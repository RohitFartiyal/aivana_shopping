"use client";

import { deleteCartItem, getCart, updateCart } from "@/actions/cart"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useFetch from "@/hooks/use-fetch"
import { ArrowRight, Loader2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner";
import React, { useEffect, useState } from "react"
import { createCheckoutSession } from '@/actions/stripe'
import { loadStripe } from '@stripe/stripe-js'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PropagateLoader } from "react-spinners";
import Link from "next/link";
import { saveOrderCash } from "@/actions/order";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)


const CartListting = () => {

  const [quantity, setQuantity] = useState(0)
  const [loading, setLoading] = useState(false)
  const [deliveryCharge, setDeliveryCharge] = useState(50)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [country, setCountry] = useState("")
  const [state, setState] = useState("")
  const [pincode, setPincode] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")

  const [selectedOption, setSelectedOption] = useState("");

  const router = useRouter();



  // const cart = await getCart()
  const { loading: cartLoading, fn, data: cart } = useFetch(getCart)
  const { loading: cartUpdating, fn: fetchUpdate, data: cartData } = useFetch(updateCart)
  const { loading: deleting, fn: deleteCart, data: deleteData } = useFetch(deleteCartItem)

  useEffect(() => {
    fn()
  }, [])

  useEffect(() => {

    if (cartData?.success) {
      fn();
    }

    if (deleteData?.success) {
      toast.success("Product removed successfully");
      fn();
    }
  }, [cartData, deleteData]);


  const subTotalPrice = cart?.data?.reduce(
    (total, item) => total + (item.product?.price || 0) * (item.quantity || 1),
    0
  );

  const totaldiscount = cart?.data?.reduce((total, item) => {
    const price = item.product?.price || 0;
    const discountPercent = item.product?.discount || 0;
    const quantity = item.quantity || 0;

    const discountPerItem = Math.round((price * discountPercent) / 100);
    const totalItemDiscount = discountPerItem * quantity;

    return total + totalItemDiscount;
  }, 0);

  // console.log(cart?.data?.[0].image, "dd");


  useEffect(() => {
    if (subTotalPrice - totaldiscount < 400) {
      setDeliveryCharge(100);
    } else {
      setDeliveryCharge(50); // reset if above 400
    }
  }, [subTotalPrice, totaldiscount]);


  const totalPrice = subTotalPrice - totaldiscount + deliveryCharge
  const shippingAddress = `${address} ${state}, ${country}, ${pincode}`;

  // {product.product?.discount !==0 && `₹${}`}

  const simplifiedCart = cart?.data?.map(item => ({
    userId: item.userId,
    brand: item.product?.brand,
    discount: item.product?.discount,
    size: item.size,
    image: item.image,
    color: item.color,
    quantity: item.quantity || 1,
    name: item.product?.name,
    price: item.product?.price - Math.round(item.product?.price * item.product?.discount / 100)
  })) || []

  const userCartData = {
    subTotal: subTotalPrice,
    discount: totaldiscount,
    delivery: deliveryCharge,
    total: totalPrice,
    userName: name,
    phone: phone,
    shippingAddress: shippingAddress,
    country: country



  }



  console.log(simplifiedCart)
  console.log(userCartData)

  const handelDecreamentCart = async (item, id) => {
    const newQuantity = item - 1;
    setQuantity(newQuantity);
    toast.success(`Updated quantity to ${newQuantity}`);
    await fetchUpdate(id, { quantity: newQuantity });
  }
  const handelIncreamentCart = async (item, id) => {
    const newQuantity = item + 1;
    setQuantity(newQuantity);
    toast.success(`Updated quantity to ${newQuantity}`);
    await fetchUpdate(id, { quantity: newQuantity });
  };

  const handelDelete = async (id) => {
    await deleteCart(id)
    console.log(deleteData)
  }


  // stripeCheckout
  const handleCheckout = async () => {
    if (name == "" || country == "" || state == "" || pincode == "" || address == "" || phone == "") {
      toast.error("Enter all feilds")
      return
    }
    if (selectedOption == "") {
      toast.warning("Select Payment Method");
      return
    }

    // Prepaid 
    if (selectedOption == "bank") {
      setLoading(true)
      const { sessionId, error } = await createCheckoutSession(simplifiedCart, userCartData)

      if (error) {
        alert('Error: ' + error)
        setLoading(false)
        return
      }

      const stripe = await stripePromise
      await stripe.redirectToCheckout({ sessionId })
    }

    // PostPaid
    if (selectedOption == "cash") {
      const result = await saveOrderCash(simplifiedCart, userCartData)

      if (result.success) router.push("/checkout/success");
    }
  }

  return (
    <>
      {
        cartLoading && !cart
          ? <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-38">
            {/* Left: Cart items (2/3 width) */}
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border rounded-lg p-4 bg-white space-x-4"
                >
                  <Skeleton className="h-20 w-20 rounded-md" /> {/* Image */}
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" /> {/* Title */}
                    <Skeleton className="h-4 w-1/3" /> {/* Size/Color */}
                  </div>
                  <Skeleton className="h-4 w-12" /> {/* Price */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded" /> {/* - */}
                    <Skeleton className="h-4 w-4" /> {/* Qty */}
                    <Skeleton className="h-8 w-8 rounded" /> {/* + */}
                  </div>
                  <Skeleton className="h-6 w-6 rounded-full" /> {/* Trash */}
                </div>
              ))}
            </div>

            {/* Right: Order summary */}
            <div className="border rounded-lg p-4 bg-white space-y-4">
              <Skeleton className="h-6 w-1/3" /> {/* "Order Summary" */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4" /> {/* Subtotal label */}
                  <Skeleton className="h-4 w-8" /> {/* Subtotal value */}
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4" /> {/* Discount label */}
                  <Skeleton className="h-4 w-8" /> {/* Discount value */}
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4" /> {/* Delivery Fee */}
                  <Skeleton className="h-4 w-8" /> {/* Fee value */}
                </div>
              </div>
              <div className="flex justify-between border-t pt-2">
                <Skeleton className="h-4 w-1/4" /> {/* Total */}
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-10 w-full rounded" /> {/* Promo code input */}
              <Skeleton className="h-10 w-full rounded" /> {/* Checkout button */}
            </div>
          </div>
          : cart?.success && cart.data.length > 0 ? (
            <div>
              <div>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>CART</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <h1 className="font-extrabold text-3xl my-4">YOUR CART</h1>
              <div className="flex lg:flex-row flex-col gap-6 mt-5">
                <div className="lg:w-8/12 w-full">
                  <Card className="px-4">
                    {cart?.data.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <div className="flex justify-between" key={idx}>

                          <div className="flex gap-6">
                            <div className="h-30 w-30 rounded-md overflow-hidden">
                              <Image
                                src={item?.image}
                                alt={`hh`}
                                height={40}
                                width={40}
                                className="w-full h-full object-cover"
                                priority
                              />
                            </div>

                            <div>
                              <h2 className="font-semibold text-xl text-neutral-800 uppercase mb-1">{item?.product.name}</h2>
                              <h3 className="text-sm font-medium text-neutral-800 pb-1">Size  <span className="text-neutral-500 uppercase">{item?.size}</span></h3>
                              <h3 className="text-sm font-medium text-neutral-800 pb-1">Color  <span className="text-neutral-500 uppercase">{item?.color}</span></h3>
                              <h2 className="text-xl font-bold text-neutral-800 mt-3">₹{item?.product.price}</h2>
                            </div>
                          </div>

                          <div className="flex flex-col items-end justify-between">
                            <button onClick={() => handelDelete(item?.productId)}><Trash2 className="text-gray-600 cursor-pointer hover:text-red-500 transition" /></button>
                            <div className="bg-gray-200 rounded-2xl flex justify-between items-center px-2 py-1 gap-2 text-neutral-600 font-">
                              <button
                                onClick={() => handelDecreamentCart(quantity == 0 ? item?.quantity : quantity, item?.productId)}
                                disabled={item?.quantity == 1 || quantity == 1}
                                className="disabled:opacity-50" // optional: style to show disabled state
                              >
                                <Minus size={20} />
                              </button>

                              {item?.quantity}

                              <button
                                onClick={() => handelIncreamentCart(quantity == 0 ? item?.quantity : quantity, item?.productId)}
                                disabled={item?.quantity == 5 || quantity == 5}
                                className="disabled:opacity-50" // optional: style to show disabled state
                              >
                                <Plus size={20} />
                              </button>

                            </div>
                          </div>

                        </div>
                        {cart?.data.length !== idx + 1 ? <Separator /> : ''}
                      </React.Fragment>
                    ))}
                  </Card></div>

                <div className=" lg:w-4/12 w-fulll flex flex-col gap-5">
                  <Card className="border  px-5">
                    <h2 className="font-bold text-2xl">Order Summary</h2>
                    <div className="flex flex-col gap-4">

                      {/* subtotal */}
                      <div className="flex justify-between items-center">
                        <h2 className="text-gray-500   text-lg">Subtotal</h2>
                        <h2 className="text-gray-800 font-medium text-lg">₹{subTotalPrice}</h2>
                      </div>

                      {/* Discount */}
                      <div className="flex justify-between items-center">
                        <h2 className="text-gray-500  text-lg">Discount</h2>
                        <h2 className="text-red-600 font-medium text-lg">-₹{totaldiscount}</h2>
                      </div>

                      {/* Delivery */}
                      <div className="flex justify-between items-center">
                        <h2 className="text-gray-500  text-lg">Delivery Fee</h2>
                        <h2 className="text-gray-800 font-medium text-lg">₹{deliveryCharge}</h2>
                      </div>

                      <Separator />

                      {/* Total */}
                      <div className="flex justify-between items-center">
                        <h2 className="text-gray-800  text-lg">Total</h2>
                        <h2 className="text-gray-800 font-medium text-lg">₹{totalPrice}</h2>
                      </div>

                      {/* promo code */}
                      <div className="flex gap-4">
                        <Input
                          className={`bg-gray-200 rounded-2xl w-7/10 h-10`}
                          placeholder="Apply Promo Code"
                        />
                        <Button className='rounded-2xl w-3/10 h-10'>Apply</Button>
                      </div>

                      <Button
                        className="rounded-2xl h-11 mt-4 cursor-pointer"
                        onClick={() => setOpen(!open)}
                      >{open ? 'Hide' : 'Proceed'}</Button>

                      {/* <Button className="rounded-2xl h-11 mt-4"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? <>Redirecting... <Loader2 className="animate-spin" /></> : <>Go to Checkout <ArrowRight /></>}

              </Button> */}
                    </div>
                  </Card>
                  <div className={`px-5 py-8 bg-white flex flex-col border-2 rounded-xl shadow gap-4 mb-10 ${open == false ? 'hidden' : ''}`}>
                    <h2 className="font-bold text-xl text-neutral-800">Delivery Details</h2>
                    <Input
                      className={`bg-gray-50 rounded-md h-10`}
                      placeholder="Enter your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                      className={`bg-gray-50 rounded-md h-10`}
                      placeholder="Enter your Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                    <Input
                      className={`bg-gray-50 rounded-md h-10`}
                      placeholder="Enter your State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                    <Input
                      className={`bg-gray-50 rounded-md h-10`}
                      placeholder="Enter your Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                    <Input
                      className={`bg-gray-50 rounded-md h-10`}
                      placeholder="Residencial Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <Input
                      className={`bg-gray-50 rounded-md h-10`}
                      placeholder="Enter your Phone No."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />

                    <RadioGroup
                      value={selectedOption}
                      onValueChange={(value) => setSelectedOption(value)}
                      className="mt-2"
                    >
                      <div className="flex gap-5">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash">Cash On Delivery</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bank" id="bank" />
                          <Label htmlFor="bank">Pay By Bank</Label>
                        </div>
                      </div>
                    </RadioGroup>




                    <Button className="rounded-2xl h-11 mt-4 cursor-pointer"
                      onClick={handleCheckout}
                      disabled={loading}
                    >
                      {loading ? <>Redirecting... <Loader2 className="animate-spin" /></> : <>Go to Checkout <ArrowRight /></>}

                    </Button>

                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[80vh] px-4">
              <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center text-center p-8">
                  <div className="bg-primary/10 rounded-full p-4 mb-4">
                    <ShoppingCart className="w-10 h-10 text-primary" />
                  </div>
                  <h1 className="text-2xl font-semibold text-foreground mb-2">Your cart is empty</h1>
                  <p className="text-muted-foreground text-sm mb-6">
                    You haven’t added anything to your cart yet. Start exploring our products and find what you love.
                  </p>
                  <Link className="w-full" href='/shop'><Button size="lg" className="w-full" >
                    Browse Products
                  </Button></Link>
                </CardContent>
              </Card>
            </div>
          )
      }</>
  )
}
export default CartListting

