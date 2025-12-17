"use client"

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    ReferenceLine
} from "recharts"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WeightLog {
    date: Date | string;
    weight: number;
}

interface WeightChartFullProps {
    data: WeightLog[];
    targetWeight?: number;
}

export function WeightChartFull({ data, targetWeight }: WeightChartFullProps) {
    // Format data for Recharts (Date object to formatted string sometimes easier, or keep Date and formatter)
    const chartData = data.map(log => ({
        ...log,
        // Ensure date is valid for display if passed as string from serializable server component
        dateStr: format(new Date(log.date), "dd MMM", { locale: fr }),
        fullDate: format(new Date(log.date), "PPP", { locale: fr })
    }));

    // Calculate domain min/max for YAxis to zoom in on weight range
    const weights = data.map(d => d.weight);
    const minWeight = Math.min(...weights, targetWeight || 1000);
    const maxWeight = Math.max(...weights, targetWeight || 0);

    const yDomain = [Math.floor(minWeight - 2), Math.ceil(maxWeight + 2)];

    return (
        <Card className="w-full border-none shadow-sm bg-card/50">
            <CardHeader>
                <CardTitle className="text-lg font-medium">Evolution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorWeightMain" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#E5488A" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#E5488A" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />

                            <XAxis
                                dataKey="dateStr"
                                tick={{ fontSize: 12, fill: '#888' }}
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                            />

                            <YAxis
                                domain={yDomain}
                                tick={{ fontSize: 12, fill: '#888' }}
                                axisLine={false}
                                tickLine={false}
                                unit=" kg"
                            />

                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-white p-3 rounded-xl shadow-lg border border-border">
                                                <p className="text-sm font-medium text-muted-foreground mb-1">{payload[0].payload.fullDate}</p>
                                                <p className="text-lg font-bold text-ikonga-pink">
                                                    {Number(payload[0].value).toFixed(1)} <span className="text-sm">kg</span>
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />

                            {targetWeight && (
                                <ReferenceLine
                                    y={targetWeight}
                                    stroke="#10b981"
                                    strokeDasharray="3 3"
                                    label={{ position: 'right', value: 'Objectif', fill: '#10b981', fontSize: 12 }}
                                />
                            )}

                            <Area
                                type="monotone"
                                dataKey="weight"
                                stroke="#E5488A"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorWeightMain)"
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#E5488A' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
