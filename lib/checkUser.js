
import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName}`;

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    console.log(error.message);
  }
};

// // import { auth } from "@clerk/nextjs/server";
// // import { db } from "./prisma";

// // export const checkUser = async () => {
// //   const { userId } = auth(); // ✅ no need for await

// //   if (!userId) {
// //     return null;
// //   }

// //   try {
// //     const loggedInUser = await db.user.findUnique({
// //       where: {
// //         clerkUserId: userId,
// //       },
// //     });

// //     if (loggedInUser) return loggedInUser;

// //     // ✅ Fetch full user data from Clerk's backend API
// //     const clerkRes = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
// //       headers: {
// //         Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
// //       },
// //     });

// //     const clerkUser = await clerkRes.json();

// //     const name = `${clerkUser.first_name} ${clerkUser.last_name}`;

// //     const newUser = await db.user.create({
// //       data: {
// //         clerkUserId: userId,
// //         name,
// //         imageUrl: clerkUser.image_url,
// //         email: clerkUser.email_addresses[0].email_address,
// //       },
// //     });

// //     return newUser;
// //   } catch (error) {
// //     console.error("checkUser error:", error);
// //     return null;
// //   }
// // };



// import { currentUser } from "@clerk/nextjs/server";

// export const checkUser = async () => {
//   const user = await currentUser();

//   if (!user) {
//     return null;
//   }

//   try {
//     const newUser = user?.firstName

//         return newUser
//   } catch (error) {
//     console.log(error);
//   }
// };
