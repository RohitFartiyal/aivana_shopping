import { getWishlistedProducts } from "@/actions/product-listting";
import SavedProductList from "./components/save-product-list";

export async function generateMetadata() {
  return {
    title: `Wishlisted | AIvana`,
    description: `Product saved by user`,
  };
}

const SavedProducts = async() => {

    // Fetch saved cars on the server
  const savedProducts = await getWishlistedProducts();
  console.log("save", savedProducts)
  return (
    <div className="lg:mt-30 mt-36 mx-10">
      <SavedProductList initialData={savedProducts} />
    </div>
  )
}
export default SavedProducts