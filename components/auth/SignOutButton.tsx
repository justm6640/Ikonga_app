"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface SignOutButtonProps {
    className?: string
    variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary"
}

export function SignOutButton({ className, variant = "destructive" }: SignOutButtonProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleSignOut = async () => {
        setIsLoading(true)
        try {
            const supabase = createClient()
            await supabase.auth.signOut()

            // Clear router cache and redirect
            router.refresh()
            router.push("/login")
            toast.success("À bientôt ! 👋")
        } catch (error) {
            toast.error("Erreur lors de la déconnexion")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant={variant}
            onClick={handleSignOut}
            disabled={isLoading}
            className={cn("gap-2 shadow-sm font-medium", className)}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <LogOut className="h-4 w-4" />
            )}
            Se déconnecter
        </Button>
    )
}
