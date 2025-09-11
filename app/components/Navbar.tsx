"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

export default function Navbar({ servicesRef, testimonialsRef, pricingRef, techRef }: { 
    servicesRef: React.RefObject<HTMLDivElement>;
    testimonialsRef: React.RefObject<HTMLDivElement>;
    pricingRef: React.RefObject<HTMLDivElement>;
    techRef: React.RefObject<HTMLDivElement>;
}) {
    const [menuOpen, setMenuOpen] = useState(false);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref?.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
            setMenuOpen(false); // إغلاق القائمة بعد التنقل
        }
    };

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center relative">
            {/* لوجو الموقع */}
            <Image 
                src="/img/light-mode-logo.svg" 
                alt="Eservice SaaS Logo" 
                width={200} 
                height={200} 
                layout="intrinsic" 
            />


            {/* زر القائمة للجوال */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-[#0E59A6] text-2xl">
                {menuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </button>

            {/* قائمة الروابط */}
            <nav className={`absolute md:static top-16 left-0 w-full bg-white shadow-md md:shadow-none md:w-auto md:flex flex-col md:flex-row gap-4 items-center p-4 md:p-0 transition-all duration-300 ${menuOpen ? "block" : "hidden"}`}>
                <button onClick={() => scrollToSection(servicesRef)} className="text-[#0E59A6] font-semibold hover:underline w-full text-center md:w-auto">الخدمات</button>
                <button onClick={() => scrollToSection(testimonialsRef)} className="text-[#0E59A6] font-semibold hover:underline w-full text-center md:w-auto">قالوا عنا</button>
                <button onClick={() => scrollToSection(pricingRef)} className="text-[#0E59A6] font-semibold hover:underline w-full text-center md:w-auto">الأسعار</button>
                <button onClick={() => scrollToSection(techRef)} className="text-[#0E59A6] font-semibold hover:underline w-full text-center md:w-auto">التقنيات</button>
                <Link href="/auth/login" className="text-[#0E59A6] font-semibold px-4 w-full text-center md:w-auto">تسجيل الدخول</Link>
                <Link href="/auth/register" className="bg-[#0E59A6] text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition w-full text-center md:w-auto">ابدأ الآن</Link>
            </nav>
        </header>
    );
}
