"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { step1GeneralSchema, QuestionnaireData } from "@/lib/validators/questionnaire"
import { useQuestionnaireStore } from "@/hooks/use-questionnaire-store"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SelectionGrid } from "@/components/questionnaire/SelectionGrid"
import { Globe, MapPin, Phone, User, Users, Star, Instagram, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { skipOnboarding } from "@/lib/actions/onboarding"

type Step1Data = z.infer<typeof step1GeneralSchema>

interface StepGeneralProps {
    onNext: () => void
}

const REFERRAL_OPTIONS = [
    { id: "SOCIAL", label: "Réseaux sociaux", icon: Instagram },
    { id: "RECO", label: "Recommandation", icon: Users },
    { id: "ROSY", label: "Coach Rosy", icon: Star },
    { id: "OTHER", label: "Autre", icon: Globe }
]

export function StepGeneral({ onNext }: StepGeneralProps) {
    const { data, setData } = useQuestionnaireStore()
    const [isSkipping, setIsSkipping] = useState(false)
    const router = useRouter()

    const form = useForm<Step1Data>({
        resolver: zodResolver(step1GeneralSchema),
        defaultValues: {
            countryOrigin: data.countryOrigin || "",
            countryResidence: data.countryResidence || "",
            city: data.city || "",
            whatsapp: data.whatsapp || "",
            heightCm: data.heightCm || undefined,
            startWeight: data.startWeight || undefined,
            targetWeight: data.targetWeight || undefined,
            referralSource: data.referralSource || ""
        },
    })

    function onSubmit(values: Step1Data) {
        setData(values)
        onNext()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Localisation */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-l-4 border-slate-200 pl-3">
                        Localisation & Contact
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="countryOrigin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Pays d'origine" className="h-14 rounded-2xl bg-slate-50 border-none px-6" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="countryResidence"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Pays de résidence" className="h-14 rounded-2xl bg-slate-50 border-none px-6" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Ville" className="h-14 rounded-2xl bg-slate-50 border-none px-6" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="whatsapp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                                            <Input placeholder="WhatsApp" className="h-14 rounded-2xl bg-slate-50 border-none pl-12 pr-6" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Biométrie */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-l-4 border-slate-200 pl-3">
                        Mensurations
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="heightCm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">Taille (cm)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="170" className="h-14 rounded-2xl bg-slate-50 border-none text-center text-lg font-bold" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startWeight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">Poids (kg)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="70" className="h-14 rounded-2xl bg-slate-50 border-none text-center text-lg font-bold" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="targetWeight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs italic">Objectif (kg)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="65" className="h-14 rounded-2xl bg-pink-50 border-none text-center text-lg font-bold text-ikonga-pink" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Source */}
                <FormField
                    control={form.control}
                    name="referralSource"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold">Comment as-tu connu IKONGA ?</FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={REFERRAL_OPTIONS}
                                    selected={[field.value]}
                                    onChange={(val) => field.onChange(val[0])}
                                    multi={false}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-3">
                    <Button
                        type="submit"
                        className="w-full h-16 text-lg font-black uppercase tracking-widest rounded-3xl bg-ikonga-gradient hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-pink-200"
                    >
                        Continuer
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        disabled={isSkipping}
                        onClick={async () => {
                            // No validation needed - just skip to dashboard
                            setIsSkipping(true)
                            try {
                                const result = await skipOnboarding()
                                if (result.success) {
                                    toast.success("C'est noté ! Bienvenue.")
                                    router.push("/dashboard")
                                } else {
                                    toast.error(result.error || "Une erreur est survenue")
                                }
                            } catch (err) {
                                toast.error("Erreur de connexion")
                            } finally {
                                setIsSkipping(false)
                            }
                        }}
                        className="w-full h-14 text-sm font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl"
                    >
                        {isSkipping ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Enregistrement...</span>
                            </div>
                        ) : (
                            "Remplir plus tard →"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
