"use server"

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/prisma";
import { createClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { serializeProductData } from "@/lib/helpers";

export async function addProduct(productData) {

  try {
    const a = await auth();
    const userId = a.userId
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Create a unique folder name for this car's images
    const productId = uuidv4();

    // Initialize Supabase client for server-side operations
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Upload all images to Supabase storage
    const imageUrls = {};

    for (let i = 0; i < productData.colors.length; i++) {
      for (let j = 0; j < productData.colors[i].images.length; j++) {
        const base64Data = productData.colors[i].images[j];

        // Skip if image data is not valid
        if (!base64Data || !base64Data.startsWith("data:image/")) {
          console.warn("Skipping invalid image data");
          continue;
        }

        // Extract the base64 part (remove the data:image/xyz;base64, prefix)
        const base64 = base64Data.split(",")[1];
        const imageBuffer = Buffer.from(base64, "base64");

        // Determine file extension from the data URL
        const mimeMatch = base64Data.match(/data:image\/([a-zA-Z0-9]+);/);
        const fileExtension = mimeMatch ? mimeMatch[1] : "jpeg";

        // Create filename
        const folderPath = `product/${productId}/${productData.colors[i].color}`;
        const fileName = `image-${Date.now()}-${j}.${fileExtension}`;
        const filePath = `${folderPath}/${fileName}`;

        // Upload the file buffer directly
        const { data, error } = await supabase.storage
          .from("img")
          .upload(filePath, imageBuffer, {
            contentType: `image/${fileExtension}`,
          });

        if (error) {
          console.error("Error uploading image:", error);
          throw new Error(`Failed to upload image: ${error.message}`);
        }

        // Get the public URL for the uploaded file
        const color = productData.colors[i].color;
        const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/img/${filePath}`; // disable cache in config

        if (!imageUrls[color]) {
          imageUrls[color] = []; // initialize array if not already present
        }

        imageUrls[color].push(publicUrl);
      }

    }


    // if (imageUrls.length === 0) {
    //   throw new Error("No valid images were uploaded");
    // }

    // Add the car to the database
    const product = await db.product.create({
      data: {
        id: productId, // Optional: Prisma will auto-generate if not passed
        name: productData.name,
        brand: productData.brand,
        price: productData.price,
        ratting: productData.ratting,
        discount: productData.discount, // Optional field
        category: productData.category,
        dressType: productData.dressType,
        description: productData.description,
        status: productData.status, // Should be one of the enum values
        featured: productData.featured,
        // Array of image URLs uploaded to Supabase

        // Add related colors, assuming productData.colors is in this shape:
        // [{ color: "red", images: ["url1", "url2"] }, ...]
        colors: {
          create: productData.colors.map((colorObj) => ({
            color: colorObj.color,
            size: colorObj.sizes, // Array of strings
            images: imageUrls[colorObj.color] || [],
          }
          )),
        },
      },
    });


    // Revalidate the cars list page
    revalidatePath("/admin/new");

    return {
      success: true,
    };
  } catch (error) {
    throw new Error("Error adding car:" + error.message);
  }
}


export async function getProducts(search = "") {
  try {

    // Build where conditions
    let where = {};

    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { dressType: { contains: search, mode: "insensitive" } },
      ];
    }


    // Execute the main query
    const product = await db.product.findMany({
      where,
      include: {
        colors: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Serialize and check wishlist status
    const serializedProduct = product.map(serializeProductData);

    return {
      success: true,
      data: serializedProduct
    };
  } catch (error) {
    throw new Error("Error fetching product:" + error.message);
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
    // Execute the main query
    const product = await db.colorSection.findMany({
      orderBy: { createdAt: "desc" },
      productId: productId,
      include: {
        product: true
      }
    });


    return {
      success: true,
      data: product
    };
  } catch (error) {
    throw new Error("Error fetching cars:" + error.message);
  }
}

export async function updateProductStatus(id, { status, featured,discount }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const updateData = {};

    if (status !== undefined) {
      updateData.status = status;
    }

    if (featured !== undefined) {
      updateData.featured = featured;
    }
    if (discount !== undefined) {
      updateData.discount = discount;
    }

    // Update the car
    await db.product.update({
      where: { id },
      data: updateData,
    });

    // Revalidate the cars list page
    revalidatePath("/admin/product");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating car status:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function updateProductRatting(id, { ratting }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const updateData = {};
    if (ratting !== undefined) {
      updateData.ratting = ratting;
    }

    // Update the car
    await db.product.update({
      where: { id },
      data: updateData,
    });

    // Revalidate the cars list page
    revalidatePath("/admin/product");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating car status:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function deletProduct(productId) {
  try {

    const deletedProduct = await db.product.delete({
      where: { id: productId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, message: error.message };
  }
}
