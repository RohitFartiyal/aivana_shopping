"use client"

import { useEffect, useRef, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "./ui/input"
import useFetch from "@/hooks/use-fetch"
import { getProducts } from "@/actions/product"
import { useRouter } from "next/navigation"

const SearchBar = () => {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter();

  const wrapperRef = useRef(null)

  const { loading, fn: fetchCars, data: productData, error } = useFetch(getProducts)

  useEffect(() => {
    if (search.trim() !== "") {
      fetchCars(search)
    }
  }, [search])

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push(`/shop?search=${search}`)
    setSearch("")
    setIsOpen(false)
  }

  return (
    <form
      ref={wrapperRef}
      className="relative xl:w-[40%] lg:w-[35%] sm:w-[60%] w-[40%] flex items-center"
      onSubmit={handleSubmit}
    >
      <Input
        placeholder="Search"
        className="bg-neutral-100"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsOpen(true)}
      />
      <Search className="absolute right-3 w-5 h-5 text-gray-500" />

      {isOpen && productData?.data.length > 0 && search.length > 2 && (
        <div className="absolute top-12 left-0 w-full max-h-60 overflow-auto border bg-white z-10 shadow-md rounded-md">
          {productData?.data.map((item, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                router.push(`/shop/${item.id}`)
                setSearch("")
                setIsOpen(false)
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </form>
  )
}

export default SearchBar
