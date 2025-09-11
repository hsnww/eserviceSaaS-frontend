"use client";
import Link from "next/link";

export default function AdminSidebar() {
    return (
        <aside className="w-64 bg-white shadow-lg rounded-lg p-4">
            <img src="/img/light-mode-logo.svg" alt="شعار التطبيق" className="w-48 mx-auto mb-4" />

            <h2 className="text-lg font-bold text-gray-700 mb-4">إدارة النظام</h2>
            <ul className="space-y-2">
                <li>
                    <Link href="/dashboard/admin" className="block text-right font-semibold bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                        التحكم
                    </Link>
                </li>
                <li>
                    <Link href="/dashboard/admin/manage-services" className="block text-right font-semibold bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                        إدارة الخدمات
                    </Link>
                </li>
            </ul>
        </aside>
    );
}
