
import { Loader2 } from "lucide-react"

interface LoadingOverlayProps {
    message?: string
    isVisible: boolean
}

export function LoadingOverlay({ message = "Chargement en cours...", isVisible }: LoadingOverlayProps) {
    if (!isVisible) return null

    return (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in duration-300 rounded-3xl">
            <div className="relative">
                {/* Background Blob/Glow */}
                <div className="absolute inset-0 bg-orange-200 blur-xl rounded-full opacity-50 animate-pulse" />

                {/* Spinner */}
                <div className="relative bg-white p-4 rounded-2xl shadow-lg border border-orange-100">
                    <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
                </div>
            </div>

            <p className="mt-4 text-sm font-bold text-slate-600 animate-pulse tracking-wide uppercase">
                {message}
            </p>
        </div>
    )
}
