"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() { // ✅ إزالة AdminSidebar من هنا
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
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

        const fetchUser = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/user`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    credentials: "include",
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "فشل في تحميل البيانات");
                }

                setUser(data);
            } catch (err) {
                setError(err.message);
                localStorage.removeItem("token");
                router.push("/auth/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    return (
        <main className="flex-1 p-6"> {/* ✅ الاحتفاظ فقط بالمحتوى الرئيسي */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl text-right">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">لوحة تحكم الأدمن</h2>

                {loading ? (
                    <p className="text-gray-700 text-center">جاري تحميل البيانات...</p>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : (
                    <div>
                        <p className="text-gray-700 text-center">مرحبًا، {user?.name} 👋</p>
                        <p className="text-gray-500 text-center">{user?.email}</p>
                    </div>
                )}

                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            router.push("/auth/login");
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                    >
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        </main>
    );
}
