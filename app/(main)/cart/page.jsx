import CartListting from "./components/Cart-listting"

export async function generateMetadata() {
  return {
    title: `Cart | AIvana`,
    description: `Manage products in your cart`,
  };
}

const CartPage = () => {
  return (
    <div className="lg:mt-20 mt-34 sm:mx-20 mx-5"><CartListting/></div>
  )
}
export default CartPage