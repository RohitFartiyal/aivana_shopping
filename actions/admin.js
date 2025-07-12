"use server"

// export async function getOrders({search="", status=""}){
//     try {
//         const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

//     // Verify admin status
//     const user = await db.user.findUnique({
//       where: { clerkUserId: userId },
//     });

//     if (!user || user.role !== "ADMIN") {
//       throw new Error("Unauthorized access");
//     }

//     // Build where conditions
//     let where = {};

//     // Add status filter
//     if (status) {
//       where.status = status;
//     }

//     // Add search filter
//     if (search) {
//       where.OR = [
//         {
//           product: {
//             OR: [
//               { name: { contains: search, mode: "insensitive" } },
//               { brand: { contains: search, mode: "insensitive" } },
//             ],
//           },
//         },
//         {
//           user: {
//             OR: [
//               { name: { contains: search, mode: "insensitive" } },
//               { email: { contains: search, mode: "insensitive" } },
//             ],
//           },
//         },
//       ];
//     }
//     } catch (error) {

//     }
// }

// export async function getAllShopping({search = "", status = ""}) {
//   try {

//     // Build where conditions
//     let where = {};

//     // Add status filter
//     if (status) {
//       where.status = status;
//     }

//     // Add search filter
//     if (search) {
//       where.OR = [
//         {
//           items: {
//             OR: [
//               { name: { contains: search, mode: "insensitive" } },
//             ],
//           },
//         },
//         {
//           user: {
//             OR: [
//               { name: { contains: search, mode: "insensitive" } },
//               { email: { contains: search, mode: "insensitive" } },
//             ],
//           },
//         },
//       ];
//     }


//     const shoppingList = await db.shopping.findMany({
//       orderBy: {
//         createdAt: "desc",
//       },
//       include: {
//         items: {
//           include: true,
//         },
//         user: {
//           select: {
//             id: true,
//             email: true,
//             name: true,
//           },
//         },
//       },
//     });

//     return shoppingList;
//   } catch (error) {
//     console.error("Error fetching shopping list:", error);
//     throw new Error("Failed to get shopping list");
//   }
// }

export async function getAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  // If user not found in our db or not an admin, return not authorized
  if (!user || user.role !== "ADMIN") {
    return { authorized: false, reason: "not-admin" };
  }

  return { authorized: true, user };
}

export async function getAllShopping({ search = "", status = ""}) {
  try {
    // Build where conditions
    const where = {};

    // Add status filter
    if (status) {
      where.status = status;
    }

    // Add search filter
    if (search) {
      where.OR = [
        {
          items: {
            some: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        },
        {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    const shoppingList = await db.shopping.findMany({
      where, // <-- use the built filter here
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: true, // include all items
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      shoppingList
    };
  } catch (error) {
    console.error("Error fetching shopping list:", error);
    throw new Error("Failed to get shopping list");
  }
}



export async function updateShopping(shoppingId, newStatus) {
  try {
    // const a = await auth();
    // const adminId = a.userId
    // if (!adminId) throw new Error("Unauthorized");

    // // Check if user is admin
    // const adminUser = await db.user.findUnique({
    //   where: { clerkUserId: adminId },
    // });

    // if (!adminUser || adminUser.role !== "ADMIN") {
    //   throw new Error("Unauthorized: Admin access required");
    // }

    // Get the order
    const order = await db.shopping.findUnique({
      where: { id: shoppingId },
    });

    if (!order) {
      throw new Error("order not found");
    }

    // Validate status
    const validStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DEVLIVERED", "CANCELED"];

    if (!validStatuses.includes(newStatus)) {
      return {
        success: false,
        error: "Invalid status",
      };
    }

    // Update status
    await db.shopping.update({
      where: { id: shoppingId },
      data: { status: newStatus },
    });

    // Revalidate paths
    // revalidatePath("/admin/test-drives");
    // revalidatePath("/reservations");

    return {
      success: true,
      message: "Test drive status updated successfully",
    };
  } catch (error) {
    throw new Error("Error updating test drive status:" + error.message);
  }
}

export async function cancelOrder(orderId) {
  try {
    // const a = await auth();
    // const adminId = a.userId
    // if (!adminId) throw new Error("Unauthorized");

    // // Check if user is admin
    // const adminUser = await db.user.findUnique({
    //   where: { clerkUserId: adminId },
    // });

    // if (!adminUser || adminUser.role !== "ADMIN") {
    //   throw new Error("Unauthorized: Admin access required");
    // }

    // Get the order
    const order = await db.shopping.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return {
        success: false,
        error: "shopping not found",
      };
    }

    // Check if user owns this order
    // if (order.userId !== user.id || user.role !== "ADMIN") {
    //   return {
    //     success: false,
    //     error: "Unauthorized to cancel this order",
    //   };
    // }

    // Check if order can be cancelled
    if (order.status === "CANCELED") {
      return {
        success: false,
        error: "order is already cancelled",
      };
    }

    if (order.status === "COMPLETED") {
      return {
        success: false,
        error: "Cannot cancel a completed order",
      };
    }

    // Update the order status
    await db.shopping.update({
      where: { id: orderId },
      data: { status: "CANCELED" },
    });

    // Revalidate paths
    // revalidatePath("/reservations");
    // revalidatePath("/admin/test-drives");

    return {
      success: true,
      message: "Order cancelled successfully",
    };
  } catch (error) {
    console.error("Error cancelling order:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function deleteOrder(orderId) {
  try {
    // const a = await auth();
    // const adminId = a.userId
    // if (!adminId) throw new Error("Unauthorized");

    // // Check if user is admin
    // const adminUser = await db.user.findUnique({
    //   where: { clerkUserId: adminId },
    // });

    // if (!adminUser || adminUser.role !== "ADMIN") {
    //   throw new Error("Unauthorized: Admin access required");
    // }

    // Get the order
    const order = await db.shopping.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return {
        success: false,
        error: "shopping not found",
      };
    }

    // Check if user owns this order
    // if (order.userId !== user.id || user.role !== "ADMIN") {
    //   return {
    //     success: false,
    //     error: "Unauthorized to cancel this order",
    //   };
    // }



    // Update the order status
    await db.shopping.delete({
      where: { id: orderId },
    });

    // Revalidate paths
    // revalidatePath("/reservations");
    // revalidatePath("/admin/test-drives");

    return {
      success: true,
      message: "Order Deleted successfully",
    };
  } catch (error) {
    console.error("Error Deleting order:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Get all users
export async function getUsers() {
  try {
    const a = await auth();
    const userId = a.userId
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Get the user from our database
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Get all users
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    throw new Error("Error fetching users:" + error.message);
  }
}

export async function updateUserRole(userId, role) {
  try {
    const a = await auth();
    const adminId = a.userId
    if (!adminId) throw new Error("Unauthorized");

    // Check if user is admin
    const adminUser = await db.user.findUnique({
      where: { clerkUserId: adminId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Unauthorized: Admin access required");
    }

    // Update user role
    await db.user.update({
      where: { id: userId },
      data: { role },
    });

    // Revalidate paths
    revalidatePath("/admin/setting");

    return {
      success: true,
    };
  } catch (error) {
    throw new Error("Error updating user role:" + error.message);
  }
}


export async function getDashboardData() {
  try {
    // const a = await auth();
    // const adminId = a.userId
    // if (!adminId) throw new Error("Unauthorized");

    // // Check if user is admin
    // const adminUser = await db.user.findUnique({
    //   where: { clerkUserId: adminId },
    // });

    // if (!adminUser || adminUser.role !== "ADMIN") {
    //   throw new Error("Unauthorized: Admin access required");
    // }

    // Fetch all necessary data in a single parallel operation
    const [product, shopping] = await Promise.all([
      // Get all cars with minimal fields
      db.product.findMany(),

      // Get all test drives with minimal fields
      db.shopping.findMany(),
    ]);

    // Calculate car statistics
    const totalProduct = product.length;
    const availableProducts = product.filter(
      (product) => product.status === "AVAILABLE"
    ).length;
    const unavailableProduct = totalProduct - availableProducts;

    // Calculate test drive statistics
    const totalOrder = shopping.length;
    const pendingOrder = shopping.filter(
      (td) => td.status === "PENDING"
    ).length;
    const confirmedOrder = shopping.filter(
      (td) => td.status === "CONFIRMED"
    ).length;
    const shippedOrder = shopping.filter(
      (td) => td.status === "SHIPPED"
    ).length;
    const cancelledOrder = shopping.filter(
      (td) => td.status === "CANCELED"
    ).length;
    const deliveredOrder = shopping.filter(
      (td) => td.status === "DEVLIVERED"
    ).length;

    const cashOrders = shopping.filter(
      (td) => td.payment === "CASH"
    ).length;

    const bankOrders = shopping.filter(
      (td) => td.payment === "NET_BANKING"
    ).length;

    const cash = shopping.filter(
      (td) => td.payment === "CASH" && td.status === "DEVLIVERED"
    );

    const bank = shopping.filter(
      (td) => td.payment === "NET_BANKING" && td.status === "DEVLIVERED"
    );

    const totalCollection = shopping.filter(
      (td) => td.status === "DEVLIVERED"
    );

    // Calculate test drive conversion rate
    const completedTestDriveCarIds = shopping
      .filter((td) => td.payment === "COMPLETED")
      .map((td) => td.carId);

    // const soldCarsAfterTestDrive = cars.filter(
    //   (car) =>
    //     car.status === "SOLD" && completedTestDriveCarIds.includes(car.id)
    // ).length;

    const conversionRate =
      totalOrder > 0
        ? (deliveredOrder / totalOrder) * 100
        : 0;

    const orderPendingRate = ((pendingOrder / totalOrder) * 100).toFixed(1)
    const orderConfirmedRate = ((deliveredOrder / totalOrder) * 100).toFixed(0)
    const inventoryRate = ((availableProducts / totalProduct) * 100).toFixed(1)


    return {
      success: true,
      data: {
        product: {
          total: totalProduct,
          available: availableProducts,
          unavailable: unavailableProduct,
        },
        order: {
          total: totalOrder,
          pending: pendingOrder,
          confirmed: confirmedOrder,
          shippd: shippedOrder,
          cancelled: cancelledOrder,
          sold: deliveredOrder,
          orderRate: orderPendingRate,
          orderConfirm: orderConfirmedRate,
          inventoryRate: inventoryRate,
          CashOrders: cashOrders,
          bankOrders: bankOrders,
          bank: bank,
          cash: cash,
          totalCollection: totalCollection,
          conversionRate: parseFloat(conversionRate.toFixed(2)),
        },
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}