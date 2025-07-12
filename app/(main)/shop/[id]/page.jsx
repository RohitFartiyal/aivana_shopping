import { getProductById } from "@/actions/product-listting";
import Productdetails from "./components/product-details";

export async function generateMetadata() {
  return {
    title: `Product | AIvana`,
    description: `AIvana Product`,
  };
}


export default async function ProductDetailsPage({ params }) {
    const { id } = await params;
    const result = await getProductById(id);
    console.log(result,"kk")

    return(
        <div className="sm:mx-10 mx-5 ">
            <Productdetails product={result.data}/>
        </div>
    )
    
}