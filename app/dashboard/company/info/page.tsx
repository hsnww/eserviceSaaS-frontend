"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CompanySidebar from "@/app/components/CompanySidebar";

export default function EditCompanyPage() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        employees_count: "",
        logo: "",
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
    const [logoPreview, setLogoPreview] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();
    const [companyId, setCompanyId] = useState<number | null>(null);

    // ✅ تحميل بيانات الشركة عند تحميل الصفحة
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("يجب تسجيل الدخول");

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/companies`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("فشل تحميل بيانات الشركة.");

                const data = await response.json();
                // console.log("🔍 [API RESPONSE] بيانات الشركة:", data);

                setCompanyId(data.id); 

                setFormData({
                    name: data.name ?? "",
                    description: data.description ?? "",
                    employees_count: data.employees_count ?? "",
                    logo: data.logo ?? "",
                    commercial_registration: data.commercial_registration ?? "",
                    tax_number: data.tax_number ?? "",
                    phone: data.phone ?? "",
                    email: data.email ?? "",
                    country_id: data.country_id ?? "",
                    region_id: data.region_id ?? "",
                    city_id: data.city_id ?? "",
                    address: data.address ?? "",
                });

                if (data.country_id) fetchRegions(data.country_id);
                if (data.region_id) fetchCities(data.region_id);

            } catch (error) {
                console.error("❌ خطأ في جلب بيانات الشركة:", error);
                setError(error.message);
            }
        };

        fetchCompany();
        fetchCountries();
    }, []);

    // ✅ تحميل قائمة الدول عند تحميل الصفحة
    const fetchCountries = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("يجب تسجيل الدخول");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/countries`, {
                headers: { "Authorization": `Bearer ${token}` },
            });

            const data = await response.json();
            setCountries(data);
        } catch (error) {
            console.error("❌ خطأ في تحميل الدول:", error);
        }
    };

    // ✅ تحميل المناطق عند اختيار الدولة
    const fetchRegions = async (countryId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/regions/${countryId}`, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            const data = await response.json();
            setRegions(data);
        } catch (error) {
            console.error("❌ خطأ في تحميل المناطق:", error);
        }
    };

    // ✅ تحميل المدن عند اختيار المنطقة
    const fetchCities = async (regionId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/cities/${regionId}`, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            const data = await response.json();
            setCities(data);
        } catch (error) {
            console.error("❌ خطأ في تحميل المدن:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCountryChange = (e) => {
        const countryId = e.target.value;
        setFormData({ ...formData, country_id: countryId, region_id: "", city_id: "" });
        setRegions([]);
        setCities([]);
        fetchRegions(countryId);
    };

    const handleRegionChange = (e) => {
        const regionId = e.target.value;
        setFormData({ ...formData, region_id: regionId, city_id: "" });
        setCities([]);
        fetchCities(regionId);
    };

    const handleLogoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        // ✅ عرض معاينة الشعار قبل الرفع
        setLogoPreview(URL.createObjectURL(file));
    
        const token = localStorage.getItem("token");
        if (!token) {
            setError("يجب تسجيل الدخول");
            return;
        }
    
        const formData = new FormData();
        formData.append("logo", file);
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/companies/${companyId}/update-logo`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }, // لا تضف Content-Type يدويًا
                body: formData,
            });
    
            const data = await response.json();
    
            if (!response.ok) throw new Error(data.message || "فشل رفع الشعار");
    
            // ✅ تحديث واجهة المستخدم بعد نجاح الرفع
            setSuccess("تم رفع الشعار بنجاح!");
            setFormData((prev) => ({ ...prev, logo: data.logo }));
            setLogoPreview(`/${data.logo}`);
        } catch (error) {
            console.error("❌ خطأ في رفع الشعار:", error);
            setError(error.message);
        }
    };
    
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
    
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("يجب تسجيل الدخول");
    
            if (!companyId) throw new Error("لا يوجد معرف شركة صالح");
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/companies/${companyId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) throw new Error("فشل تحديث بيانات الشركة.");
    
            const data = await response.json();
            // console.log("✅ [API RESPONSE] تم تحديث الشركة:", data);
    
            setSuccess("تم تحديث بيانات الشركة بنجاح!");
        } catch (error) {
            console.error("❌ خطأ في التحديث:", error);
            setError(error.message);
        }
    };
    

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <CompanySidebar />
            <main className="flex-1 p-6">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl text-right">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">تعديل بيانات الشركة</h2>

                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {success && <p className="text-green-500 text-center">{success}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label>اسم الشركة</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                        <label>رفع الشعار</label>
                        <input type="file" name="logo" onChange={handleLogoChange} className="w-full p-2 border rounded-lg" />
                        {logoPreview && <img src={logoPreview} alt="شعار الشركة" className="w-32 h-32 mt-2 rounded-lg" />}

                        <label>عدد الموظفين</label>
                        <input type="number" name="employees_count" value={formData.employees_count} onChange={handleChange} className="w-full p-2 border rounded-lg" />

                        <label>الوصف</label>
                        <textarea name="description" value={formData.description || ""} onChange={handleChange} className="w-full p-2 border rounded-lg" />

                        <label>الدولة</label>
                        <select name="country_id" value={formData.country_id} onChange={handleCountryChange} className="w-full p-2 border rounded-lg">
                            <option value="">اختر الدولة</option>
                            {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>

                        <label>المنطقة</label>
                        <select name="region_id" value={formData.region_id} onChange={handleRegionChange} className="w-full p-2 border rounded-lg">
                            <option value="">اختر المنطقة</option>
                            {regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>

                        <label>المدينة</label>
                        <select name="city_id" value={formData.city_id} onChange={handleChange} className="w-full p-2 border rounded-lg">
                            <option value="">اختر المدينة</option>
                            {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <label>العنوان</label>
                        <textarea name="address" value={formData.address || ""} onChange={handleChange} className="w-full p-2 border rounded-lg" />


                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all">
                            حفظ التعديلات
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
