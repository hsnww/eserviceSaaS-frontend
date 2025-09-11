"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("إرسال طلب استعادة كلمة المرور لـ:", email);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-blue-600 text-white p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-right">
                <img src="../img/light-mode-logo.svg" alt="شعار التطبيق" className="w-48 mx-auto mb-4" />

                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">نسيت كلمة المرور</h2>
                <p className="text-gray-600 text-center mb-4">أدخل بريدك الإلكتروني لاستعادة الحساب</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">البريد الإلكتروني</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                            placeholder="example@email.com"
                            required
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all">
                        إرسال رابط الاستعادة
                    </button>
                </form>
            </div>
        </div>
    );
}
