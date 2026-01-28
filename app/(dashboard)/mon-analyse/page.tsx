import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/actions/user";
import { AnalysisResult } from "@/lib/validators/analysis";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnalysisClient } from "@/components/dashboard/AnalysisClient";


export default async function MonAnalysePage() {
    // Fetch User
    const prismaUser = await getOrCreateUser();

    if (!prismaUser) {
        redirect("/login");
    }

    // Fetch user with analysis
    const dbUser = await prisma.user.findUnique({
        where: { id: prismaUser.id },
        include: {
            analysis: true
        }
    });

    if (!dbUser) redirect("/login");

    // Get AI Analysis & Input Data
    let analysisData: AnalysisResult | null = null;
    let inputData: any | null = null;

    if (dbUser.analysis?.content) {
        analysisData = dbUser.analysis.content as unknown as AnalysisResult;
    }

    if (dbUser.analysis?.inputData) {
        inputData = dbUser.analysis.inputData;
    }

    const hasAnalysis = !!analysisData;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-3xl mx-auto pb-32 px-4 sm:px-6 pt-6">
                {/* Header with back button */}
                <div className="mb-8 flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-100">
                            <ArrowLeft size={20} />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-serif font-black text-slate-900">Mon Analyse</h1>
                        <p className="text-sm text-slate-500 mt-1">Ton profil analysé par Rosy</p>
                    </div>
                </div>

                {/* Client Component to handle View Switching */}
                <AnalysisClient
                    initialAnalysis={analysisData}
                    existingFormData={inputData}
                />
            </div>
        </div>
    );
}
