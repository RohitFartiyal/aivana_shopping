"use client"

import { Calendar, Cog, Home, Inbox, LayoutDashboard, Search, Settings, Shirt, Sliders, Truck, UserLock } from "lucide-react"

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
import { Separator } from "./ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Slider } from "./ui/slider"
import { useState } from "react"
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"


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
    label: "Shopping",
    icon: Truck,
    href: "/admin/shopping",
  },
  {
    label: "Settings",
    icon: Cog,
    href: "/admin/settings",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar className='h-full xl:w-60 md:w-50' >
      <SidebarContent className="pt-22 ">
        <SidebarGroup>
          {/* <SidebarGroupLabel className="flex justify-between pb-4">
            <span className="text-lg font-bold">ADMIN</span>
            <UserLock className="mr-5" />
          </SidebarGroupLabel> */}
          <SidebarHeader className="flex flex-row justify-between pb-4">
            <span className="text-md font-bold text-gray-600">ADMIN</span>
            <UserLock className="mr-5 text-gray-600 w-5 h-5" />
          </SidebarHeader>
          <Separator />
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="mt-6 pr-2">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center justify-between gap-x-2 text-slate-500 text-sm font-medium pl-6 pr-6 transition-all hover:text-slate-600 hover:bg-slate-100/50",
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
            </SidebarMenu>
          </SidebarGroupContent>

        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
