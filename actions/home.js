"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

function serializeProductData(product, wishlisted = false) {
  return {
    ...product,
      ratting: product.ratting ? parseFloat(product.ratting.toString()) : 0,
      createdAt: product.createdAt?.toISOString(),
      updatedAt: product.updatedAt?.toISOString(),
      wishlisted: wishlisted,
  };
}

export async function getFeaturedProduct(limit = 6) {
  try {

    // Get current user if authenticated
        const { userId } = await auth();
        let dbUser = null;
    
        if (userId) {
          dbUser = await db.user.findUnique({
            where: { clerkUserId: userId },
          });
        }

    const product = await db.product.findMany({
      where: {
        featured: true,
        status: "AVAILABLE",
      },
      include:{colors:true},
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    

     // If we have a user, check which cars are wishlisted
        let wishlisted = new Set();
        if (dbUser) {
          const savesProduct = await db.userSaved.findMany({
            where: { userId: dbUser.id },
            select: { productId: true },
          });
    
          wishlisted = new Set(savesProduct.map((saved) => saved.productId));
        }
        // console.log("wish", wishlisted)
    
        // Serialize and check wishlist status
        const serializedCars = product.map((product) =>
          serializeProductData(product, wishlisted.has(product.id))
        );

    return {data: serializedCars}
  } catch (error) {
    throw new Error("Error fetching featured cars:" + error.message);
  }
}

export async function getLatestProduct(limit = 6) {
  try {
    // Get current user if authenticated
    const { userId } = await auth();
    let dbUser = null;

    if (userId) {
      dbUser = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    }

    // Fetch latest available products
    const products = await db.product.findMany({
      where: {
        status: "AVAILABLE",
      },
      include: { colors: true },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    // If we have a user, check which products are wishlisted
    let wishlisted = new Set();
    if (dbUser) {
      const savedProducts = await db.userSaved.findMany({
        where: { userId: dbUser.id },
        select: { productId: true },
      });
      wishlisted = new Set(savedProducts.map((saved) => saved.productId));
    }

    // Serialize and check wishlist status
    const serializedProducts = products.map((product) =>
      serializeProductData(product, wishlisted.has(product.id))
    );

    return { data: serializedProducts };
  } catch (error) {
    throw new Error("Error fetching latest products: " + error.message);
  }
}
