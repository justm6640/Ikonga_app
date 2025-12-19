"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { AdminSidebar } from "./AdminSidebar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"

export function AdminMobileHeader() {
    const [open, setOpen] = useState(false)

    return (
        <header className="lg:hidden h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 sticky top-0 z-[60]">
            <Link href="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-ikonga-gradient flex items-center justify-center">
                    <span className="text-white font-black text-sm">I</span>
                </div>
                <span className="text-white font-bold tracking-tight text-sm uppercase">Admin Panel</span>
            </Link>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-900">
                        <Menu size={24} />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 border-none bg-slate-950 w-72">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Menu d'administration</SheetTitle>
                    </SheetHeader>
                    {/* Wrap Sidebar with a removal of the 'hidden' class for the drawer */}
                    <div className="h-full [&>aside]:flex">
                        <AdminSidebar />
                    </div>
                </SheetContent>
            </Sheet>
        </header>
    )
}
