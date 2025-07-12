import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, HandCoins, PiggyBank, Shirt, ShoppingBag, ShoppingBasket, TrendingUp, Wallet } from "lucide-react";
import { getDashboardData } from "@/actions/admin";

const Dashboard = async() => {
const dashData = await getDashboardData()
const totalBank = dashData.data.order.bank.reduce((acc, curr) => acc + curr.total, 0);
const totalCash = dashData.data.order.cash.reduce((acc, curr) => acc + curr.total, 0);
const totalCollection = dashData.data.order.totalCollection.reduce((acc, curr) => acc + curr.total, 0);
console.log(dashData)
console.log(totalBank)
console.log(totalCash)
  return (
    <div className="space-y-6 sm:px-0 px-1">
      {/* <h1 className="text-3xl font-bold text-gray-800 mb-2">DashBoard</h1> */}
      <Tabs defaultValue="overview" className="mt-3" >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transiction">Transiction</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6 mt-1">

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <Shirt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashData.data.product.total}</div>
                <p className="text-xs text-muted-foreground">
                  {dashData.data.product.available} available, {dashData.data.product.unavailable} unavailable
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashData.data.order.total}</div>
                <p className="text-xs text-muted-foreground">
                  {dashData.data.order.pending} pending, {dashData.data.order.cancelled} cancelled
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Conversion Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashData.data.order.conversionRate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  From Orders to sales
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Product Sold</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashData.data.order.sold}</div>
                <p className="text-xs text-muted-foreground">
                  {dashData.data.order.orderRate}% of Ordres pending
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Overview Content */}
          <Card>
            <CardHeader>
              <CardTitle>Shop Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-sm mb-2">Product Inventory</h3>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{
                            width: `${dashData.data.order.inventoryRate}%`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm">
                        {dashData.data.order.inventoryRate}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Available inventory capacity
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-sm mb-2">
                      Test Drive Success
                    </h3>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${dashData.data.order.orderConfirm}%`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm">
                        {dashData.data.order.orderConfirm}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Orders delivered succesfully
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-blue-600">
                      {dashData.data.order.sold}
                    </span>
                    <p className="sm:text-sm text-xs text-gray-600 mt-1">Products Sold</p>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-amber-600">
                      {dashData.data.order.pending}
                    </span>
                    <p className="sm:text-sm text-xs text-gray-600 mt-1">
                      Upcoming Orders
                    </p>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-green-600">
                      {`${Number(dashData.data.order.inventoryRate).toFixed(0)}%`}


                    </span>
                    <p className="sm:text-sm text-xs text-gray-600 mt-1">
                      Inventory Utilization
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </TabsContent>
        
        
        {/* Test Drives Tab */}
        <TabsContent value="transiction" className="space-y-6 mt-1">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Collection
                </CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalCollection}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cash Collection</CardTitle>
                <HandCoins className="h-4 w-4 text-amber-500" />
              </CardHeader> 
              <CardContent>
                <div className="text-2xl font-bold">₹{totalCash}</div>
                <p className="text-xs text-muted-foreground">
                  Post Paid collection
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bank Collection</CardTitle>
                <PiggyBank className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalBank}</div>
                <p className="text-xs text-muted-foreground">
                  Pre Paid collection
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{dashData.data.order.bank.length}</div>
              </CardContent>
            </Card>
          </div>



          {/* Test Drive Status Visualization */}
          <Card className="mb-10">
            <CardHeader>
              <CardTitle>Orders Statistics</CardTitle>
            </CardHeader>
            <CardContent >
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
                  {/* Conversion Rate Card */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">
                      Pre Paid orders
                    </h3>
                    <div className="text-3xl font-bold text-blue-600">
                      {dashData.data.order.bank.length/dashData.data.order.totalCollection.length*100}%
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Orders resulting in cash-less purchases
                    </p>
                  </div>

                  {/* Test Drive Success Rate */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">
                      Post Paid orders
                    </h3>
                    <div className="text-3xl font-bold text-green-600">
                      {dashData.data.order.cash.length/dashData.data.order.totalCollection.length*100}%
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Orders resulting in Cash purchases
                    </p>
                  </div>
                </div>

                {/* Status Breakdown */}
                <div className="space-y-4 my-4">
                  <h3 className="font-medium">Orders Status Breakdown</h3>

                  {/* Pending */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Pending</span>
                      <span className="font-medium">
                        {dashData.data.order.pending} (
                        {(
                          (dashData.data.order.pending / dashData.data.order.total) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-amber-500 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (dashData.data.order.pending / dashData.data.order.total) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Confirmed */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Confirmed</span>
                      <span className="font-medium">
                        {dashData.data.order.confirmed} (
                        {(
                          (dashData.data.order.confirmed / dashData.data.order.total) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (dashData.data.order.confirmed / dashData.data.order.total) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Completed */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Shipped</span>
                      <span className="font-medium">
                        {dashData.data.order.shippd} (
                        {(
                          (dashData.data.order.shippd / dashData.data.order.total) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (dashData.data.order.shippd / dashData.data.order.total) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Cancelled */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cancelled</span>
                      <span className="font-medium">
                        {dashData.data.order.cancelled} (
                        {(
                          (dashData.data.order.cancelled / dashData.data.order.total) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-red-500 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (dashData.data.order.cancelled / dashData.data.order.total) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* No Show */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Delivered</span>
                      <span className="font-medium">
                        {dashData.data.order.sold} (
                        {((dashData.data.order.sold / dashData.data.order.total) * 100).toFixed(
                          1
                        )}
                        %)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gray-500 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (dashData.data.order.sold / dashData.data.order.total) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
        </TabsContent>
      </Tabs>
    </div>
  )
}
export default Dashboard
