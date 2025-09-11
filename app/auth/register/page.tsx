"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [otpMethod, setOtpMethod] = useState("email");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (password !== passwordConfirm) {
            setError("كلمة المرور غير متطابقة");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    name,
                    full_name: fullName,
                    email,
                    phone,
                    password,
                    password_confirmation: passwordConfirm,
                    otp_method: otpMethod,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "فشل التسجيل");
            }

            router.push(`/auth/login?message=registered`);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-blue-600 text-white p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg text-right"> {/* ✅ توسيع الكارد */}
                <img src="/img/light-mode-logo.svg" alt="شعار التطبيق" className="w-48 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">تسجيل مستخدم جديد</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ✅ الاسم */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">الاسم</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                            placeholder="الاسم الكامل" required />
                    </div>

                    {/* ✅ البريد الإلكتروني + رقم الجوال متجاوران */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">البريد الإلكتروني</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                                placeholder="example@email.com" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">رقم الجوال</label>
                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                                placeholder="9665XXXXXXXX" required />
                        </div>
                    </div>

                    {/* ✅ طريقة استلام رمز التحقق */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">طريقة استلام رمز التحقق</label>
                        <select value={otpMethod} onChange={(e) => setOtpMethod(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900">
                            <option value="email">البريد الإلكتروني</option>
                            <option value="mobile">رسالة نصية (SMS)</option>
                        </select>
                    </div>

                    {/* ✅ كلمة المرور + تأكيد كلمة المرور متجاوران */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">كلمة المرور</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                                placeholder="••••••••" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">تأكيد كلمة المرور</label>
                            <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                                placeholder="••••••••" required />
                        </div>
                    </div>

                    {/* ✅ زر التسجيل */}
                    <button type="submit" className={`w-full py-3 rounded-lg transition-all ${
                        loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                    } text-white`} disabled={loading}>
                        {loading ? "جارٍ التسجيل..." : "تسجيل"}
                    </button>
                </form>
            </div>
        </div>
    );
}
