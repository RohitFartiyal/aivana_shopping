import ProductListting from "./components/product-listting"

export async function generateMetadata() {
  return {
    title: `Products | AIvana Admin`,
    description: `Manage products in your website`,
  };
}

const page = () => {
  return (
    <div>
      <ProductListting/>
    </div>
  )
}
export default page