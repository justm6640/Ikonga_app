import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/actions/user";
import {
    calculateBMI,
    calculateBodyFat,
    calculateBMR,
    calculateMetabolicAge,
    getBMIInterpretation,
    getBodyFatInterpretation,
    getBMRInterpretation,
    getMetabolicAgeInterpretation,
    calculateAge
} from "@/lib/utils/metrics";
import { MetricCard } from "@/components/indicators/MetricCard";
import {
    Scale,
    User,
    Flame,
    Clock,
    ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default async function IndicatorsHubPage() {
    const prismaUser = await getOrCreateUser();
    if (!prismaUser) redirect("/login");

    const dbUser = await prisma.user.findUnique({
        where: { id: prismaUser.id },
        include: {
            weighIns: { orderBy: { date: 'desc' }, take: 1 }
        }
    });

    if (!dbUser) redirect("/login");

    const lastWeight = dbUser.weighIns[0]?.weight || dbUser.startWeight || 70;
    const height = dbUser.heightCm || 170;
    const age = dbUser.birthDate ? calculateAge(new Date(dbUser.birthDate)) : 30;
    const gender = (dbUser.gender === "MALE" ? "MALE" : "FEMALE") as "MALE" | "FEMALE";

    // Calculations
    const bmi = calculateBMI(lastWeight, height);
    const bodyFat = calculateBodyFat(bmi, age, gender);
    const bmr = calculateBMR(lastWeight, height, age, gender);
    const metabolicAge = calculateMetabolicAge(age, bodyFat, bmr, gender);

    // Interpretations
    const bmiInfo = getBMIInterpretation(bmi);
    const bfInfo = getBodyFatInterpretation(bodyFat, gender);
    const bmrInfo = getBMRInterpretation(bmr);
    const metaAgeInfo = getMetabolicAgeInterpretation(metabolicAge, age);

    const metrics = [
        {
            id: "imc",
            title: "IMC",
            value: bmi.toFixed(1),
            unit: "",
            interpretation: bmiInfo.label,
            interpretationColor: bmiInfo.color,
            iconName: "scale" as const,
        },
        {
            id: "masse-grasse",
            title: "Masse grasse",
            value: Math.round(bodyFat),
            unit: "%",
            interpretation: bfInfo.label,
            interpretationColor: bfInfo.color,
            iconName: "user" as const,
        },
        {
            id: "bmr",
            title: "BMR",
            value: Math.round(bmr),
            unit: "kcal",
            interpretation: bmrInfo.label,
            interpretationColor: bmrInfo.color,
            iconName: "flame" as const,
        },
        {
            id: "age-metabolique",
            title: "Âge métabolique",
            value: metabolicAge,
            unit: "ans",
            interpretation: metaAgeInfo.label,
            interpretationColor: metaAgeInfo.color,
            iconName: "clock" as const,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-xl mx-auto pb-32 px-4 sm:px-6 pt-6">
                {/* Header */}
                <div className="mb-10 flex flex-col items-center text-center">
                    <div className="w-full flex justify-start mb-6">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-100/80 bg-white shadow-sm border border-slate-100">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                    </div>
                    <h1 className="text-4xl font-serif font-black text-slate-900 tracking-tight">Indicateurs</h1>
                    <div className="h-1 w-12 bg-ikonga-coral rounded-full mt-4 mb-3" />
                    <p className="text-sm text-slate-500 font-medium">Ton bilan métabolique en temps réel</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-5 px-1">
                    {metrics.map((metric, idx) => (
                        <Link key={metric.id} href={`/indicateurs/${metric.id}`}>
                            <MetricCard
                                title={metric.title}
                                value={metric.value}
                                unit={metric.unit}
                                interpretation={metric.interpretation}
                                interpretationColor={metric.interpretationColor}
                                iconName={metric.iconName}
                                delay={idx * 0.08}
                            />
                        </Link>
                    ))}
                </div>

                {/* Info Card - Glass Style */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-md border border-white/60 shadow-inner relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Scale size={80} className="text-indigo-900" />
                    </div>
                    <p className="text-sm text-indigo-900/60 leading-relaxed italic font-medium relative z-10 text-center">
                        "Ces indicateurs sont recalculés à chaque pesée pour transformer ton corps bien au-delà de la balance."
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
