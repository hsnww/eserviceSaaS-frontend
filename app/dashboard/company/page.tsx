"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CompanySidebar from "@/app/components/CompanySidebar";

export default function CompanyDashboardPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/user`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                const data = await response.json();
                // console.log("🔍 [API RESPONSE] بيانات المستخدم:", data);

                if (!response.ok) {
                    throw new Error(data.message || "فشل في تحميل البيانات");
                }

                setUser(data);

            } catch (err) {
                setError("فشل تحميل بيانات المستخدم. الرجاء تسجيل الدخول مرة أخرى.");
                localStorage.removeItem("token");
                router.push("/auth/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    if (loading) return <p className="text-gray-700 text-center">جارٍ تحميل البيانات...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    const isEmailVerified = user?.email_verified_at !== null;
    const isMobileVerified = user?.mobile_verified_at !== null;
    const hasCompany = user?.company?.id !== null;
    const planName = user?.company?.plan?.name || "لم تختر أي خطة بعد";

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <CompanySidebar />
            <main className="flex-1 p-6">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl text-right">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">لوحة تحكم الشركات</h2>

                    {/* ✅ بيانات المستخدم */}
                    <p className="text-gray-700 text-center">مرحبًا، {user?.name} 👋</p>
                    <p className="text-gray-500 text-center">{user?.email}</p>

                    {/* ✅ اسم الشركة */}
                    <h3 className="text-xl font-semibold text-gray-800 text-center mt-2">
                        {user?.company?.name || "لم يتم تسجيل شركة بعد"}
                    </h3>

                    {/* ✅ حالة التحقق */}
                    <p className={`text-center ${isEmailVerified ? "text-green-600" : "text-yellow-600"}`}>
                        {isEmailVerified ? "✅ البريد الإلكتروني مفعل" : "🔶 بريدك الإلكتروني غير مفعل."}
                    </p>
                    <p className={`text-center ${isMobileVerified ? "text-green-600" : "text-yellow-600"}`}>
                        {isMobileVerified ? "✅ رقم الجوال مفعل" : "🔶 رقم جوالك غير مفعل."}
                    </p>

                    {/* ✅ حالة الخطة */}
                    <p className="text-center text-gray-600 mt-2">
                        الخطة الحالية: <span className="font-bold">{planName}</span>
                    </p>

                    {/* ✅ إذا كان كل شيء مؤكد، يتم عرض خيارات الداشبورد */}
                    {isEmailVerified && isMobileVerified && hasCompany ? (
                        <div className="mt-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">إدارة شركتك</h3>
                            <ul className="list-disc list-inside text-gray-700">
                                <li><a href="/dashboard/company/info" className="text-blue-500 hover:underline">إدارة بيانات الشركة</a></li>
                                <li><a href="/dashboard/company/employees" className="text-blue-500 hover:underline">إدارة الموظفين</a></li>
                                <li><a href="/dashboard/company/plans" className="text-blue-500 hover:underline">إدارة خطط الاشتراك</a></li>
                            </ul>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center mt-6">
                            يرجى إكمال التحقق وإضافة شركتك للوصول إلى جميع أدوات الإدارة.
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}
