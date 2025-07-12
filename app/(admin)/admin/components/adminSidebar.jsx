"use client"

import {Cog,LayoutDashboard,Shirt,Truck, UserLock } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useState } from "react"
import { Badge } from "@/components/ui/badge";
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"


// Menu items.
const sizes = ["XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "3X-Large", "4X-Large",];
// Navigation items
const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin",
    },
    {
        label: "Product",
        icon: Shirt,
        href: "/admin/product",
    },
    {
        label: "Orders",
        icon: Truck,
        href: "/admin/order",
    },
    {
        label: "Settings",
        icon: Cog,
        href: "/admin/setting",
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    return (
        <>

            {/* large screen */}
            <div className="pr-2  h-[100vh]  border-r-2 pt-5 lg:block hidden">
                <div className="flex items-center justify-between gap-x-2 text-slate-800 text-lg font-medium pl-6 pr-6 py-2 mb-5 bg-muted">
                    <h1>ADMIN </h1>
                    <UserLock className="h-5 w-5"/>
                </div>
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "flex items-center justify-between gap-x-2 text-slate-500 text-sm font-medium pl-6 pr-6  transition-all hover:text-slate-600 hover:bg-slate-100/50",
                            pathname === route.href
                                ? "text-blue-700 bg-blue-100/50 hover:bg-blue-100 hover:text-blue-700"
                                : "",
                            "h-12"
                        )}
                    >
                        {route.label}
                        <route.icon className="h-5 w-5" />

                    </Link>
                ))}
            </div>

            {/* medium screen */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-muted    border-t flex justify-around items-center h-16">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "flex flex-col items-center justify-center text-slate-500 text-xs font-medium transition-all",
                            pathname === route.href ? "text-blue-700" : "",
                            "py-1 flex-1"
                        )}
                    >
                        <route.icon
                            className={cn(
                                "h-6 w-6 mb-1",
                                pathname === route.href ? "text-blue-700" : "text-slate-500"
                            )}
                        />
                        {route.label}
                    </Link>
                ))}
            </div>

        </>
    )
}
