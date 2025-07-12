"use client"

import { deletProduct, getProducts, updateProductStatus } from "@/actions/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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

import useFetch from "@/hooks/use-fetch";
import { Eye, Loader2, MoreHorizontal, Plus, Search, ShoppingBag, Star, StarOff, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

const ProductListting = () => {

  const router = useRouter()
  const [search, setSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ProductToDelete, setProductToDelete] = useState(null);
  const [discount, setDiscount] = useState(0)
  const [confirmAdminDialog, setConfirmAdminDialog] = useState(false);


  const {
    loading: loadingProducts,
    fn: fetchProduct,
    data: productResult,
  } = useFetch(getProducts);

  const {
    loading: updatingProduct,
    fn: updateProductStatusFn,
    data: updateResult,
    error: updateError,
  } = useFetch(updateProductStatus);

  const {
      loading: deletingProduct,
      fn: deleteProductFn,
      data: deleteResult,
      error: deleteError,
    } = useFetch(deletProduct);

  // Initial fetch and refetch on search changes
  useEffect(() => {
    fetchProduct(search);
  }, [search]);

  // Handle successful operations
  useEffect(() => {

    if (updateResult?.success) {
      toast.success("Product updated successfully");
      fetchProduct(search);
    }
    if (deleteResult?.success) {
      toast.success("Product deleted successfully");
      fetchProduct(search);
    }
  }, [updateResult,deleteResult]);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProduct(search);
  };

  // const data = getProductResult()
  // console.log(getProductResult, "data")


  console.log(updateResult, "dataaaaaaaaa")

  // function Image({ productId }) {
  //   // fetch(productId)
  //   // console.log(result?.data, "data")

  //   return (
  //     <div>
  //       <h1>

  //         {result?.data[0].color}
  //       </h1>
  //     </div>
  //   )
  // }

  // Handle toggle featured status
  const handleToggleFeatured = async (product) => {
    await updateProductStatusFn(product.id, { featured: !product.featured });
    toast.success("Product Updated")
  };

  // Handle Update discount status
  const handelUpdateDiscount = async (product) => {
    await updateProductStatusFn(product.id, { discount: discount });
    setConfirmAdminDialog(false)
    toast.success("Product Updated")
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Available
          </Badge>
        );
      case "UNAVAILABLE":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Unavailable
          </Badge>
        );
      case "SOLD":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Sold
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Handle status change
  const handleStatusUpdate = async (product, newStatus) => {
    await updateProductStatusFn(product.id, { status: newStatus });
    toast.success("Product Updated")
  };

  // Handle delete car
  const handleDeleteProduct = async () => {
    if (!ProductToDelete) return;

    console.log(ProductToDelete.id)

    await deleteProductFn(ProductToDelete.id);
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };


  return (
    <div>
      <div className="mb-4 flex sm:gap-0 gap-2 justify-between ">
        <Link href={'/admin/product/new'}>
          <Button><Plus />Add Product</Button>
        </Link>
        <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search Products..."
              className=" pl-9 sm:w-80 w-full shadow"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>
        {/* <Input placeholder="Search for Product" className="sm:w-80 w-45 shadow" /> */}
      </div>
      <Card >
        <CardContent className="p-0">
          {loadingProducts && !productResult ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : productResult?.success && productResult.data.length > 0 ? (


            <div className="overflow-x-auto ">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Brand & Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productResult?.data.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="w-10 h-10 rounded-md overflow-hidden">
                          {product.colors[0].images && product.colors[0].images.length > 0 ? (
                            <Image
                              src={product.colors[0].images[0]}
                              alt={`hh`}
                              height={40}
                              width={40}
                              className="w-full h-full object-cover"
                              priority
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <ShoppingBag className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="font-medium">
                        {product.brand} {product.name}
                      </TableCell>
                      <TableCell>₹{product.price}</TableCell>
                      {/* <TableCell>{formatCurrency(car.price)}</TableCell> */}
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell>
                        <Dialog
                          open={confirmAdminDialog}
                          onOpenChange={setConfirmAdminDialog}
                        >
                          <DialogTrigger className="border bg-accent w-14 rounded-md transition cursor-pointer text-gray-800 hover:shadow hover:bg-muted">{product.discount}%</DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Discount</DialogTitle>
                              <DialogDescription>
                                Make changes to your product discount here. Click save when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <Input placeholder="Enter the Discount percentage" type="number" onChange={(e) => setDiscount(Number(e.target.value))} />
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button type="submit"
                                onClick={() => handelUpdateDiscount(product)}
                                disabled={updatingProduct}
                              >{updatingProduct ? (<>Saving...<Loader2 className="animate-spin" /></>) : "Save Changes"}</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog></TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-9 w-9"
                          onClick={() => handleToggleFeatured(product)}
                          disabled={updatingProduct}
                        >
                          {product.featured ? (
                            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                          ) : (
                            <StarOff className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => router.push(`/shop/${product.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Status</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(product, "AVAILABLE")
                              }
                              disabled={
                                product.status === "AVAILABLE" || updatingProduct
                              }
                            >
                              Set Available
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(product, "UNAVAILABLE")
                              }
                              disabled={
                                product.status === "UNAVAILABLE" || updatingProduct
                              }
                            >
                              Set Unavailable
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(product, "SOLD")}
                              disabled={product.status === "SOLD" || updatingProduct}
                            >
                              Mark as Sold
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                            onClick={() => {
                              setProductToDelete(product);
                              setDeleteDialogOpen(true);
                            }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

            </div>


          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              {/* <CarIcon className="h-12 w-12 text-gray-300 mb-4" /> */}
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No Product found
              </h3>
              <p className="text-gray-500 mb-4">
                { search
                  ? "No Products match your search criteria"
                  : "Your inventory is empty. Add Prooduct to get started."}
              </p>
              <Button onClick={() => router.push("/admin/product/new")}>
                Add Your First Product
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {ProductToDelete?.name}{" "}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deletingProduct}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              disabled={deletingProduct}
            >
              {deletingProduct ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default ProductListting
