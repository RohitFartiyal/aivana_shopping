"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { CircleCheck, X } from "lucide-react"
import { useEffect, useState } from "react"

const ShopFilterControls = ({
  filters,
  currentFilters,
  onFilterChange,
  onClearFilter,
}) => {

  const normalizedColors = filters?.colors
    .filter(color => color.trim() !== "") // remove empty strings
    .map(color => color.charAt(0).toUpperCase() + color.slice(1).toLowerCase());


  const uniqueColors = [...new Set(normalizedColors)];

  const { brand, category, dressType, color, size, priceRange } = currentFilters;

  const sizes = ["XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "3X-Large", "4X-Large",];

  const [selectedSize, setSelectedSize] = useState(size)
  const [selectedColor, setSelectedColor] = useState(color)

  const handelColorSelect = (color) => {
    setSelectedColor(color === selectedColor ? null : color)
  }
  const handleSelect = (size) => {
    setSelectedSize(size === selectedSize ? null : size)
  }

  useEffect(() => {
    onFilterChange("size", selectedSize),
      onFilterChange("color", selectedColor)
  }, [selectedSize, selectedColor])


  return (
    <div className="lg:px-0 px-2">

      <div>
        <div className="lg:py-4">
          <div className="flex items-center">
            <h1 className="text-lg font-bold mb-2">Category</h1>
          </div>
          <Accordion type="single" collapsible >

            {filters?.category.map((filter, idx) => (
              <AccordionItem value={`items-${idx + 1}`} key={idx}>
                <AccordionTrigger className="text-md font-medium text-gray-800">{filter}</AccordionTrigger>
                {filters.brand.map((brand, id) => (
                  <AccordionContent
                    key={id}
                    className="cursor-pointer sm:text-sm text-xs text-gray-500 uppercase"
                    onClick={() => {
                      onFilterChange("category", filter)
                      onFilterChange("brand", brand)
                    }}
                  >{brand}</AccordionContent>
                ))}

              </AccordionItem>
            ))}

          </Accordion>

        </div>
        <Separator />

        <div className="py-4">
          <div>
            <h1 className="text-lg font-bold mb-2">Prices</h1>
          </div>
          <Slider
            min={filters.priceRange.min}
            max={filters.priceRange.max}
            step={100}
            value={priceRange}
            onValueChange={(value) => onFilterChange("priceRange", value)}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="font-medium text-sm">₹ {priceRange[0]}</div>
            <div className="font-medium text-sm">₹ {priceRange[1]}</div>
          </div>
        </div>
        <Separator />

        <div className="py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold mb-2">Colors</h1>
            {selectedColor && (
              <button
                className="text-xs text-gray-600 flex items-center cursor-pointer"
                onClick={() => {
                  onClearFilter("color")
                  setSelectedColor(null)
                }}
              >
                <X className="mr-1 h-3 w-3" />
                Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-5 gap-2  items-center justify-between">
            {uniqueColors.map((colorName) => (
              <div className="flex items-center justify-center border-3 text-white w-8 h-8 rounded-full hover:opacity-60 transition duration-200 cursor-pointer"
                key={colorName}
                style={{ backgroundColor: colorName }}
                onClick={() => handelColorSelect(colorName)}
              >
                {colorName === color
                  ? <CircleCheck />
                  : ""
                }
              </div>
            ))}
          </div>
        </div>
        <Separator />

        <div className="py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold mb-2">Size</h1>
            {selectedSize && (
              <button
                className="text-xs text-gray-600 flex items-center cursor-pointer"
                onClick={() => {
                  onClearFilter("size")
                  setSelectedSize(null)
                }}
              >
                <X className="mr-1 h-3 w-3" />
                Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2  items-center justify-between">
            {sizes.map((sizee) => (
              <Badge
                key={sizee}
                onClick={() => handleSelect(sizee)}
                className={`py-2 px-4 text-sm cursor-pointer ${sizee === size
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-foreground"
                  }`}
              >
                {sizee}
              </Badge>
            ))}
          </div>
        </div>
        <Separator />

        <div className="py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold mb-2">Dress Style</h1>
            {brand && (
              <button
                className="text-xs text-gray-600 flex items-center cursor-pointer"
                onClick={() => {
                  onClearFilter("dressType")
                  onClearFilter("brand")
                }}
              >
                <X className="mr-1 h-3 w-3" />
                Clear
              </button>
            )}
          </div>
          <Accordion type="single" collapsible >
            {filters?.dressType.map((filter, idx) => (
              <AccordionItem value={`items-${idx + 1}`} key={idx}>
                <AccordionTrigger>{filter}</AccordionTrigger>
                {filters.brand.map((brand, id) => (
                  <AccordionContent
                    key={id}
                    className="cursor-pointer"
                    onClick={() => {
                      onFilterChange("dressType", filter)
                      onFilterChange("brand", brand)
                    }}
                  >{brand}</AccordionContent>
                ))}

              </AccordionItem>
            ))}
          </Accordion>

        </div>



      </div></div>
  )
}
export default ShopFilterControls