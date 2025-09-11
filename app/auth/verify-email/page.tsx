"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
    const [verificationCode, setVerificationCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [resendMessage, setResendMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login?message=session_expired");
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");
        if (!token) {
            setError("يجب تسجيل الدخول أولًا.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    otp: verificationCode,
                    method: "email"
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "حدث خطأ أثناء التحقق.");
            }

            setSuccess("تم تفعيل البريد الإلكتروني بنجاح! سيتم تحويلك للوحة التحكم.");
            
            setTimeout(() => {
                router.push("/dashboard/company");
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResendLoading(true);
        setError("");
        setResendMessage("");

        const token = localStorage.getItem("token");
        if (!token) {
            setError("يجب تسجيل الدخول لإعادة إرسال الرمز.");
            setResendLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/resend-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ method: "email" }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "فشل إعادة إرسال رمز التحقق.");
            }

            setResendMessage("تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-blue-600 text-white p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-right">
                <img src="/img/light-mode-logo.svg" alt="شعار التطبيق" className="w-48 mx-auto mb-4" />

                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">تفعيل البريد الإلكتروني</h2>
                <p className="text-gray-600 text-center mb-4">أدخل الرمز المرسل إلى بريدك الإلكتروني</p>

                {/* عرض رسائل الخطأ والنجاح */}
                {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                {success && <p className="text-green-600 text-center mb-4">{success}</p>}
                {resendMessage && <p className="text-green-500 text-center mb-4">{resendMessage}</p>}

                {/* نموذج إدخال رمز التحقق */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">رمز التحقق</label>
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                            placeholder="أدخل الرمز هنا"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-3 rounded-lg transition-all ${
                            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                        } text-white`}
                        disabled={loading}
                    >
                        {loading ? "جارٍ التحقق..." : "تأكيد التفعيل"}
                    </button>
                </form>

                {/* زر إعادة إرسال رمز التحقق */}
                <button
                    onClick={handleResendOtp}
                    className="w-full mt-4 py-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-100 transition-all"
                    disabled={resendLoading}
                >
                    {resendLoading ? "جارٍ إعادة الإرسال..." : "إعادة إرسال رمز التحقق"}
                </button>
            </div>
        </div>
    );
}
