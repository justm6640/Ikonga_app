import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/actions/user";
import {
    calculateBMI,
    calculateBodyFat,
    calculateBMR,
    calculateMetabolicAge,
    calculateWeightForBMI,
    calculateAge
} from "@/lib/utils/metrics";
import { BMIGauge } from "@/components/indicators/BMIGauge";
import { BodyFatDonut } from "@/components/indicators/BodyFatDonut";
import { BMRBuilding } from "@/components/indicators/BMRBuilding";
import { MetabolicAgeRings } from "@/components/indicators/MetabolicAgeRings";
import { ArrowLeft, CheckCircle2, Info, Lightbulb } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function IndicatorDetailPage({ params }: PageProps) {
    const { id } = await params;
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
    const pisi = dbUser.pisi || 65;

    // Calculations
    const bmi = calculateBMI(lastWeight, height);
    const bodyFat = calculateBodyFat(bmi, age, gender);
    const bmr = calculateBMR(lastWeight, height, age, gender);
    const bmrPisi = calculateBMR(pisi, height, age, gender);
    const metabolicAge = calculateMetabolicAge(age, bodyFat, bmr, gender);

    // Metadata for each indicator
    const CONTENT: Record<string, any> = {
        "imc": {
            title: "IMC",
            subtitle: "Indicateur de Masse Corporelle",
            chart: <BMIGauge bmi={bmi} />,
            pedagogy: [
                {
                    title: "C'est quoi ?",
                    content: "L'indice de masse corporelle (IMC) est une mesure standard utilisée pour évaluer si une personne a un poids santé pour sa taille. C'est un indicateur de risque global, pas un jugement.",
                    icon: <Info className="text-blue-500" size={18} />
                },
                {
                    title: "Pourquoi c'est important ?",
                    content: "Maintenir un IMC dans la zone 'Normal' aide à protéger ton cœur, tes articulations et à réduire les risques de maladies métaboliques.",
                    icon: <CheckCircle2 className="text-emerald-500" size={18} />
                },
                {
                    title: "Comment IKONGA t'aide ?",
                    content: "IKONGA organise ton alimentation et ton activité physique à travers différentes phases pour faire descendre progressivement ton IMC vers ton PISI (Poids Idéal Santé IKONGA).",
                    icon: <Lightbulb className="text-ikonga-coral" size={18} />
                }
            ],
            bonus: (
                <div className="mt-8 space-y-4">
                    <h4 className="text-sm font-black text-slate-900 uppercase">Paliers de poids pour ta taille</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {[35, 30, 25, 18.5].map((targetBmi) => (
                            <div key={targetBmi} className="p-3 rounded-2xl bg-white border border-slate-100 flex flex-col items-center">
                                <span className="text-[10px] font-black text-slate-400">IMC {targetBmi}</span>
                                <span className="text-lg font-serif font-black text-slate-900">{calculateWeightForBMI(targetBmi, height).toFixed(1)}kg</span>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        "masse-grasse": {
            title: "Masse grasse",
            subtitle: "Composition de ton corps",
            chart: <BodyFatDonut percentage={bodyFat} />,
            pedagogy: [
                {
                    title: "C'est quoi ?",
                    content: "C'est la proportion de graisse dans ton corps par rapport à ta masse maigre (muscles, os, eau). Elle est essentielle mais doit rester dans des limites saines.",
                    icon: <Info className="text-blue-500" size={18} />
                },
                {
                    title: "Pourquoi c'est important ?",
                    content: "Une masse grasse trop élevée favorise l'inflammation, les douleurs articulaires et la fatigue chronique. Réduire ce taux améliore ta vitalité globale.",
                    icon: <CheckCircle2 className="text-emerald-500" size={18} />
                },
                {
                    title: "Comment IKONGA t'aide ?",
                    content: "Grâce aux menus ciblés et à l'alternance des phases Détox/Équilibre, le programme cible la perte de graisse tout en préservant ton muscle grâce au sport.",
                    icon: <Lightbulb className="text-ikonga-coral" size={18} />
                }
            ]
        },
        "bmr": {
            title: "BMR",
            subtitle: "Métabolisme de Base",
            chart: <BMRBuilding bmr={bmr} targetBmr={bmrPisi} />,
            pedagogy: [
                {
                    title: "C'est quoi ?",
                    content: "Le BMR est la quantité d'énergie (calories) que ton corps brûle au repos complet pour maintenir ses fonctions vitales (respirer, battements du cœur).",
                    icon: <Info className="text-blue-500" size={18} />
                },
                {
                    title: "Pourquoi c'est important ?",
                    content: "Manger beaucoup moins que ton BMR ralentit ton métabolisme et provoque de la fatigue. IKONGA s'assure que tu manges juste assez pour perdre du gras sans t'affamer.",
                    icon: <CheckCircle2 className="text-emerald-500" size={18} />
                },
                {
                    title: "Comment IKONGA t'aide ?",
                    content: "Les menus sont calculés pour protéger ton BMR actuel. Le sport régulier aide également à maintenir une 'chaudière énergétique' efficace.",
                    icon: <Lightbulb className="text-ikonga-coral" size={18} />
                }
            ]
        },
        "age-metabolique": {
            title: "Âge métabolique",
            subtitle: "L'âge réel de ton corps",
            chart: <MetabolicAgeRings realAge={age} metabolicAge={metabolicAge} />,
            pedagogy: [
                {
                    title: "C'est quoi ?",
                    content: "C'est une estimation de l'âge biologique de ton métabolisme. Si ton métabolisme est lent ou chargé en masse grasse, cet âge sera plus élevé que ton âge réel.",
                    icon: <Info className="text-blue-500" size={18} />
                },
                {
                    title: "Pourquoi c'est important ?",
                    content: "C'est l'indicateur ultime de ton hygiène de vie. Inverser la tendance et rajeunir ton métabolisme est un signe de transformation réussie.",
                    icon: <CheckCircle2 className="text-emerald-500" size={18} />
                },
                {
                    title: "Comment IKONGA t'aide ?",
                    content: "Chaque kilo perdu et chaque séance de sport réduit ton âge métabolique. L'objectif est de le rapprocher (ou le faire passer en dessous) de ton âge réel.",
                    icon: <Lightbulb className="text-ikonga-coral" size={18} />
                }
            ]
        }
    };

    const data = CONTENT[id];
    if (!data) notFound();

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-xl mx-auto pb-32 px-4 sm:px-6 pt-6">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <Link href="/indicateurs">
                        <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-100">
                            <ArrowLeft size={20} />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-serif font-black text-slate-900">{data.title}</h1>
                        <p className="text-sm text-slate-500 mt-1">{data.subtitle}</p>
                    </div>
                </div>

                {/* Visualization Section */}
                <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-indigo-100/50 bg-white mb-8 overflow-hidden">
                    <CardContent className="p-8">
                        {data.chart}
                        {data.bonus}
                    </CardContent>
                </Card>

                {/* Pedagogy Section */}
                <div className="space-y-4">
                    {data.pedagogy.map((item: any, idx: number) => (
                        <Card key={idx} className="rounded-[2rem] border-none shadow-sm bg-white/60 backdrop-blur-sm">
                            <CardContent className="p-6 flex gap-4">
                                <div className="mt-1">{item.icon}</div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                                        {idx + 1}. {item.title}
                                    </h4>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                        {item.content}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
