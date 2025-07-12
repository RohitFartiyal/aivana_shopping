import { AddProductForm } from "./components/add-product-form";


export const metadata = {
  title: "Add New Product | AIvana Admin",
  description: "Add a new product to the marketplace",
};

export default function AddProductPage() {
  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-bold mb-6">Add New Car</h1> */}
      <AddProductForm />
    </div>
  );
}
