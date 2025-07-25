"use client"

import { Home, Search, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Social Feed",
      href: "/",
      icon: Home,
    },
    {
      name: "Event Search",
      href: "/search",
      icon: Search,
    },
    {
      name: "My Profile",
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 bg-background border-t">
      {navItems.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.name}</span>
          </Link>
        )
      })}
    </div>
  )
}
