"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { BookOpen, Users, Calendar } from "lucide-react"

export function AdminMenuTabs({
    weeklyPlansNode,
    globalMenusNode,
    assignmentNode
}: {
    weeklyPlansNode: React.ReactNode,
    globalMenusNode: React.ReactNode,
    assignmentNode: React.ReactNode
}) {
    return (
        <Tabs defaultValue="plans" className="space-y-6">
            <TabsList className="bg-white p-1 rounded-full border border-slate-200 inline-flex shadow-sm">
                <TabsTrigger value="plans" className="rounded-full px-6 py-2.5 data-[state=active]:bg-slate-900 data-[state=active]:text-white font-bold text-xs uppercase tracking-wider transition-all gap-2">
                    <Users size={14} />
                    Plans Utilisateurs
                </TabsTrigger>
                <TabsTrigger value="globals" className="rounded-full px-6 py-2.5 data-[state=active]:bg-slate-900 data-[state=active]:text-white font-bold text-xs uppercase tracking-wider transition-all gap-2">
                    <BookOpen size={14} />
                    Modèles & Recettes
                </TabsTrigger>
                <TabsTrigger value="assign" className="rounded-full px-6 py-2.5 data-[state=active]:bg-slate-900 data-[state=active]:text-white font-bold text-xs uppercase tracking-wider transition-all gap-2">
                    <Calendar size={14} />
                    Assignation Rapide
                </TabsTrigger>
            </TabsList>

            <TabsContent value="plans" className="focus-visible:ring-0">
                {weeklyPlansNode}
            </TabsContent>

            <TabsContent value="globals" className="focus-visible:ring-0">
                {globalMenusNode}
            </TabsContent>

            <TabsContent value="assign" className="focus-visible:ring-0">
                {assignmentNode}
            </TabsContent>
        </Tabs>
    )
}
