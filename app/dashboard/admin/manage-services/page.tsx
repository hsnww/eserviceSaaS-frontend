// "use client";

// import React, { useEffect, useState } from "react";
// import { fetchPlans } from "@/utils/api";

// export default function AdminComparePricing() {
//     const [plans, setPlans] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         async function loadPlans() {
//             try {
//                 const data = await fetchPlans();
//                 setPlans(data);
//             } catch (error) {
//                 console.error("Error fetching plans:", error);
//             } finally {
//                 setLoading(false);
//             }
//         }

//         loadPlans();
//     }, []);

//     const toggleFeature = async (planId, featureId) => {
//         try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/plans/update-feature`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ plan_id: planId, feature_id: featureId }),
//             });
            
//             const result = await response.json();
//             if (result.success) {
//                 setPlans((prevPlans) =>
//                     prevPlans.map((plan) => {
//                         if (plan.id === planId) {
//                             return {
//                                 ...plan,
//                                 categories: plan.categories.map((category) => {
//                                     return {
//                                         ...category,
//                                         features: category.features.map((feature) => {
//                                             if (feature.id === featureId) {
//                                                 return { ...feature, available: result.new_status };
//                                             }
//                                             return feature;
//                                         }),
//                                     };
//                                 }),
//                             };
//                         }
//                         return plan;
//                     })
//                 );
//             }
//         } catch (error) {
//             console.error("Error updating feature status:", error);
//         }
//     };

//     if (loading) return <p className="text-center mt-6">جارٍ تحميل البيانات...</p>;

//     return (
//         <div className="min-h-screen p-6 bg-gray-100">
//             <h1 className="text-3xl font-bold text-center mb-6">إدارة خطط الأسعار</h1>
//             <div className="overflow-x-auto">
//                 <table className="w-full border-collapse border border-gray-300">
//                     <thead>
//                     <tr className="bg-blue-900 text-white">
//                         <th className="p-4">الميزة</th>
//                         {plans.map((plan) => (
//                             <th key={plan.id} className="p-4">
//                                 {plan.name} <br />
//                                 <span className="text-sm">{plan.price} ريال</span>
//                                 <br />
//                                 <span className="text-xs">{plan.employee_limit}</span>
//                             </th>
//                         ))}
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {plans.length > 0 &&
//                         plans[0].categories.map((category, catIndex) => (
//                             <React.Fragment key={catIndex}>
//                                 <tr className="bg-gray-300">
//                                     <td className="p-4 font-bold text-lg" colSpan={plans.length + 1}>
//                                         {category.category}
//                                     </td>
//                                 </tr>
//                                 {category.features.map((feature) => (
//                                     <tr key={feature.id} className="border-t border-gray-300">
//                                         <td className="p-4 bg-gray-200 font-semibold">{feature.name}</td>
//                                         {plans.map((plan) => {
//                                             const planCategory = plan.categories.find((c) => c.category === category.category);
//                                             const planFeature = planCategory?.features.find((f) => f.id === feature.id);

//                                             return (
//                                                 <td 
//                                                     key={plan.id} 
//                                                     className="p-4 text-center cursor-pointer" 
//                                                     onClick={() => toggleFeature(plan.id, feature.id)}
//                                                 >
//                                                     {planFeature?.available ? "✅" : "❌"}
//                                                 </td>
//                                             );
//                                         })}
//                                     </tr>
//                                 ))}
//                             </React.Fragment>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPlans } from "@/utils/api";

export default function AdminComparePricing() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token) {
            router.push("/auth/login");
            return;
        }

        if (role !== "admin") {
            router.push("/dashboard/company");
            return;
        }

        setAuthorized(true);

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
    }, [router]);

    // ✅ إضافة `toggleFeature` لتحديث الحالة عند النقر
    const toggleFeature = async (planId, featureId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/plans/update-feature`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}` // ✅ تأكد من إرسال التوكن
                },
                body: JSON.stringify({ plan_id: planId, feature_id: featureId }),
                credentials: "include", // ✅ تأكد من تضمين `cookies` للمصادقة
            });
    
            const result = await response.json();
            if (result.success) {
                setPlans((prevPlans) =>
                    prevPlans.map((plan) => {
                        if (plan.id === planId) {
                            return {
                                ...plan,
                                categories: plan.categories.map((category) => ({
                                    ...category,
                                    features: category.features.map((feature) =>
                                        feature.id === featureId
                                            ? { ...feature, available: result.new_status }
                                            : feature
                                    ),
                                })),
                            };
                        }
                        return plan;
                    })
                );
            } else {
                console.error("Failed to update feature:", result.message);
            }
        } catch (error) {
            console.error("Error updating feature status:", error);
        }
    };
    

    if (!authorized) {
        return <p className="text-center mt-6 text-red-500">جارٍ التحقق من الصلاحيات...</p>;
    }

    return (
        <main className="flex-1 p-6"> {/* ✅ إزالة `AdminSidebar` لأنه موجود في `layout.tsx` */}
            <h1 className="text-3xl font-bold text-center mb-6">إدارة خطط الأسعار</h1>
            {loading ? (
                <p className="text-center mt-6">جارٍ تحميل البيانات...</p>
            ) : (
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
                                                        <td 
                                                            key={plan.id} 
                                                            className="p-4 text-center cursor-pointer" 
                                                            onClick={() => toggleFeature(plan.id, feature.id)} // ✅ الآن `toggleFeature` معرف
                                                        >
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
            )}
        </main>
    );
}
