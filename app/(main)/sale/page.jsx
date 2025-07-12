

import { getSaleProducts } from "@/actions/product-listting"
import DiscountProducts from "./components/discountProducts"

export async function generateMetadata() {
  return {
    title: `Sale | AIvana`,
    description: `Product with discount`,
  };
}


const page = async() => {
    const products = await getSaleProducts()
    console.log("sale", products)
  return (
    <div className="lg:mt-15 mt-36 mx-5">
        <h2 className="text-3xl text-gray-800 font-extrabold uppercase mt-25">products on sale</h2>
        <DiscountProducts initialData={products}/>
    </div>
  )
}
export default page