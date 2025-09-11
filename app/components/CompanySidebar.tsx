"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Feature {
    id: number;
    name: string;
    available: boolean;
    link?: string;
}

interface Category {
    category: string;
    features: Feature[];
}

interface Plan {
    id: number;
    name: string;
    categories: Category[];
}

interface Company {
    id: number;
    name: string;
    plan: Plan | null;
}

export default function CompanySidebar() {
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [openCategory, setOpenCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
    
            if (!token) return;
    
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/user`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
    
                const data = await response.json();
                // console.log("🔍 [API RESPONSE] بيانات الشركة:", JSON.stringify(data.company, null, 2));
    
                  
                setCompany(data.company || null);
            } catch (error) {
                console.error("❌ فشل في جلب بيانات الشركة:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchUser();
    }, []);
    

    if (loading) {
        return <p className="text-gray-600 text-center">جارٍ تحميل القائمة...</p>;
    }

    return (
        <aside className="w-72 bg-white shadow-lg rounded-lg p-4">
            <img src="/img/light-mode-logo.svg" alt="شعار التطبيق" className="w-48 mx-auto mb-4" />

            <h2 className="text-lg font-bold text-gray-700 mb-4">إدارة الشركة</h2>
            <ul className="space-y-2">
                <li>
                    <Link href="/dashboard/company" className="block text-right font-semibold bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                        لوحة التحكم
                    </Link>
                </li>

                {company?.plan && (
                    <>
                        <h3 className="text-md font-semibold text-gray-700 mt-4 mb-2">الخطة: {company.plan.name}</h3>

                        <ul className="space-y-1">
                            {company.plan.categories.map((category, index) => {
                                const availableFeatures = category.features.filter(f => f.available);

                                return availableFeatures.length > 0 ? (
                                    <li key={index} className="mb-2">
                                        <button
                                            onClick={() => setOpenCategory(openCategory === category.category ? null : category.category)}
                                            className="w-full text-right font-bold bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all"
                                        >
                                            {category.category}
                                        </button>

                                        {openCategory === category.category && (
                                            <ul className="mt-2 space-y-1 pl-4">
                                                {availableFeatures.map((feature) => {
                                                    const featureLink = feature.link && feature.link.trim() !== "" ? `/dashboard/company/${decodeURIComponent(feature.link)}` : "#";
                                                    // console.log(`🔗 [Feature]: ${feature.name}, Link: ${feature.link}, Processed Link: ${featureLink}`);
                                                    return (
                                                        <li key={feature.id}>
                                                            <Link href={featureLink} className="block text-right font-medium text-blue-600 py-2 px-4 hover:bg-gray-200 rounded-lg">
                                                                {feature.name}
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                ) : null;
                            })}
                        </ul>
                    </>
                )}

                <li>
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.href = "/auth/login";
                        }}
                        className="w-full block text-right font-semibold bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                    >
                        تسجيل الخروج
                    </button>
                </li>
            </ul>
        </aside>
    );
}


