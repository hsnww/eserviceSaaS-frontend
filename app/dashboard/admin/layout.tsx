import AdminSidebar from "@/app/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar /> {/* ✅ القائمة الجانبية */}
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
