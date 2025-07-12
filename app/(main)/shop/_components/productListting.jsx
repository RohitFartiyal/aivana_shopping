"use client";

import { getProducts } from "@/actions/product-listting";
import ProductCard from "@/components/card";
import useFetch from "@/hooks/use-fetch";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent } from "@/components/ui/card";
import { PackageX } from "lucide-react";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"


const ProductListting = () => {

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const pathSegments = pathname.split('/').filter((segment) => segment)

  const pathArray = pathSegments.map((segment, i) => {
    const href = '/' + pathSegments.slice(0, i + 1).join('/')
    return {
      name: decodeURIComponent(segment),
      href,
    }
  })

  const limit = 6;

  // Extract filter values from searchParams
  const search = searchParams.get("search") || "";
  const brand = searchParams.get("brand") || "";
  const category = searchParams.get("category") || "";
  const dressType = searchParams.get("dressType") || "";
  const color = searchParams.get("color") || "";
  const minPrice = searchParams.get("minPrice") || 0;
  const maxPrice = searchParams.get("maxPrice") || Number.MAX_SAFE_INTEGER;
  const sortBy = searchParams.get("sortBy") || "newest";
  const page = parseInt(searchParams.get("page") || "1");

  const { loading, fn: fetchProducts, data: result, error } = useFetch(getProducts)

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts({
      search,
      color,
      brand,
      category,
      dressType,
      minPrice,
      maxPrice,
      sortBy,
      page,
      limit,
    });
  }, [
    search,
    color,
    brand,
    category,
    dressType,
    minPrice,
    maxPrice,
    sortBy,
    page,
  ]);


  // Update URL when page changes
  useEffect(() => {
    if (currentPage !== page) {
      const params = new URLSearchParams(searchParams);
      params.set("page", currentPage.toString());
      router.push(`?${params.toString()}`);
    }
  }, [currentPage, router, searchParams, page]);

  // Handle pagination clicks
  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  // Generate pagination URL
  const getPaginationUrl = (pageNum) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNum.toString());
    return `?${params.toString()}`;
  };


  // Generate pagination items
  const paginationItems = [];

  // Calculate which page numbers to show (first, last, and around current page)
  const visiblePageNumbers = [];

  // Always show page 1
  visiblePageNumbers.push(1);

  // Show pages around current page
  for (
    let i = Math.max(2, page - 1);
    i <= Math.min(result?.pagination.pages - 1, page + 1);
    i++
  ) {
    visiblePageNumbers.push(i);
  }

  // Always show last page if there's more than 1 page
  if (result?.pagination.pages > 1) {
    visiblePageNumbers.push(result?.pagination.pages);
  }

  // Sort and deduplicate
  const uniquePageNumbers = [...new Set(visiblePageNumbers)].sort(
    (a, b) => a - b
  );

  // Create pagination items with ellipses
  let lastPageNumber = 0;
  uniquePageNumbers.forEach((pageNumber) => {
    if (pageNumber - lastPageNumber > 1) {
      // Add ellipsis
      paginationItems.push(
        <PaginationItem key={`ellipsis-${pageNumber}`}>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    paginationItems.push(
      <PaginationItem key={pageNumber}>
        <PaginationLink
          href={getPaginationUrl(pageNumber)}
          isActive={pageNumber === page}
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(pageNumber);
          }}
        >
          {pageNumber}
        </PaginationLink>
      </PaginationItem>
    );

    lastPageNumber = pageNumber;

    
  });  

  return (
    <>
      <div className="flex sm:flex-row flex-col justify-between sm:items-center items-end sm:pr-5 pr-1 mb-5 h-8 lg:ml-0 sm:ml-22 ml-16 ">
        <div>
          <Breadcrumb className="ml-5">
            <BreadcrumbList>
              {/* Static Home Item */}
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" >HOME</Link>
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
                        <BreadcrumbPage className="uppercase">{item.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={item.href} className="uppercase">{item.name}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div>
          <h3 className="text-sm text-gray-500">{`Showing ${result?.pagination.page || "0"} - ${result?.pagination.pages || "0"} of ${result?.pagination.total || "0"} Products`}</h3>
        </div>
      </div>

      <div >
        {loading ? (
          <Card className="w-full h-[60vh] flex flex-col items-center justify-center py-20 bg-muted shadow-none border-0">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <ClipLoader size={40} color="#6B7280" />
              <p className="mt-4 text-sm text-muted-foreground">Loading products...</p>
            </CardContent>
          </Card>
        ) : result?.data.length === 0 ? (
          <Card className="w-full flex flex-col items-center justify-center py-20 bg-muted shadow-none border-0">
            <CardContent className="text-center flex flex-col items-center">
              <PackageX className="w-12 h-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground">No Products Found</h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                We couldn’t find any products matching your filters. Try adjusting your filters or check back later.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid min-h-screen grid-cols-1 lsm md:grid-cols-2 xl:grid-cols-3 lg:grid-cols-2 gap-6 ">
            {result?.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}


        {result?.pagination.pages >= 1 && (
          <Pagination className="mt-10">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={getPaginationUrl(page - 1)}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) {
                      handlePageChange(page - 1);
                    }
                  }}
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {paginationItems}

              <PaginationItem>
                <PaginationNext
                  href={getPaginationUrl(page + 1)}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < result?.pagination.pages) {
                      handlePageChange(page + 1);
                    }
                  }}
                  className={
                    page >= result?.pagination.pages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

      </div>

    </>
  )
}
export default ProductListting