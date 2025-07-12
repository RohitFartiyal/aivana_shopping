import OrdersManagement from "../components/ordersManagement"

export async function generateMetadata() {
  return {
    title: `Orders | AIvana Admin`,
    description: `Manage orders in your website`,
  };
}

const OrdersPage = () => {
  return (
    <div>
        {/* <h1>Orders Management</h1> */}
        <OrdersManagement/>
    </div>
  )
}
export default OrdersPage