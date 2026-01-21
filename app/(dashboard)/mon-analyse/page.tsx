import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/actions/user";
import { AnalysisWidget } from "@/components/dashboard/AnalysisWidget";
import { AnalysisResult } from "@/lib/ai/generator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

    // Get AI Analysis
    let analysisData: AnalysisResult | null = null;
    if (dbUser.analysis?.content) {
        analysisData = dbUser.analysis.content as unknown as AnalysisResult;
    }

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

                {/* Analysis Widget */}
                <AnalysisWidget analysis={analysisData} />
            </div>
        </div>
    );
}
