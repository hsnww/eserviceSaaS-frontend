"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GuestRoute({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();
    const guestPages = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/verify-email"];

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            router.push("/dashboard"); // إعادة توجيه العضو إلى لوحة التحكم
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    if (isAuthenticated === null) {
        return <p className="text-center text-gray-600">جارِ التحقق...</p>;
    }

    return <>{children}</>;
}
