"use client";
import Image from "next/image";
import Link from "next/link";
import { FaUsers, FaHandshake, FaBullhorn, FaCalculator, FaStore, FaWarehouse } from "react-icons/fa";
import { useRef } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import Navbar from "@/app/components/Navbar";

export default function HomePage() {
    const servicesRef = useRef<HTMLDivElement>(null);
    const pricingRef = useRef<HTMLDivElement>(null);
    const techRef = useRef<HTMLDivElement>(null);
    const testimonialsRef = useRef<HTMLDivElement>(null);

  
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <Navbar servicesRef={servicesRef} testimonialsRef={testimonialsRef} pricingRef={pricingRef} techRef={techRef} />

            {/* مقدمة التطبيق */}
            <section className="flex flex-col md:flex-row items-center justify-center text-center md:text-right py-16 bg-white">
                <div className="max-w-2xl p-6">
                    <h1 className="text-4xl font-bold text-gray-900">إدارة أعمالك بسهولة مع Eservice SaaS</h1>
                    <p className="text-lg mt-4 text-gray-700">تطبيق متكامل لإدارة الموارد البشرية، المحاسبة، والمزيد. متوفر على الويب والجوال.</p>
                    <Link href="/features" className="mt-6 inline-block bg-[#0E59A6] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition">
                        تعرف على الخصائص
                    </Link>
                </div>
                <div className="p-6">
                    <Image src="/img/Responsive-Web-Design-main-image.jpg" alt="Laptop and Mobile" width={500} height={350} />
                </div>
            </section>

            {/* قائمة الخدمات */}
            <section ref={servicesRef} className="py-16 bg-gray-100 text-center"> 
                <h2 className="text-3xl font-bold mb-8">الخدمات المتاحة</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {[
                        { icon: FaUsers, title: "الموارد البشرية", description: "إدارة الموظفين والإجازات والحضور والانصراف" },
                        { icon: FaHandshake, title: "علاقات العملاء", description: "متابعة العملاء وتقديم الدعم الفوري" },
                        { icon: FaBullhorn, title: "التسويق", description: "إدارة الحملات الإعلانية وتتبع الأداء" },
                        { icon: FaCalculator, title: "المحاسبة", description: "إدارة الفواتير، النفقات، والضرائب" },
                        { icon: FaStore, title: "التجارة الإلكترونية", description: "إدارة المنتجات والطلبات والشحن" },
                        { icon: FaWarehouse, title: "إدارة المخازن", description: "متابعة المخزون وتقارير المنتجات" }
                    ].map((service, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                            <service.icon className="text-5xl text-[#0E59A6]" />
                            <h3 className="text-xl font-bold mt-4">{service.title}</h3>
                            <p className="text-gray-600 mt-2">{service.description}</p>
                        </div>
                    ))}
                </div>
            </section>
            {/* قالوا عنا */}
            <section ref={testimonialsRef} className="py-16 text-center bg-white">
                <h2 className="text-3xl font-bold">ماذا قالوا عنا؟</h2>
                <div className="mt-8 flex flex-wrap justify-center gap-6">
                    {[
                        { image: "/img/user-placeholder.png", name: "محمد حسين", position: "مدير موارد بشرية - شركة النور", testimonial: "تطبيق رائع! سهّل علينا إدارة فرق العمل بشكل كبير!", rating: 5 },
                        { image: "/img/user-placeholder.jpg", name: "فاطمة منصور", position: "مديرة تسويق - مؤسسة النجاح", testimonial: "أفضل حل SaaS لإدارة الموارد البشرية. أنصح الجميع به!", rating: 4 },
                        { image: "/img/user-placeholder.png", name: "خالد علي", position: "محاسب قانوني - مكتب المحاسبة المتكامل", testimonial: "أداة قوية لتنظيم الفواتير وتتبع المصروفات بكل دقة!", rating: 3 }
                    ].map((review, index) => (
                        <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-md max-w-sm text-center">
                            <Image src={review.image} alt={review.name} width={80} height={80} className="rounded-full mx-auto" />
                            <h3 className="mt-4 text-xl font-semibold">{review.name}</h3>
                            <p className="text-gray-600 text-sm">{review.position}</p>
                            {/* عرض التقييم بالنجوم */}
                            <div className="flex justify-center mt-2 text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    i < review.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
                                ))}
                            </div>
                            <p className="mt-4 text-gray-700 italic">"{review.testimonial}"</p>
                        </div>
                    ))}
                </div>
            </section>


            {/* خطط الاشتراك */}
            <section ref={pricingRef} className="py-16 text-center">
                <h2 className="text-3xl font-bold">خطط الاشتراك الشهرية</h2>
                <div className="mt-8 flex flex-wrap justify-center gap-6">
                    {[
                        { title: "مجاني", details: "أقل من 5 موظفين", price: "0 ريال", features: ["إدارة الموظفين", "إدارة العملاء"] },
                        { title: "برونزي", details: "6 - 10 موظفين", price: "50 ريال/شهر", features: ["كل ميزات الخطة المجانية", "إدارة التسويق", "تحليل البيانات"] },
                        { title: "فضي", details: "11 - 30 موظف", price: "100 ريال/شهر", features: ["كل ميزات الخطة البرونزية", "إدارة المخازن", "تقارير متقدمة"] },
                        { title: "ذهبي", details: "31 - 50 موظف", price: "200 ريال/شهر", features: ["كل ميزات الخطة الفضية", "دعم فني مميز", "إدارة كاملة للمبيعات"] },
                        { title: "مخصص", details: "أكثر من 50 موظف", price: "اتصل بالمبيعات", features: ["كل الميزات", "تكامل متقدم", "استشارات مخصصة"] }
                    ].map((plan, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md w-64 flex flex-col items-center">
                            <h3 className="text-xl font-bold">{plan.title}</h3>
                            <p className="text-gray-600">{plan.details}</p>
                            <p className="text-gray-800 font-bold mt-2">{plan.price}</p>
                            <ul className="text-gray-600 mt-4 text-sm">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="py-1">✅ {feature}</li>
                                ))}
                            </ul>
                            <Link href="/auth/register" className="mt-4 bg-[#0E59A6] text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
                                تسجيل في الخدمة
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* التقنيات المستخدمة */}
            <section ref={techRef} className="py-16 text-center bg-gray-200">
                <h2 className="text-3xl font-bold">التقنيات المستخدمة</h2>
                <div className="mt-8 flex justify-center gap-6">
                    <Image src="/img/nextjs1.png" alt="Next.js" width={80} height={80} />
                    <Image src="/img/react11.png" alt="React" width={80} height={80} />
                    <Image src="/img/typescript.png" alt="React" width={80} height={80} />
                    <Image src="/img/tailwind4.png" alt="Tailwind CSS" width={80} height={80} />
                    <Image src="/img/laravel7.png" alt="Laravel" width={80} height={80} />
                    <Image src="/img/sms2.png" alt="SMS" width={80} height={80} />
                </div>
            </section>

            {/* الفوتر */}
            <footer className="py-6 bg-gradient-to-r from-blue-900 to-[#0E59A6] text-white text-center">
                <p>جميع الحقوق محفوظة © {new Date().getFullYear()} Eservice SaaS</p>
            </footer>

        </div>
    );
}
