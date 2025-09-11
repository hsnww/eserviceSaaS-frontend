"use client";
import { useState } from "react";
import { FaEnvelope, FaLock, FaSms } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GuestRoute from "@/app/components/GuestRoute";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [otpRequired, setOtpRequired] = useState(false);
    const [otpMethod, setOtpMethod] = useState("");
    const router = useRouter();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });
    
            const data = await response.json();
            // console.log("🔍 [API RESPONSE] بيانات تسجيل الدخول:", data);
    
            if (!response.ok) {
                if (data.require_otp_verification) {
                    setOtpRequired(true);
                    setOtpMethod(data.otp_method);
                    localStorage.setItem("email", email);
                    return;
                }
                throw new Error(data.message || "فشل تسجيل الدخول");
            }
    
            // ✅ تحديث القيم في localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("email_verified", data.email_verified ? "true" : "false");
            localStorage.setItem("mobile_verified", data.mobile_verified ? "true" : "false"); // ✅ تصحيح الحقل
            localStorage.setItem("company_id", data.require_company ? "null" : data.company_id?.toString()); // ✅ تخزين رقم الشركة بشكل صحيح
    
            // ✅ التوجيه بناءً على البيانات المستلمة
            if (data.require_company) {
                router.push("/register-company");
            } else if (data.role === "admin") {
                router.push("/dashboard/admin");
            } else {
                router.push("/dashboard/company");
            }
        } catch (error) {
            setError(error.message);
        }
    };
    
    
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
    
        try {
            const email = localStorage.getItem("email");
            if (!email) throw new Error("لم يتم العثور على البريد الإلكتروني، يرجى تسجيل الدخول مجددًا.");
    
            // console.log("🔍 إرسال طلب التحقق من OTP:", { email, otp_code: otp }); 
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ email: email, otp_code: otp }), 
            });
    
            const data = await response.json();
            // console.log("🔍 API Response:", data);
    
            if (!response.ok) {
                throw new Error(data.message || "فشل التحقق من OTP");
            }
    
            setSuccess("تم التحقق بنجاح! سيتم تحويلك إلى لوحة التحكم...");
            localStorage.setItem("token", data.token);
    
            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);
        } catch (error: any) {
            setError(error.message);
        }
    };
    return (
        <GuestRoute>
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-blue-600 text-white p-6">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-right">
                    <img src="/img/light-mode-logo.svg" alt="شعار التطبيق" className="w-48 mx-auto mb-4" />

                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">تسجيل الدخول</h2>

                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {success && <p className="text-green-500 text-center">{success}</p>}

                    {!otpRequired ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">البريد الإلكتروني</label>
                                <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white">
                                    <FaEnvelope className="text-gray-500 ml-2" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full outline-none bg-white text-gray-900"
                                        placeholder="example@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">كلمة المرور</label>
                                <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white">
                                    <FaLock className="text-gray-500 ml-2" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full outline-none bg-white text-gray-900"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all">
                                تسجيل الدخول
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <p className="text-gray-700 text-center">
                                تم إرسال رمز التحقق عبر {otpMethod === "email" ? "البريد الإلكتروني" : "رسالة SMS"}.
                            </p>

                            <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white">
                                <FaSms className="text-gray-500 ml-2" />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full outline-none bg-white text-gray-900 text-center text-lg tracking-widest font-bold"
                                    placeholder="••••••"
                                    required
                                />
                            </div>

                            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all font-bold">
                                تأكيد الرمز
                            </button>
                        </form>
                    )}


                    <div className="mt-4 text-center">
                        <p className="text-gray-600">
                            ليس لديك حساب؟{" "}
                            <Link href="/auth/register" className="text-blue-600 hover:underline">
                                تسجيل حساب جديد
                            </Link>
                        </p>
                        <p className="text-gray-600">
                            نسيت كلمة المرور؟{" "}
                            <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
                                استعادة كلمة المرور
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </GuestRoute>
    );
}
