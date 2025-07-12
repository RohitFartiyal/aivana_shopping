"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ArrowRight, Loader2, Mail, MapPin, Phone, PhoneCall, Truck, TruckIcon, User } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator"
import { cancelOrder, getAllShoppingForUser } from "@/actions/order"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import useFetch from "@/hooks/use-fetch"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

const OrderPage = () => {

    //   const orders = await getAllShoppingForUser()

    const {
        loading: fetchingOrders,
        fn: fetchOrder,
        data: orders,
        error: ordersError,
    } = useFetch(getAllShoppingForUser);

    const {
        loading: cancelling,
        fn: cancelOrderFn,
        data: cancelResult,
        error,
    } = useFetch(cancelOrder);

    useEffect(() => {
        fetchOrder()
    }, [])

    useEffect(() => {
        if (cancelResult?.success == true) {
            toast.success("Order Cancelled");
            fetchOrder()
        }
        if (cancelResult?.success == false && cancelResult?.error == "order is already cancelled") toast.warning("order is already cancelled")
        if (cancelResult?.success == false && cancelResult?.error == "Cannot cancel a completed order") toast.warning("Cannot cancel a completed order")
    }, [cancelResult])

    const handelCancel = async (shoppingId) => {
        await cancelOrderFn(shoppingId);
    };


    return (
        <div className="mt-20">

            <Card className="mt-24 px-4">

                {fetchingOrders && !orders ? (
                    <div className="space-y-4">
                        {Array.from({ length: 2 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="border rounded-lg p-4 shadow-sm space-y-4 animate-pulse"
                            >
                                {/* Top row: order status and cancel button */}
                                <div className="flex justify-between items-center">
                                    <div className="h-6 bg-gray-200 rounded w-24" />
                                    <div className="h-8 bg-gray-200 rounded w-24" />
                                </div>

                                {/* Middle row: product image + details */}
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 bg-gray-200 rounded-md" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                                        <div className="h-6 bg-gray-200 rounded w-16" />
                                    </div>
                                </div>

                                {/* Bottom row: address, payment, total */}
                                <div className="flex flex-wrap gap-2 items-center">
                                    <div className="h-6 bg-gray-200 rounded w-20" />
                                    <div className="h-6 bg-gray-200 rounded w-28" />
                                    <div className="h-6 bg-gray-200 rounded w-24" />
                                </div>

                                {/* Extra row: contact & email */}
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : orders?.success && orders.shoppingList.length > 0 ? (



                    <div>
                        <div>
                            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-700"><Truck /> Your Orders</h1>
                            <p className="text-sm text-gray-500">Manage and track all your Orders status</p>
                        </div>
                        {orders?.shoppingList.map((order, idx) => (
                            <Card className="px-4 my-5" key={idx}>
                                <div className="flex items-center gap-4 justify-between">
                                    <div className="flex gap-2">
                                        <Badge className="h-6 bg-gray-100" variant="outline">ORDER STATUS</Badge>
                                        <Badge className="h-6">{order.status}</Badge>
                                    </div>

                                    <Button onClick={() => handelCancel(order.id)} disabled={cancelling} variant="destructive" className="h-6 text-xs">CANCEL</Button>

                                </div>

                                {order.items.map((items, id) => (
                                    <div key={id}>
                                        <div className="flex items-center gap-10">
                                            <div className="relative sm:w-50 sm:h-60 w-30 h-40 ">
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        src={items?.image}
                                                        alt={`pp`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-[2px]">
                                                <h1 className="sm:text-xl text-sm font-bold text-gray-800">{items.name} {items.brand}</h1>
                                                <h1 className="sm:text-md text-sm font-bold text-gray-700">Color <span className="text-gray-500 uppercase">{items.color}</span></h1>
                                                <h1 className="sm:text-md text-sm font-bold text-gray-700">Size <span className="text-gray-500">{items.size}</span></h1>
                                                <h1 className="sm:text-md text-sm font-bold text-gray-700 mb-4">Quantity <span className="text-gray-500">{items.quantity}</span></h1>

                                                <h1 className="sm:text-xl font-bold text-gray-700">₹{items.price}</h1>

                                                {items.discount !== 0 && <Badge variant="primary" className="sm:text-sm text-xs font-bold mt-1 text-gray-700">Discount {items.discount}%</Badge>}
                                            </div>
                                        </div>
                                        {/* <Separator className="mt-4"/> */}
                                    </div>
                                ))}

                                {/* orders footer */}
                                <div className="flex lg:flex-row flex-col lg:gap-15 gap-5 lg:items-center items-start">
                                    <div className="flex sm:gap-15 gap-6 sm:flex-row flex-col">
                                        <div className="flex flex-col gap-1">
                                            <Badge className="h-6 uppercase bg-muted" variant="outline"><User />{order.Username}</Badge>
                                            <h1 className="flex text-sm text-gray-500">Ordered on {format(new Date(order.createdAt), "dd MMM yyyy")}</h1>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            {order.payment == "CASH" && <Badge className="h-6 uppercase bg-green-400">Cash On Delivery</Badge>}
                                            {order.payment == "NET_BANKING" && <Badge className="h-6 uppercase bg-green-500">Payment Completed</Badge>}
                                            <Badge className="h-6 uppercase bg-muted" variant="outline">Total ₹{order.total}</Badge>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <h1 className="h-6 uppercase flex items-center gap-1 text-sm text-gray-500" variant="outline"><PhoneCall height={15} width={15} /> {order.phone}</h1>
                                        <h1 className="h-6 uppercase flex items-center gap-1 sm:text-sm text-xs text-gray-500" variant="outline">
                                            <MapPin height={15} width={15} />
                                            <span className="overflow-x-auto whitespace-nowrap xl:max-w-[400px] lg:max-w-[320px] sm:max-w-[500px] max-w-[300px] block">
                                                {order.shippingAddress}
                                            </span>
                                        </h1>
                                        <h1 className="h-6 flex items-center gap-1 text-sm text-gray-500" variant="outline"><Mail height={15} width={15} /> {order.user.email}</h1>
                                    </div>
                                </div>



                            </Card>
                        ))}


                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <TruckIcon className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            No Order found
                        </h3>
                        <p className="text-gray-500 mb-4">Your Orders are empty</p>
                    </div>
                )}
            </Card>
        </div>
    )
}
export default OrderPage