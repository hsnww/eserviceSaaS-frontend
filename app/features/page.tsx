"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaUsers, FaHandshake, FaBullhorn, FaCalculator, FaStore, FaWarehouse } from "react-icons/fa";

const services = [
    {
        category: "الموارد البشرية",
        icon: <FaUsers />,
        description: "إدارة الموظفين، تقييم الأداء، متابعة الحضور والانصراف.",
        items: ["الموظفين", "تقييم الأداء", "الإجازات", "نظام الحضور والانصراف"]
    },
    {
        category: "علاقات العملاء",
        icon: <FaHandshake />,
        description: "إدارة بيانات العملاء، التذاكر، وتحليل التفاعل.",
        items: ["إدارة العملاء", "التذاكر", "إحصائيات التواصل"]
    },
    {
        category: "التسويق",
        icon: <FaBullhorn />,
        description: "إدارة الحملات الإعلانية وتتبع الأداء التسويقي.",
        items: ["إدارة الحملات", "الإعلانات", "تحليل الأداء"]
    },
    {
        category: "المحاسبة",
        icon: <FaCalculator />,
        description: "إدارة الفواتير، الضرائب، وتتبع النفقات المالية.",
        items: ["الفواتير", "الضرائب", "إدارة النفقات"]
    },
    {
        category: "التجارة الإلكترونية",
        icon: <FaStore />,
        description: "إدارة المنتجات، الطلبات، وإجراءات الشحن.",
        items: ["إدارة المنتجات", "متابعة الطلبات", "إعدادات الدفع"]
    },
    {
        category: "إدارة المخازن",
        icon: <FaWarehouse />,
        description: "متابعة المخزون، التوريد، وتقارير المنتجات.",
        items: ["المخزون", "التوريد", "تقارير المخزون"]
    }
];

export default function FeaturesPage() {
    const [selectedService, setSelectedService] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            {/* الهيدر */}
            <header className="flex justify-between items-center p-6 bg-white shadow-md">
                <Image src="/img/eservicec-logo1.svg" alt="Eservice SaaS Logo" width={150} height={50} />
                <nav className="flex gap-6 items-center">
                    <Link href="/" className="text-[#0E59A6] font-semibold hover:underline">الرئيسية</Link>
                    <Link href="/auth/login" className="text-[#0E59A6] font-semibold px-4">تسجيل الدخول</Link>
                    <Link href="/auth/register" className="bg-[#0E59A6] text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">ابدأ الآن</Link>
                </nav>
            </header>

            {/* مقدمة الصفحة */}
            <section className="flex flex-col items-center text-center py-16 bg-gradient-to-r from-blue-900 to-blue-600 text-white p-6">
                <h1 className="text-4xl font-bold mb-4">تعرف على خصائص تطبيقنا</h1>
                <p className="text-lg text-gray-200 max-w-2xl">
                    منصة متكاملة لإدارة الأعمال بسهولة، تتضمن إدارة الموارد البشرية، علاقات العملاء، المحاسبة، التسويق، التجارة الإلكترونية، والمخازن.
                </p>
            </section>

            {/* قائمة الخدمات */}
            <section className="py-16 text-center">
                <h2 className="text-3xl font-bold mb-8">الخدمات المتاحة</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white text-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between items-center cursor-pointer hover:bg-gray-100 transition min-h-[250px]"
                            onClick={() => setSelectedService(selectedService === service.category ? null : service.category)}
                        >
                            {/* أيقونة + عنوان الخدمة */}
                            <div className="flex flex-col items-center">
                                <div className="text-[#0E59A6] text-5xl mb-3 flex justify-center items-center">{service.icon}</div>
                                <h3 className="text-lg font-semibold text-center">{service.category}</h3>
                                <p className="text-sm text-gray-600 text-center">{service.description}</p>
                            </div>

                            {/* عرض العناصر الفرعية أسفل البطاقة عند النقر */}
                            {selectedService === service.category && (
                                <ul className="mt-4 w-full bg-gray-100 p-4 rounded-lg shadow-inner">
                                    {service.items.map((item, i) => (
                                        <li key={i} className="text-right text-gray-800 py-2 px-3 hover:bg-gray-200 rounded transition">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* الفوتر */}
            <footer className="py-6 bg-gray-900 text-white text-center">
                <p>جميع الحقوق محفوظة © {new Date().getFullYear()} Eservice SaaS</p>
            </footer>
        </div>
    );
}
