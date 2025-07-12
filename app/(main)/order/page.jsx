import OrderPage from "./components/Orders"

export async function generateMetadata() {
  return {
    title: `Orders | AIvana`,
    description: `Manage orders in your cart`,
  };
}

const page = () => {
  return (
    <div className="sm:mx-10 mx-2 lg:mt-20 mt-32"><OrderPage/></div>
  )
}
export default page