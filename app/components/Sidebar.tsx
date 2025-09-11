"use client";
import { useState } from "react";

const services = [
    {
        category: "الموارد البشرية",
        items: ["الموظفين", "تقييم الأداء", "الإجازات", "نظام الحضور والانصراف"]
    },
    {
        category: "علاقات العملاء",
        items: ["إدارة العملاء", "التذاكر", "إحصائيات التواصل"]
    },
    {
        category: "التسويق",
        items: ["إدارة الحملات", "إعلانات", "التقارير"]
    },
    {
        category: "المحاسبة",
        items: ["الفواتير", "الضرائب", "إدارة النفقات"]
    },
    {
        category: "التجارة الإلكترونية",
        items: ["إدارة المنتجات", "الطلبات", "الشحن"]
    },
    {
        category: "إدارة المخازن",
        items: ["المخزون", "التوريد", "تقارير المخزون"]
    }
];

export default function Sidebar() {
    const [openCategory, setOpenCategory] = useState<string | null>(null);

    return (
        <div className="w-64 bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-lg font-bold text-gray-700 mb-4">الخدمات</h2>
            <ul>
                {services.map((service, index) => (
                    <li key={index} className="mb-2">
                        <button
                            onClick={() => setOpenCategory(openCategory === service.category ? null : service.category)}
                            className="w-full text-right font-semibold bg-blue-500 text-white py-2 px-4 rounded-lg focus:outline-none"
                        >
                            {service.category}
                        </button>
                        {openCategory === service.category && (
                            <ul className="mt-2 bg-gray-100 p-2 rounded">
                                {service.items.map((item, i) => (
                                    <li key={i} className="text-right text-gray-700 py-1 px-2 hover:bg-gray-200 rounded">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
