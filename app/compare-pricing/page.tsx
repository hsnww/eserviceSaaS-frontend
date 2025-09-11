"use client";

import React, { useEffect, useState } from "react";
import { fetchPlans, Plan } from "@/utils/api";

export default function ComparePricing() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPlans() {
            try {
                const data = await fetchPlans();
                setPlans(data);
            } catch (error) {
                console.error("Error fetching plans:", error);
            } finally {
                setLoading(false);
            }
        }

        loadPlans();
    }, []);

    if (loading) return <p className="text-center mt-6">جارٍ تحميل البيانات...</p>;

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <h1 className="text-3xl font-bold text-center mb-6">مقارنة خطط الأسعار</h1>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                    <tr className="bg-blue-900 text-white">
                        <th className="p-4">الميزة</th>
                        {plans.map((plan) => (
                            <th key={plan.id} className="p-4">
                                {plan.name} <br />
                                <span className="text-sm">{plan.price} ريال</span>
                                <br />
                                <span className="text-xs">{plan.employee_limit}</span>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {plans.length > 0 &&
                        plans[0].categories.map((category, catIndex) => (
                            <React.Fragment key={catIndex}>
                                {/* عنوان التصنيف */}
                                <tr className="bg-gray-300">
                                    <td className="p-4 font-bold text-lg" colSpan={plans.length + 1}>
                                        {category.category}
                                    </td>
                                </tr>

                                {/* الميزات ضمن التصنيف */}
                                {category.features.map((feature) => (
                                    <tr key={feature.id} className="border-t border-gray-300">
                                        <td className="p-4 bg-gray-200 font-semibold">{feature.name}</td>
                                        {plans.map((plan) => {
                                            // البحث عن الميزة داخل خطة معينة
                                            const planCategory = plan.categories.find((c) => c.category === category.category);
                                            const planFeature = planCategory?.features.find((f) => f.id === feature.id);

                                            return (
                                                <td key={plan.id} className="p-4 text-center">
                                                    {planFeature?.available ? "✅" : "❌"}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}