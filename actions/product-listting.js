"use server"

import { serializeProductData } from "@/lib/helpers";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
// import { revalidatePath } from "next/cache";


export async function toggleSavedproduct(productId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    // Check if product is already saved
    const existingSave = await db.userSaved.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    });

    // If product is already saved, remove it
    if (existingSave) {
      await db.userSaved.delete({
        where: {
          userId_productId: {
            userId: user.id,
            productId,
          },
        },
      });

      revalidatePath(`/wishlisted`);
      return {
        success: true,
        saved: false,
        message: "Product removed from cart",
      };
    }

    // If product is not saved, add it
    await db.userSaved.create({
      data: {
        userId: user.id,
        productId,
      },
    });

    // revalidatePath(`/saved-cars`);
    return {
      success: true,
      saved: true,
      message: "Product added to favorites",
    };
  } catch (error) {
    throw new Error("Error toggling saved product:" + error.message);
  }
}

export async function getProductById(productId) {
  try {
    // Get current user if authenticated
    const { userId } = await auth();
    let dbUser = null;

    if (userId) {
      dbUser = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    }

    // Get product details
    const product = await db.product.findUnique({
      where: { id: productId },
      include: { colors: true }
    });

    if (!product) {
      return {
        success: false,
        error: "Car not found",
      };
    }

    // Check if product is wishlisted by user
    let isWishlisted = false;
    if (dbUser) {
      const savedCar = await db.userSaved.findUnique({
        where: {
          userId_productId: {
            userId: dbUser.id,
            productId,
          },
        },
      });

      isWishlisted = !!savedCar;
    }

    return {
      success: true,
      data: {
        ...serializeProductData(product, isWishlisted)
      },
    };
  } catch (error) {
    throw new Error("Error fetching product details:" + error.message);
  }
}

export async function getWishlistedProducts() {
  try {
    const { userId } = await auth();
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

    // Get saved products with their details
    const savedProducts = await db.userSaved.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            colors: true,
          },
        },
      },

      orderBy: { savedAt: "desc" },
    });

    // Extract and format products data
    const products = savedProducts.map((saved) => serializeProductData(saved.product));

    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error("Error fetching saved products:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function getSaleProducts(limit = 12) {
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
        status: "AVAILABLE",
      },
      include: { colors: true },
      take: limit,
      orderBy: { discount: "desc" },
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

    console.log(serializedCars)
    return { data: serializedCars }
  } catch (error) {
    throw new Error("Error fetching featured cars:" + error.message);
  }
}

export async function getProductFilters() {
  try {

    // get unique brand name
    const brand = await db.product.findMany({
      where: { status: "AVAILABLE" },
      select: { brand: true },
      distinct: ["brand"],
      orderBy: { brand: "asc" }
    });

    // get unique category name
    const category = await db.product.findMany({
      where: { status: "AVAILABLE" },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" }
    });

    // get unique dress type name
    const dressType = await db.product.findMany({
      where: { status: "AVAILABLE" },
      select: { dressType: true },
      distinct: ["dressType"],
      orderBy: { dressType: "asc" }
    });

    const colors = await db.colorSection.findMany({
      select: { color : true},
      distinct: ["color"],
    });

    // get highest and lowest price
    const priceAggregations = await db.product.aggregate({
      where: { status: "AVAILABLE" },
      _min: { price: true },
      _max: { price: true },
    });

    return {
      success: true,
      data: {
        brand: brand.map((items) => items.brand),
        category: category.map((items) => items.category),
        dressType: dressType.map((items) => items.dressType),
        colors: colors.map((c) => c.color),
        priceRange: {
          min: priceAggregations._min.price,
          max: priceAggregations._max.price,
        },
      }
    };
  } catch (error) {
    throw new Error("Error fetching products filters:" + error.message);
  }

}

export async function getProducts({
  search="",
  color = "",
  size = "",
  brand = "",
  category = "",
  dressType = "",
  minPrice = 0,
  maxPrice = Number.MAX_SAFE_INTEGER,
  sortBy = "newest", // Options: newest, priceAsc, priceDesc
  page = 1,
  limit = 6,
}) {
  try {
    // Get current user if authenticated
    const { userId } = await auth();
    let dbUser = null;

    if (userId) {
      dbUser = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    }

    // Build where conditions
    let where = {
      status: "AVAILABLE",
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { dressType: { contains: search, mode: "insensitive" } },
      ];
    }

    if (brand) where.brand = { equals: brand, mode: "insensitive" };
    if (category) where.category = { equals: category, mode: "insensitive" };
    if (dressType) where.dressType = { equals: dressType, mode: "insensitive" };
    if (size) where.size = { equals: size, mode: "insensitive" };
    if (color) console.log(color, "color");

    // Add price range
    where.price = {
      gte: parseFloat(minPrice) || 0,
    };

    if (maxPrice && maxPrice < Number.MAX_SAFE_INTEGER) {
      where.price.lte = parseFloat(maxPrice);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Determine sort order
    let orderBy = {};
    switch (sortBy) {
      case "priceAsc":
        orderBy = { price: "asc" };
        break;
      case "priceDesc":
        orderBy = { price: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // Get total count for pagination
    const totalProduct = await db.product.count({ where });
    let product = []

    // Execute the main query
    if(color){
      const p = await db.product.findMany({
        include:{colors:true}
      })
      product = p.map(p => {
        return {
          ...p,
          colors:p.colors.filter(v => v.color === color)
        }
      }).filter(p => p.colors.length>0)
      console.log("cg", product)

    }
    else{
      product = await db.product.findMany({
      where,
      include:{colors:true},
      take: limit,
      skip,
      orderBy,
    });
    }

    // If we have a user, check which cars are wishlisted
    let wishlisted = new Set();
    if (dbUser) {
      const user = await db.userSaved.findMany({
        where: { userId: dbUser.id },
        select: { productId: true },
      });

      wishlisted = new Set(user.map((saved) => saved.productId));
    }

    // Serialize and check wishlist status
    const serializedProduct = product.map((product) =>
      serializeProductData(product, wishlisted.has(product.id))
    );

    return {
      success: true,
      data: serializedProduct,
      pagination: {
        total: totalProduct,
        page,
        limit,
        pages: Math.ceil(totalProduct / limit),
      },
    };
  } catch (error) {
    throw new Error("Error fetching products:" + error.message);
  }
}