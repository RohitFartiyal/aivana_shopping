"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function addReview(reviewData,productId){

     try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");
    
        const user = await db.user.findUnique({
          where: { clerkUserId: userId },
        });
    
        if (!user) throw new Error("User not found");

        await db.reviews.create({
          data: {
            ratting:reviewData.ratting,
            review:reviewData.review,
            productId,
            userId: user.id,
          }
        })
        return{
          success: true,
        }
    }catch (error) {
    throw new Error("Error adding car:" + error.message);
  }
}

export async function allReview(productId){
  try {
   const reviews = await db.reviews.findMany({
  where: { productId },
  include: {
    user: {
      select: {
        name: true,
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
});
    return{
      success:true,
      data:reviews
    }
  } catch (error) {
    
  }
}