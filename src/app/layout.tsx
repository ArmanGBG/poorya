import type { Metadata } from "next";
import "./globals.css";
import DevRoleSwitcher from "@/components/DevRoleSwitcher";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "باشگاه متخصصین، نخبگان و حامیان توسعه شهری",
  description:
    "سامانه هوشمند هم‌افزایی نخبگان سازمانی، پیگیری مطالبات شهری و باشگاه خدمات رفاهی و تخفیفات شهروندی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-amber-400 selection:text-slate-900">
        {/* Architectural Fix #7: Development Role-Switcher Banner */}
        <DevRoleSwitcher />

        {/* Global Navigation Bar */}
        <Navbar />

        {/* Main Application Content */}
        <main className="flex-1 pb-16">{children}</main>

        {/* Civic Prestige Footer */}
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
            <div>
              <p className="font-bold text-slate-200 text-sm mb-1">
                باشگاه متخصصین، نخبگان و حامیان توسعه شهری
              </p>
              <p className="text-slate-400">
                شبکه یکپارچه ارتباطی، بهره‌گیری از ظرفیت نخبگان ادارات و ارائه خدمات رفاهی به شهروندان
              </p>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-[11px]">
              <span>سامانه امن ارتباط با کارگروه‌های مشورتی</span>
              <span>•</span>
              <span>احراز هویت بدون نیاز به کد ملی</span>
              <span>•</span>
              <span>نسخه ۲.۴ سازمانی</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
