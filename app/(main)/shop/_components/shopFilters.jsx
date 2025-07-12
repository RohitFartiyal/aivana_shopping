"use client"

import { useCallback, useEffect, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ShopFilterControls from "./shopFilterControls";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PanelLeftOpen, X } from "lucide-react";



const ShopFilters = ({ filters }) => {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // get current filter value from searchParams
  const currentBrand = searchParams.get("brand") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentDressType = searchParams.get("dressType") || "";
  const currentColor = searchParams.get("color") || "";
  const currentSize = searchParams.get("size") || "";
  const currentMinPrice = searchParams.get("minPrice")
    ? parseInt(searchParams.get("minPrice"))
    : filters.priceRange.min;
  const currentMaxPrice = searchParams.get("maxPrice")
    ? parseInt(searchParams.get("maxPrice"))
    : filters.priceRange.max;
  const currentSortBy = searchParams.get("sortBy") || "newest";

  // Local state for filters
  const [brand, setBrand] = useState(currentBrand);
  const [category, setCategory] = useState(currentCategory);
  const [dressType, setDressType] = useState(currentDressType);
  const [color, setColor] = useState(currentColor);
  const [size, setSize] = useState(currentSize);
  const [priceRange, setPriceRange] = useState([
    currentMinPrice,
    currentMaxPrice,
  ]);
  const [sortBy, setSortBy] = useState(currentSortBy);

  // Update local state when URL parameters change
  useEffect(() => {
    setBrand(currentBrand);
    setCategory(currentCategory);
    setDressType(currentDressType);
    setColor(currentColor);
    setSize(currentSize);
    setPriceRange([currentMinPrice, currentMaxPrice]);
    setSortBy(currentSortBy);
  }, [
    currentBrand,
    currentCategory,
    currentDressType,
    currentColor,
    currentSize,
    currentMinPrice,
    currentMaxPrice,
    currentSortBy,
  ]);

  const activeFiltersCount = [
    brand,
    category,
    dressType,
    color,
    size,
    currentMinPrice > filters.priceRange.min ||
    currentMaxPrice < filters.priceRange.max,

  ].filter(Boolean).length

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();

    if (brand) params.set("brand", brand);
    if (category) params.set("category", category);
    if (dressType) params.set("dressType", dressType);
    if (color) params.set("color", color);
    if (size) params.set("size", size);
    if (priceRange[0] > filters.priceRange.min)
      params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < filters.priceRange.max)
      params.set("maxPrice", priceRange[1].toString());
    if (sortBy !== "newest") params.set("sortBy", sortBy);

    // Preserve search and page params if they exist
    const search = searchParams.get("search");
    const page = searchParams.get("page");
    if (search) params.set("search", search);
    if (page && page !== "1") params.set("page", page);

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    router.push(url);
    // setIsSheetOpen(false);
  }, [
    brand,
    category,
    dressType,
    color,
    size,
    priceRange,
    sortBy,
    pathname,
    searchParams,
    filters.priceRange.min,
    filters.priceRange.max,
  ]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    switch (filterName) {
      case "brand":
        setBrand(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "dressType":
        setDressType(value);
        break;
      case "color":
        setColor(value);
        break;
      case "size":
        setSize(value);
        break;
      case "priceRange":
        setPriceRange(value);
        break;
    }
  };

  // Handle clearing specific filter
  const handleClearFilter = (filterName) => {
    handleFilterChange(filterName, "");
  };

  // Clear all filters
  const clearFilters = () => {
    setBrand("");
    setCategory("");
    setDressType("");
    setColor("");
    setSize("",)
    setPriceRange([filters.priceRange.min, filters.priceRange.max]);
    setSortBy("newest");

    // Keep search term if exists
    const params = new URLSearchParams();
    const search = searchParams.get("search");
    if (search) params.set("search", search);

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    router.push(url);
    // setIsSheetOpen(false);
  };// Current filters object for the controls component
  const currentFilters = {
    brand,
    category,
    dressType,
    color,
    size,
    priceRange,
    priceRangeMin: filters.priceRange.min,
    priceRangeMax: filters.priceRange.max,
  };
  return (
    <>

      {/* mobile filters */}
      <div className="lg:hidden bg absolute sm:top-36 top-38 sm:left-16 left-6">
        <Sheet>
          <SheetTrigger className="flex items-center text-gray-500 uppercase text-sm gap-1"><PanelLeftOpen className="text-gray-500" />Filters</SheetTrigger>
          <SheetContent side="left" className="overflow-y-auto px-5 sm:pt-28 pt-35">
            <SheetTitle className="text-2xl font-bold mt-1">FILTERS</SheetTitle>
            <div>
              <Select
                value={sortBy}
                onValueChange={(value) => {
                  setSortBy(value);
                  // Apply filters immediately when sort changes
                  setTimeout(() => applyFilters(), 0);
                }}
              >
                <SelectTrigger className="w-full mb-2">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: "newest", label: "Newest First" },
                    { value: "priceAsc", label: "Price: Low to High" },
                    { value: "priceDesc", label: "Price: High to Low" },
                  ].map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ShopFilterControls
                filters={filters}
                currentFilters={currentFilters}
                onFilterChange={handleFilterChange}
                onClearFilter={handleClearFilter}
              />
              <Button onClick={applyFilters} className="my-5 w-full">Apply Filter</Button>
            </div>
          </SheetContent>
        </Sheet>

      </div>


      {/* desktop filters */}
      <div className="lg:block hidden">
        <Select
          value={sortBy}
          onValueChange={(value) => {
            setSortBy(value);
            // Apply filters immediately when sort changes
            setTimeout(() => applyFilters(), 0);
          }}
        >
          <SelectTrigger className="w-full mb-4 ">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {[
              { value: "newest", label: "Newest First" },
              { value: "priceAsc", label: "Price: Low to High" },
              { value: "priceDesc", label: "Price: High to Low" },
            ].map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className=" w-60 border rounded-md px-5 py-2 hidden lg:block" >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold my-2">Filters</h1>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-sm text-gray-600"
              onClick={clearFilters}
            >
              <X className="mr-1 h-3 w-3" />
              Clear All
            </Button>
          )}
        </div>
        <Separator />
        <ShopFilterControls
          filters={filters}
          currentFilters={currentFilters}
          onFilterChange={handleFilterChange}
          onClearFilter={handleClearFilter}
        />
        <Button onClick={applyFilters} className="my-5 w-full">Apply Filter</Button>
      </div>

    </>
  )
}
export default ShopFilters