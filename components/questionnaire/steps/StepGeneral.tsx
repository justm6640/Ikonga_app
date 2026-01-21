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
import { Globe, MapPin, Phone, User, Users, Star, Instagram } from "lucide-react"

type Step1Data = z.infer<typeof step1GeneralSchema>

interface StepGeneralProps {
    onNext: () => void
}

const GENDER_OPTIONS = [
    { id: "FEMALE", label: "Femme" },
    { id: "MALE", label: "Homme" },
    { id: "OTHER", label: "Autre" }
]

const REFERRAL_OPTIONS = [
    { id: "SOCIAL", label: "Réseaux sociaux", icon: Instagram },
    { id: "RECO", label: "Recommandation", icon: Users },
    { id: "ROSY", label: "Coach Rosy", icon: Star },
    { id: "OTHER", label: "Autre", icon: Globe }
]

export function StepGeneral({ onNext }: StepGeneralProps) {
    const { data, setData } = useQuestionnaireStore()

    const form = useForm<Step1Data>({
        resolver: zodResolver(step1GeneralSchema),
        defaultValues: {
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            // @ts-ignore
            birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
            gender: data.gender || "FEMALE",
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

                {/* Identification */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-l-4 border-ikonga-pink pl-3">
                        Ton Profil
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Prénom" className="h-14 rounded-2xl bg-slate-50 border-none px-6 focus-visible:ring-ikonga-pink/20" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Nom" className="h-14 rounded-2xl bg-slate-50 border-none px-6 focus-visible:ring-ikonga-pink/20" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Email" type="email" className="h-14 rounded-2xl bg-slate-50 border-none px-6 focus-visible:ring-ikonga-pink/20" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Sexe & Naissance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem className="space-y-4">
                                <FormLabel className="text-slate-900 font-bold">Ton Sexe</FormLabel>
                                <FormControl>
                                    <SelectionGrid
                                        options={GENDER_OPTIONS}
                                        selected={[field.value]}
                                        onChange={(val) => field.onChange(val[0])}
                                        multi={false}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                            <FormItem className="space-y-4">
                                <FormLabel className="text-slate-900 font-bold">Date de naissance</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        className="h-14 rounded-2xl bg-slate-50 border-none px-6 focus-visible:ring-ikonga-pink/20"
                                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                        onChange={(e) => field.onChange(e.target.valueAsDate)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

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

                <Button
                    type="submit"
                    className="w-full h-16 text-lg font-black uppercase tracking-widest rounded-3xl bg-ikonga-gradient hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-pink-200"
                >
                    Continuer
                </Button>
            </form>
        </Form>
    )
}
