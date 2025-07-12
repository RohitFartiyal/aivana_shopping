"use server";

import { serializeProductData } from "@/lib/helpers";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// export async function addToCart(cartData) {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     const user = await db.user.findUnique({
//       where: { clerkUserId: userId },
//     });
//     console.log("uu",user)

//     if (!user) throw new Error("User not found");

//     const a = await db.userCart.create({
//       data: {
//         userId: user.id,
//         size: cartData.size,
//         color: cartData.color,
//         quantity: cartData.quantity,
//         image: cartData.image,
//         productId: cartData.productId,
//       }
//     })
//     return {
//       success: true,
//       data: a
//     }
//   } catch (error) {
//     throw new Error("Error adding car:" + error.message);
//   }
// }

export async function addToCart(cartData) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // ✅ Check if the same order already exists
    const existingCartItem = await db.userCart.findFirst({
      where: {
        userId: user.id,
        productId: cartData.productId,
        size: cartData.size,
        color: cartData.color,
      },
    });

    if (existingCartItem) {
      // If found, return with a message
      return {
        success: false,
        message: "Order already exists in your cart",
        data: existingCartItem
      };
    }

    //  If not found, create the new cart item
    const a = await db.userCart.create({
      data: {
        userId: user.id,
        size: cartData.size,
        color: cartData.color,
        quantity: cartData.quantity,
        image: cartData.image,
        productId: cartData.productId,
      }
    })
    return {
      success: true,
      data: a
    }
  } catch (error) {
    throw new Error("Error adding to cart: " + error.message);
  }
}


export async function getCart() {
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

    console.log(userId, "hjjjjjjj")

    const cart = await db.userCart.findMany({
      where: { userId: user.id },
      include: {
        product: { // assuming your cart item has a relation to 'product'
          select: {
            id: true,
            name: true,
            brand: true,
            price: true,
            discount: true
          },
        },
      }
    });
    const serializedProduct = cart.map(serializeProductData)
    return {
      success: true,
      data: serializedProduct
    }
  } catch (error) {
    throw new Error("Error toggling saved product:" + error.message);
  }
}

export async function updateCart(id, { quantity }) {
  try {

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    const updateData = {};

    if (!user) throw new Error("User not found");

    if (quantity !== undefined) {
      updateData.quantity = quantity;
    }

    await db.userCart.update({
      where: {
        userId_productId: {
          userId: user.id,
          productId: id
        }
      },
      data: updateData
    });
    revalidatePath("/cart");
    return {
      success: true,
    }
  } catch (error) {
    throw new Error("Error updating product:" + error.message);
  }

}

export async function deleteCartItem(productId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    await db.userCart.delete({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    });

    revalidatePath("/cart");

    return { success: true, message: "Item deleted from cart" };
  } catch (error) {
    throw new Error("Error deleting cart item: " + error.message);
  }
}


