"use client"

import { useState } from "react"
import { Droplet, Moon, AlertCircle, Zap, BookHeart, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
// import { Button } from "@/components/ui/button" // Unused but might need
import { logWellnessData } from "@/lib/actions/wellness"
import { HydrationView } from "./HydrationView"
import { SleepView } from "./SleepView"
import { StressView } from "./StressView"
import { EnergyView } from "./EnergyView"
import { JournalView } from "./JournalView"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"

interface WellnessClientProps {
    initialData: any
    waterGoal: number
    initialMessage: string
    gender?: string
}

const TABS = [
    { id: "HYDRATION", icon: Droplet, label: "Hydratation" },
    { id: "SLEEP", icon: Moon, label: "Sommeil" },
    { id: "STRESS", icon: AlertCircle, label: "Stress" },
    { id: "ENERGY", icon: Zap, label: "Énergie" },
    { id: "JOURNAL", icon: BookHeart, label: "Journal" },
]

export function WellnessClient({ initialData, waterGoal, initialMessage, gender }: WellnessClientProps) {
    const [activeTab, setActiveTab] = useState("HYDRATION")
    const [logData, setLogData] = useState(initialData || {})
    const [coachMessage, setCoachMessage] = useState(initialMessage)
    const [dayStatus, setDayStatus] = useState(initialData?.dayStatus || "STABLE")

    const handleUpdate = async (newData: any) => {
        // Optimistic update
        const updatedLog = { ...logData, ...newData }
        setLogData(updatedLog)

        // Server action
        try {
            const result = await logWellnessData({
                date: new Date(), // Today
                ...newData
            })

            if (result && result.status) {
                setDayStatus(result.status)
                // Optionally update message via another call or returned logic, 
                // for now we keep initial unless we want dynamic message update locally
            }
        } catch (error) {
            console.error("Failed to log wellness", error)
            // Revert on error?
        }
    }

    return (
        <div className="w-full pb-20">
            {/* Mobile/Header Navigation Dropdown */}
            <div className="md:hidden mb-6">
                <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger className="w-full h-12 rounded-2xl bg-white border-slate-200 text-slate-900 font-bold shadow-sm focus:ring-amber-500">
                        <SelectValue placeholder="Choisir une vue" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        {TABS.map((tab) => (
                            <SelectItem key={tab.id} value={tab.id} className="font-medium focus:bg-amber-50 focus:text-amber-900">
                                <div className="flex items-center gap-2">
                                    <tab.icon size={16} className="text-amber-500" />
                                    {tab.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {/* Header / Status Banner */}
            <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-serif font-black text-slate-900">IKOWELLNESS</h1>
                        <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                            <Calendar size={12} />
                            {format(new Date(), "EEEE d MMMM", { locale: fr })}
                        </p>
                    </div>

                    {/* Day Status Badge */}
                    <div className={cn(
                        "px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wider",
                        dayStatus === "FRAGILE" ? "bg-red-50 text-red-600 border-red-100" :
                            dayStatus === "POWERFUL" ? "bg-amber-50 text-amber-600 border-amber-100" :
                                "bg-slate-50 text-slate-600 border-slate-100"
                    )}>
                        {dayStatus === "FRAGILE" ? "🌪️ JOUR FRAGILE" : dayStatus === "POWERFUL" ? "🔥 JOUR PUISSANT" : "🌤️ JOUR STABLE"}
                    </div>
                </div>

                {/* Coach Message Card */}
                <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg shadow-slate-200">
                    <p className="text-sm font-medium leading-relaxed opacity-90">
                        "{coachMessage}"
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-700/50 flex items-center justify-center text-[10px] font-bold">
                            IA
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Coach Ikonga</span>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex flex-col items-center justify-center min-w-[70px] h-[70px] rounded-2xl transition-all border",
                                isActive
                                    ? "bg-slate-900 border-slate-900 text-amber-400 shadow-md transform scale-105"
                                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                            )}
                        >
                            <Icon size={20} className={cn(isActive ? "fill-amber-400" : "fill-none")} />
                            <span className={cn("text-[10px] font-bold mt-1", isActive ? "opacity-100" : "text-slate-400")}>
                                {tab.label}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Active View */}
            <div className="mt-2">
                {activeTab === "HYDRATION" && (
                    <HydrationView
                        initialValue={logData.waterIntake || 0}
                        goal={waterGoal}
                        onUpdate={(val) => handleUpdate({ waterIntake: val })}
                    />
                )}
                {activeTab === "SLEEP" && (
                    <SleepView
                        date={new Date()}
                        initialData={logData}
                        onUpdate={handleUpdate}
                    />
                )}
                {activeTab === "STRESS" && (
                    <StressView
                        date={new Date()}
                        initialData={logData}
                        onUpdate={handleUpdate}
                    />
                )}
                {activeTab === "ENERGY" && (
                    <EnergyView
                        date={new Date()}
                        initialData={logData}
                        onUpdate={handleUpdate}
                    />
                )}
                {activeTab === "JOURNAL" && (
                    <JournalView
                        date={new Date()}
                        initialData={logData}
                        onUpdate={handleUpdate}
                    />
                )}
            </div>
        </div>
    )
}
