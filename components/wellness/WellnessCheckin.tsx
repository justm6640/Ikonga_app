"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Moon, Zap, AlertCircle, Send, Loader2 } from "lucide-react"
import { submitWellnessLog } from "@/lib/actions/wellness"
import { toast } from "sonner"

export function WellnessCheckin() {
    const [sleep, setSleep] = useState(8)
    const [stress, setStress] = useState(5)
    const [energy, setEnergy] = useState(5)
    const [isPending, setIsPending] = useState(false)

    const handleSubmit = async () => {
        setIsPending(true)
        try {
            const res = await submitWellnessLog({
                sleepHours: sleep,
                stressLevel: stress,
                energyLevel: energy
            })

            if (res.success) {
                toast.success("Check-in réussi ! Merci de prendre soin de toi. ✨")
            } else {
                toast.error(res.error || "Erreur lors de la validation")
            }
        } catch (error) {
            toast.error("Oups ! Quelque chose s'est mal passé.")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-xl mx-auto"
        >
            <Card className="border-none shadow-2xl shadow-indigo-100 rounded-[2.5rem] bg-white overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400" />

                <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-3xl font-serif font-black text-slate-900 tracking-tight">
                        Check-in Bien-être
                    </CardTitle>
                    <CardDescription className="text-slate-500 font-medium italic">
                        Prends un instant pour écouter ton corps aujourd'hui...
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-8 pt-4 space-y-10">
                    {/* Sleep Slider */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2 text-slate-700 font-bold uppercase tracking-widest text-[10px]">
                                <Moon size={16} className="text-indigo-500" />
                                Sommeil
                            </Label>
                            <span className="text-2xl font-black text-indigo-600">{sleep}h</span>
                        </div>
                        <Slider
                            value={[sleep]}
                            onValueChange={(val) => setSleep(val[0])}
                            max={12}
                            step={0.5}
                            className="py-4"
                        />
                        <p className="text-[10px] text-slate-400 font-medium italic">Combien d'heures as-tu dormi ?</p>
                    </div>

                    {/* Stress Slider */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2 text-slate-700 font-bold uppercase tracking-widest text-[10px]">
                                <AlertCircle size={16} className="text-purple-500" />
                                Stress
                            </Label>
                            <span className="text-2xl font-black text-purple-600">{stress}/10</span>
                        </div>
                        <Slider
                            value={[stress]}
                            onValueChange={(val) => setStress(val[0])}
                            max={10}
                            step={1}
                            className="py-4"
                        />
                        <p className="text-[10px] text-slate-400 font-medium italic">Niveau de stress actuel (1: zen, 10: explosif)</p>
                    </div>

                    {/* Energy Slider */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2 text-slate-700 font-bold uppercase tracking-widest text-[10px]">
                                <Zap size={16} className="text-pink-500" />
                                Énergie
                            </Label>
                            <span className="text-2xl font-black text-pink-600">{energy}/10</span>
                        </div>
                        <Slider
                            value={[energy]}
                            onValueChange={(val) => setEnergy(val[0])}
                            max={10}
                            step={1}
                            className="py-4"
                        />
                        <p className="text-[10px] text-slate-400 font-medium italic">Ton niveau d'énergie aujourd'hui</p>
                    </div>

                    {/* Submit Button */}
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="w-full h-16 rounded-[2rem] bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 group"
                    >
                        {isPending ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                Valider mon check-in
                                <Send className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    )
}
