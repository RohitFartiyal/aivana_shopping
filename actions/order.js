'use server'

import { db } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import Stripe from 'stripe'
// import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function saveOrder(sessionId) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // const userId = session.metadata.userId
    const cartItems = JSON.parse(session.metadata.cart)
    const cartData = JSON.parse(session.metadata.userCart)
    // const deliveryCharge = parseInt(session.metadata.deliveryCharge || '0', 10)


    console.log(session.metadata.userId, "jjjjjjjjjjjj")
    console.log("jj", cartItems)


    const order = await db.shopping.create({
      data: {
        items: {
          createMany: {
            data: cartItems.map((item) => ({
              name: item.name,
              brand: item.brand,
              discount: item.discount,
              size: item.size,
              price:item.price,
              image: item.image,
              color: item.color,
              quantity: item.quantity,
            })),
          },
        },
        subTotal: cartData.subTotal,
        discount: cartData.discount,
        delivery: cartData.delivery,
        total: cartData.total,
        country: cartData.country,
        // userName:cartData.userName,
        phone: cartData.phone,
        payment: "NET_BANKING",
        shippingAddress: cartData.shippingAddress,
        userId: session.metadata.userId,
        Username: cartData.userName,
        buyingDate: new Date(),



      },
    })

    await db.userCart.deleteMany({
      where: { userId: session.metadata.userId },
    });
    revalidatePath("/checkout/success")

    return { success: true }
  } catch (error) {
    console.error('Saving order failed:', error)
    throw new Error('Could not save order')
  }
}

export async function saveOrderCash(cartItems, cartData) {
  try {


    const order = await db.shopping.create({
      data: {
        items: {
          createMany: {
            data: cartItems.map((item) => ({
              name: item.name,
              brand: item.brand,
              discount: item.discount,
              size: item.size,
              price:item.price,
              image: item.image,
              color: item.color,
              quantity: item.quantity,
            })),
          },
        },
        subTotal: cartData.subTotal,
        discount: cartData.discount,
        delivery: cartData.delivery,
        total: cartData.total,
        country: cartData.country,
        phone: cartData.phone,
        payment: "CASH",
        shippingAddress: cartData.shippingAddress,
        userId: cartItems[0].userId,
        Username: cartData.userName,
        buyingDate: new Date(),



      },
    })

    await db.userCart.deleteMany({
      where: { userId: cartItems[0].userId },
    });
    revalidatePath("/cart")

    return { success: true }
  } catch (error) {
    console.error('Saving order failed:', error)
    throw new Error('Could not save order')
  }
}



export async function getAllShoppingForUser() {
  try {
    const a = await auth();
    const clerkUserId = a.userId;
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) throw new Error("User not found");

    const shoppingList = await db.shopping.findMany({
      where: {
        userId: user.id, // only fetch shopping orders belonging to this user
      },
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
      shoppingList,
    };
  } catch (error) {
    console.error("Error fetching shopping list for user:", error);
    throw new Error("Failed to get shopping records");
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

