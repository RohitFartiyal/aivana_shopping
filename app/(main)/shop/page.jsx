
import ProductCard from "@/components/card"
import ShopFilters from "./_components/shopFilters"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getProductFilters } from "@/actions/product-listting"
import ProductListting from "./_components/productListting"

export async function generateMetadata() {
  return {
    title: `Shop | AIvana`,
    description: `AIvana shop`,
  };
}



const page = async () => {


  const filtersData = await getProductFilters()

  return (
    <div className="lg:pt-22 pt-25 mx-5">


      <div className="lg:flex lg:pt-4 lg:gap-4">
        <div>
          <ShopFilters filters={filtersData.data} />
        </div>

        <div className="w-full lg:px-5 sm:px-10 px-1">
          <ProductListting />
        </div>
      </div>
    </div>
  )
}
export default page