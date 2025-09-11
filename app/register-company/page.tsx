"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterCompanyPage() {
    const [formData, setFormData] = useState({
        name: "",
        commercial_registration: "",
        tax_number: "",
        phone: "",
        email: "",
        country_id: "",
        region_id: "",
        city_id: "",
        address: "",
    });

    const [countries, setCountries] = useState([]);
    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        // تحميل قائمة الدول
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/countries`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setCountries(data))
            .catch((err) => console.error("Error loading countries:", err));
    }, [router]);

    // تحميل المناطق عند اختيار الدولة
    const handleCountryChange = async (e) => {
        const countryId = e.target.value;
        setFormData({ ...formData, country_id: countryId, region_id: "", city_id: "" });

        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/regions/${countryId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setRegions(data);
        } catch (error) {
            console.error("Error loading regions:", error);
        }
    };

// تحميل المدن عند اختيار المنطقة
    const handleRegionChange = async (e) => {
        const regionId = e.target.value;

        if (!regionId) {
            console.error("❌ خطأ: لم يتم تحديد معرف المنطقة.");
            return;
        }

        setFormData(prev => ({ ...prev, region_id: regionId, city_id: "" }));
        setCities([]); // إعادة تعيين القائمة عند التغيير

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ خطأ: لم يتم العثور على التوكن في localStorage.");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/cities/${regionId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
                mode: "cors", // ✅ مهم لتجنب أخطاء CORS
                credentials: "include", // ✅ يضمن إرسال الكوكيز إذا لزم الأمر
            });

            if (!response.ok) {
                throw new Error(`❌ استجابة غير صالحة (${response.status})`);
            }

            const data = await response.json();
            if (!Array.isArray(data)) {
                throw new Error("❌ استجابة غير متوقعة من السيرفر.");
            }

            setCities(data);
        } catch (error) {
            console.error("🚨 خطأ في تحميل المدن:", error.message);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("المصادقة غير صالحة، يرجى تسجيل الدخول مجددًا.");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/companies`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
                credentials: "include",
                mode: "cors", // ✅ مهم لتجنب أخطاء CORS
            });


            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("الاستجابة غير صالحة، تحقق من إعدادات API في Laravel.");
            }

            const data = await response.json();
            console.log("🔍 API Response:", data);

            if (!response.ok) {
                throw new Error(data.message || "فشل تسجيل الشركة");
            }

            setSuccess("تم تسجيل الشركة بنجاح! سيتم تحويلك إلى لوحة التحكم...");
            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);
        } catch (error) {
            console.error("🚨 Error:", error);
            setError(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-blue-600 text-white p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-right">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">تسجيل الشركة</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && <p className="text-green-500 text-center">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="اسم الشركة" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2 bg-white text-gray-900" />

                    <input type="text" placeholder="السجل التجاري" required value={formData.commercial_registration} onChange={(e) => setFormData({ ...formData, commercial_registration: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2 bg-white text-gray-900" />

                    <input type="text" placeholder="الرقم الضريبي" required value={formData.tax_number} onChange={(e) => setFormData({ ...formData, tax_number: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2 bg-white text-gray-900" />

                    <input type="text" placeholder="رقم الهاتف" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2 bg-white text-gray-900" />

                    <input type="email" placeholder="البريد الإلكتروني" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2 bg-white text-gray-900" />

                    <select required onChange={handleCountryChange} className="w-full border border-gray-300 rounded-lg p-2 bg-white text-gray-900">
                        <option value="">اختر الدولة</option>
                        {countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}
                    </select>

                    <select required disabled={!formData.country_id} onChange={handleRegionChange} className="w-full border border-gray-300 rounded-lg p-2 bg-white text-gray-900">
                        <option value="">اختر المنطقة</option>
                        {regions.map((region) => <option key={region.id} value={region.id}>{region.name}</option>)}
                    </select>

                    <select required disabled={!formData.region_id} onChange={(e) => setFormData({ ...formData, city_id: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2 bg-white text-gray-900">
                        <option value="">اختر المدينة</option>
                        {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
                    </select>

                    <textarea placeholder="العنوان" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2 bg-white text-gray-900" />

                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all">
                        تسجيل الشركة
                    </button>
                </form>
            </div>
        </div>
    );
}
