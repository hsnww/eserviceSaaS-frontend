"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/app/components/AdminSidebar";
import CompanySidebar from "@/app/components/CompanySidebar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");

        console.log("🔍 التحقق من المستخدم:", { token, userRole });

        if (!token || !userRole) {
            console.log("❌ لا يوجد توكن أو دور، إعادة التوجيه إلى تسجيل الدخول");
            router.replace("/auth/login");
            return;
        }

        if (role !== userRole) {
            setRole(userRole);
            setLoading(false);
        }
    }, [router, role]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-center text-gray-700">جارٍ التحقق من البيانات...</p>
            </div>
        );
    }

    return (
        <div className="flex bg-gray-100 min-h-screen">
            {role === "admin" ? <AdminSidebar /> : <CompanySidebar />}
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}
