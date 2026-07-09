"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { PackageIcon } from "lucide-react"

import { PRODUCT_TYPES } from "@/lib/product-types"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Produits",
      url: "/admin",
      icon: <PackageIcon />,
      isActive: true,
      // Un sous-lien par type, dérivé de PRODUCT_TYPES pour rester aligné
      // avec les pages produits publiques. Sans `type`, on affiche tout.
      items: [
        { title: "Tous les produits", url: "/admin" },
        ...PRODUCT_TYPES.map((meta) => ({
          title: meta.label,
          url: `/admin?type=${meta.slug}`,
        })),
      ],
    },

    {
      title: "Analyses de données",
      url: "/admin/analyses",
      icon: <PackageIcon />,
      isActive: true,
  
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin">
                <div className="flex size-10 items-center justify-center text-sidebar-primary-foreground">
                  <Image src="/logo_new.png" alt="MA-ERI Consulting" width={40} height={40} className="size-10 rounded-lg" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">MA-ERI Consulting</span>
                  <span className="truncate text-xs">Admin</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
