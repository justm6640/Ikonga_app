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
    const gender = dbUser.gender || "FEMALE";

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
                <div className="mb-8 flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-100">
                            <ArrowLeft size={20} />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-serif font-black text-slate-900">Indicateurs</h1>
                        <p className="text-sm text-slate-500 mt-1">Ton bilan métabolique en temps réel</p>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {metrics.map((metric, idx) => (
                        <Link key={metric.id} href={`/indicateurs/${metric.id}`}>
                            <MetricCard
                                title={metric.title}
                                value={metric.value}
                                unit={metric.unit}
                                interpretation={metric.interpretation}
                                interpretationColor={metric.interpretationColor}
                                iconName={metric.iconName}
                                delay={idx * 0.1}
                            />
                        </Link>
                    ))}
                </div>

                {/* Info Card */}
                <div className="mt-8 p-6 rounded-[2rem] bg-indigo-50/50 border border-indigo-100/50">
                    <p className="text-sm text-indigo-900/70 leading-relaxed italic">
                        Ces indicateurs sont recalculés automatiquement à chaque nouvelle pesée. Ils te permettent de comprendre comment IKONGA transforme ton corps au-delà du simple chiffre sur la balance.
                    </p>
                </div>
            </div>
        </div>
    );
}
