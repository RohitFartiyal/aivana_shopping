"use client"

import useFetch from "@/hooks/use-fetch"
import { cancelOrder, deleteOrder, getAllShopping, updateShopping } from "@/actions/admin"
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

import { ArrowRight, Loader2, Mail, MapPin, Phone, PhoneCall, Search, Trash2, Truck, TruckIcon, User } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const OrdersManagement = () => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Custom hooks for API calls
    const {
        loading: fetchingOrders,
        fn: fetchOrder,
        data: orders,
        error: ordersError,
    } = useFetch(getAllShopping);

    const {
        loading: updatingStatus,
        fn: updateStatusFn,
        data: updateResult,
        error: updateError,
    } = useFetch(updateShopping);

    const {
        loading: cancelling,
        fn: cancelOrderFn,
        data: cancelResult,
        error,
    } = useFetch(cancelOrder);

    const {
        loading: deleting,
        fn: deleteOrderFn,
        data: deleteResult,
        error: deleteError,
    } = useFetch(deleteOrder);



    // Initial fetch and refetch on search/filter changes
    useEffect(() => {
        fetchOrder({ search, status: statusFilter });
    }, [search, statusFilter]);

    // Handle successful operations
    useEffect(() => {
        if (updateResult?.success) {
            toast.success("Order updated successfully");
            fetchOrder({ search, status: statusFilter });
        }
        if (cancelResult?.success) {
            toast.success("Order cancelled successfully");
            fetchOrder({ search, status: statusFilter });
        }
        if (deleteResult?.success) {
            toast.success("Order Deleted successfully");
            fetchOrder({ search, status: statusFilter });
        }
    }, [updateResult, cancelResult, deleteResult]);


    const handleUpdateStatus = async (shoppingId, newStatus) => {
        if (newStatus) {
            await updateStatusFn(shoppingId, newStatus);
        }
    };

    const handelCancel = async (shoppingId) => {
        await cancelOrderFn(shoppingId);
    };

    const handelDeleteOrder = async () => {
        if (!orderToDelete) return;

        await deleteOrderFn(orderToDelete.id);
        setDeleteDialogOpen(false);
        setOrderToDelete(null);
    };

    // Handle search submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchOrder({ search, status: statusFilter });
    };

    console.log(orders)

    const status = ["PENDING", "CONFIRMED", "SHIPPED", "DEVLIVERED", "CANCELED"]

    // Helper function for status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case "PENDING":
                return <Badge className="h-6 bg-amber-100 text-amber-800">Pending</Badge>;
            case "CONFIRMED":
                return <Badge className="h-6 bg-gray-100 text-gray-800">Confirmed</Badge>;
            case "SHIPPED":
                return <Badge className="h-6 bg-blue-100 text-blue-800">Shipped</Badge>;
            case "DEVLIVERED":
                return <Badge className="h-6 bg-green-100 text-green-800">Delivered</Badge>;
            case "CANCELED":
                return <Badge className="h-6 bg-red-100 text-red-800">Canceled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    console.log("aaa", orders?.success)
    console.log("bb", orders)
    return (
        <div>

            {/* search and filterbar */}
            <div className="flex items-center justify-baseline gap-10">
                <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                        <SelectItem value="DEVLIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELED">Canceled</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex gap-4 w-full">
                    <form className="flex w-full">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Search Products..."
                                className=" pl-9 shadow"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </form>
                    <Button onSubmit={handleSearchSubmit}>Search</Button>
                </div>
            </div>

            <Card className="mt-5 px-4">
                {fetchingOrders && !orders ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : orders?.success && orders.shoppingList.length > 0 ? (

                    <div>
                        <div>
                            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-700"><Truck /> Orders Booking</h1>
                            <p className="text-sm text-gray-500 mb-4">Manage all your orders and update their status</p>
                        </div>
                        {orders.shoppingList?.map((order, idx) => (
                            <Card className="px-4 mb-4" key={idx}>
                                <div className="flex items-center gap-4 justify-between">
                                    <div className="flex gap-2">
                                        <Badge className="h-6 bg-blue-500 text-white dark:bg-blue-600" variant="secondary">Order No.{idx + 1}</Badge>
                                        {getStatusBadge(order.status)}
                                    </div>
                                    <Select
                                        value={order.status}
                                        onValueChange={(value) =>
                                            handleUpdateStatus(order.id, value)
                                        }
                                    >
                                        <SelectTrigger className="w-[50%]">
                                            <SelectValue placeholder="Set user order status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                            <SelectItem value="SHIPPED">Shipped</SelectItem>
                                            <SelectItem value="DEVLIVERED">Delivered</SelectItem>
                                            <SelectItem value="CANCELED">Canceled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {order.items.map((items, id) => (
                                    <div key={id}>
                                        <div className="flex items-center gap-10">
                                            <div className="relative w-50 h-60 ">
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
                                                <h1 className="text-xl font-bold text-gray-800">{items.name} {items.brand}</h1>
                                                <h1 className="text-md font-bold text-gray-700">Color <span className="text-gray-500 uppercase">{items.color}</span></h1>
                                                <h1 className="text-md font-bold text-gray-700">Size <span className="text-gray-500">{items.size}</span></h1>
                                                <h1 className="text-md font-bold text-gray-700 mb-4">Quantity <span className="text-gray-500">{items.quantity}</span></h1>

                                                <h1 className="text-xl font-bold text-gray-700">₹{items.price}</h1>

                                                {items.discount !== 0 && <Badge variant="primary" className="text-sm font-bold mt-1 text-gray-700">Discount {items.discount}%</Badge>}
                                            </div>
                                        </div>
                                        {/* <Separator className="mt-4"/> */}
                                    </div>
                                ))}

                                <div className="flex xl:flex-row xl:gap-0 flex-col gap-5 justify-between">
                                    <div className="flex lg:flex-row flex-col lg:gap-6 gap-5 lg:items-center items-start">
                                        <div className="flex sm:gap-4 gap-6 sm:flex-row flex-col">
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
                                            <h1 className="h-6 uppercase flex items-center gap-1 text-sm text-gray-500" variant="outline">
                                                <MapPin height={15} width={15} />
                                                <span className="overflow-x-auto whitespace-nowrap xl:max-w-[400px] lg:max-w-[320px] sm:max-w-[500px] max-w-[300px] block">
                                                    {order.shippingAddress}
                                                </span>
                                            </h1>


                                            <h1 className="h-6 flex items-center gap-1 text-sm text-gray-500" variant="outline"><Mail height={15} width={15} /> {order.user.email}</h1>
                                        </div>

                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Button onClick={() => handelCancel(order.id)} disabled={cancelling}>Cancel Order<ArrowRight /></Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                setOrderToDelete(order);
                                                setDeleteDialogOpen(true);
                                            }}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Order
                                        </Button>
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
                        <p className="text-gray-500 mb-4">
                            {statusFilter || search
                                ? "No Products match your search criteria"
                                : "Your inventory is empty. Add Prooduct to get started."}
                        </p>
                    </div>
                )}


            </Card>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete Order. This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handelDeleteOrder}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Order"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    )
}
export default OrdersManagement