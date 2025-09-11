"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("authToken"); // جلب التوكن من Local Storage
        if (!token) {
            router.push("/login"); // إعادة توجيه الضيف إلى صفحة تسجيل الدخول
        } else {
            setIsAuthenticated(true);
        }
    }, []);

    if (isAuthenticated === null) {
        return <p className="text-center text-gray-600">جارِ التحقق...</p>;
    }

    return <>{children}</>;
}
