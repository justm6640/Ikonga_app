"use client";

import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const data = [
    { weight: 85.5 },
    { weight: 85.2 },
    { weight: 85.0 },
    { weight: 84.8 },
    { weight: 84.6 },
    { weight: 84.4 },
    { weight: 84.2 },
];

export function WeightMiniChart() {
    const currentWeight = 84.2;
    const startWeight = 85.5;
    const loss = (currentWeight - startWeight).toFixed(1);

    return (
        <Card className="rounded-3xl border-none shadow-sm overflow-hidden h-full">
            <CardContent className="p-6 relative h-full flex flex-col justify-between">
                <div>
                    <p className="text-sm text-muted-foreground font-medium">Poids actuel</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-bold text-foreground">{currentWeight}</span>
                        <span className="text-sm font-medium text-muted-foreground">kg</span>
                    </div>
                    <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                        {loss} kg
                    </div>
                </div>

                <div className="h-[100px] w-full absolute bottom-0 left-0 right-0 opacity-50">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#E5488A" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#E5488A" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="weight"
                                stroke="#E5488A"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorWeight)"
                            />
                            {/* Hide Axis for minimal look, but keep domain dynamic */}
                            <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
