"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CompanySidebar from "@/app/components/CompanySidebar";

// ✅ نموذج الخطة
interface Plan {
    id: number;
    name: string;
    price: number;
    employee_limit: string;
    categories: {
        category: string;
        features: { id: number; name: string; available: boolean }[];
    }[];
}

export default function PlansPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    useEffect(() => {
        async function loadPlans() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/plans`, {
                    headers: { "Content-Type": "application/json" },
                });
                const data = await response.json();
                setPlans(data);
            } catch (error) {
                console.error("❌ خطأ في تحميل الخطط:", error);
                setError("فشل تحميل الخطط، حاول مرة أخرى.");
            } finally {
                setLoading(false);
            }
        }

        loadPlans();

        // ✅ جلب الخطة المختارة حاليًا من localStorage
        const storedPlan = localStorage.getItem("selected_plan");
        if (storedPlan) {
            setSelectedPlan(parseInt(storedPlan));
        }
    }, []);

    const handleSelectPlan = async (planId: number) => {
        setError("");
        setSuccess("");
    
        const token = localStorage.getItem("token");
        if (!token) {
            setError("يجب تسجيل الدخول لاختيار الخطة.");
            return;
        }
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/company/choose-plan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ plan_id: planId }),
            });
    
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "فشل اختيار الخطة");
    
            setSelectedPlan(planId);
            localStorage.setItem("selected_plan", planId.toString());
            setSuccess("✅ تم اختيار الخطة بنجاح!");
    
            // ✅ إعادة تحميل الصفحة بعد 1.5 ثانية لضمان تحديث القائمة الجانبية
            setTimeout(() => {
                window.location.reload();
            }, 1500);
    
        } catch (error: any) {
            setError(error.message);
        }
    };
    

    if (loading) return <p className="text-center mt-6">جارٍ تحميل البيانات...</p>;

    return (
        <div className="flex bg-gray-100 min-h-screen">
            {/* ✅ القائمة الجانبية لأدمن الشركات */}
            <CompanySidebar />

            <main className="flex-1 p-6 w-full max-w-7xl mx-auto"> {/* ✅ جعل العرض أوسع */}
                <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">مقارنة خطط الأسعار</h1>

                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {success && <p className="text-green-500 text-center">{success}</p>}

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-center">
                            <thead>
                                <tr className="bg-blue-900 text-white">
                                    <th className="p-4 text-lg">الميزة</th>
                                    {plans.map((plan) => (
                                        <th key={plan.id} className="p-4 text-lg">
                                            <div className="text-xl font-bold">{plan.name}</div>
                                            <div className="text-lg font-semibold">{plan.price} ريال / شهر</div>
                                            <div className="text-sm text-gray-200">
                                                أقل من: {plan.employee_limit} موظف
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {plans.length > 0 &&
                                    plans[0].categories.map((category, catIndex) => (
                                        <React.Fragment key={catIndex}>
                                            <tr className="bg-gray-300">
                                                <td className="p-4 font-bold text-lg" colSpan={plans.length + 1}>
                                                    {category.category}
                                                </td>
                                            </tr>
                                            {category.features.map((feature) => (
                                                <tr key={feature.id} className="border-t border-gray-300">
                                                    <td className="p-4 bg-gray-200 font-semibold">{feature.name}</td>
                                                    {plans.map((plan) => {
                                                        const planCategory = plan.categories.find((c) => c.category === category.category);
                                                        const planFeature = planCategory?.features.find((f) => f.id === feature.id);

                                                        return (
                                                            <td key={plan.id} className="p-4">
                                                                {planFeature?.available ? "✅" : "❌"}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                            </tbody>
                            {/* ✅ إضافة زر اختيار الخطة أسفل كل عمود */}
                            <tfoot>
                                <tr>
                                    <td className="p-4"></td>
                                    {plans.map((plan) => (
                                        <td key={plan.id} className="p-4">
                                            {selectedPlan === plan.id ? (
                                                <span className="text-green-500 font-bold">✔ الخطة المختارة</span>
                                            ) : (
                                                <button
                                                    onClick={() => handleSelectPlan(plan.id)}
                                                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                                                >
                                                    اختيار الخطة
                                                </button>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
