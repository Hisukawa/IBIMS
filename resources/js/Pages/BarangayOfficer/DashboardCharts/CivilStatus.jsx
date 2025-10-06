import Counter from "@/Components/Counter";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#1e3a8a", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"]; // blue shades



function CivilStatus({ civilStatusDistribution }) {
    // Convert object into array for Recharts
    const chartData = Object.entries(civilStatusDistribution).map(([key, value]) => ({
        name: key,
        value: value,
    }));


    const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="w-full h-[260px] flex flex-col items-center relative">

            {/* Donut Chart */}
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="100%"
                        paddingAngle={0}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) =>
                            `${value} (${((value / total) * 100).toFixed(1)}%)`
                        }
                        contentStyle={{
                            background: "rgba(255, 255, 255, 0.9)",
                            border: "1px solid rgba(209, 213, 219, 0.5)",
                            borderRadius: "0.75rem",
                            boxShadow:
                                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <p className="text-2xl font-bold text-gray-800 -translate-y-11">
                    <Counter end={total} />
                </p>
            </div>

            {/* Scrollable legend: show 2 by default */}
            <div className="mt-2 w-full max-h-[90px] overflow-y-auto">
                {chartData.map((entry, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between text-sm text-gray-700 mb-2"
                    >
                        <div className="flex items-center">
                            <span
                                className="inline-block w-4 h-4 rounded-full mr-2"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></span>
                            <span>
                                {index < 2 ? entry.name : entry.name} {/* You can style differently if needed */}
                            </span>
                        </div>
                        <span className="font-semibold">
                            {entry.value} ({((entry.value / total) * 100).toFixed(2)}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CivilStatus;
