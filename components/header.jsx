'use client'

import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
    useUser
} from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import {
    AlignJustify,
    HandCoins,
    HeartPlus,
    ShoppingBasket,
    ShoppingCart,
    TicketPercent,
    TruckIcon
} from "lucide-react";
import SearchBar from "./search-bar";

export default function Header(admin) {
    const { user, isSignedIn } = useUser();

    const isAdmin = admin.isAdmin

    return (
        <header className="fixed top-0 w-full z-100 bg-white backdrop-blur-md border-b-2">
            <SignedOut>
                <div className="bg-black h-6 text-xs font-extralight w-full text-gray-200 text-center flex gap-2 justify-center items-center">
                    Sign up and get exiting offers
                    <SignInButton forceRedirectUrl="/">
                        <h5 className="font-medium hover:text-white transition cursor-pointer underline">Join Now</h5>
                    </SignInButton>

                </div>
            </SignedOut>

            <nav className="h-12 md:mx-10 mx-4 my-2 flex items-center justify-between">
                <Link className="text-gray-600 font-bold text-xl" href="/">AIvana</Link>

                {/* Main Navigation */}
                <div className="hidden lg:flex lg:w-auto items-center justify-between">
                    <ul className="flex gap-8 font-medium text-gray-600">
                        <li><Link href="/shop">Shop</Link></li>
                        <li><Link href="/sale">Price Drop</Link></li>
                        <li><Link href="/wishlisted">Wishlisted</Link></li>
                        <li><Link href="/order">Orders</Link></li>
                    </ul>
                </div>

                {/* Search Bar */}
                <SearchBar />

                {/* Auth Actions */}
                <div>
                    <SignedOut>
                        <SignInButton forceRedirectUrl="/">
                            <Button variant="outline">Login</Button>
                        </SignInButton>
                    </SignedOut>

                    <SignedIn>
                        <div className="flex sm:space-x-5 space-x-4 items-center">
                            {isAdmin ? (
                                <Link href="/admin">
                                    <Button variant="outline" className="font-medium text-md text-gray-700">
                                        Admin
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/cart">
                                    <ShoppingCart className="cursor-pointer" />
                                </Link>
                            )}
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-10 h-10",
                                    },
                                }}
                            />
                        </div>
                    </SignedIn>
                </div>
            </nav>

            <div className="bg-gray-800 flex sm:h-10 h-12 text-gray-50   w-full items-center justify-center   lg:hidden">
                <ul className="flex md:gap-16 sm:gap-12 gap-6 sm:font-medium md:text-lg sm:text-sm text-xs justify-between">
                    <li className=" px-4 py-1">
                        <Link href="/shop" className="flex sm:flex-row flex-col sm:gap-2 gap-0 items-center"><ShoppingBasket className="sm:h-5 sm:w-5 h-4 w-4" /> Shop</Link>
                    </li>
                    <li className="px-4 py-1">
                        <Link href="/sale" className="flex sm:flex-row flex-col sm:gap-2 gap-0 items-center"><TicketPercent className="sm:h-5 sm:w-5 h-4 w-4" /> Price Drop</Link>
                    </li>
                    <li className="px-4 py-1">
                        <Link href="/wishlisted" className="flex sm:flex-row flex-col sm:gap-2 gap-0 items-center"><HeartPlus className="sm:h-5 sm:w-5 h-4 w-4" /> Wishlisted</Link>
                    </li>
                    <li className="px-4 py-1">
                        <Link href="/order" className="flex sm:flex-row flex-col sm:gap-2 gap-0 items-center"><TruckIcon className="sm:h-5 sm:w-5 h-4 w-4" /> Order</Link>
                    </li>
                </ul>
            </div>
        </header>
    );
}
