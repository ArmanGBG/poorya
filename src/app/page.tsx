import Link from "next/link";
import Image from "next/image";
import {
  Compass,
  CreditCard,
  ShieldCheck,
  Tag,
  Users,
  Building,
  ArrowLeft,
  ScanLine,
  PhoneCall,
  CheckCircle2,
  TrendingUp,
  FileCheck2,
  Award,
  ChevronLeft,
  Landmark,
  GraduationCap,
  QrCode,
  HeartPulse,
  Dumbbell,
  Utensils,
  HelpCircle,
  MessageSquareText,
  MapPin,
  Clock,
  Phone,
  Mail,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="text-right">
      {/* 1. Hero Section: Dignified Light Institutional Civic Theme */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Right Column: Hero Headline & Civic Invitation */}
            <div className="lg:col-span-7 text-right space-y-6">
              
              {/* Dignified Institutional Tag */}
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 text-emerald-900 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-2xs">
                <Landmark className="w-4 h-4 text-emerald-700" />
                <span>باشگاه متخصصین، نخبگان و حامیان توسعه شهری</span>
              </div>

              {/* Main Headline with generous Persian line height */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-normal leading-[1.6] sm:leading-[1.65]">
                هم‌افزایی نخبگان سازمانی،
                <br />
                <span className="text-emerald-800 block mt-2">
                  گره‌گشایی از مسائل شهر و خدمات رفاهی
                </span>
              </h1>

              {/* Lead Paragraph with generous breathing room */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-loose max-w-2xl font-normal pt-2">
                شبکه ارتباطی مستقیم میان دکتر حسین نوری (نماینده مردم در مجلس شورای اسلامی)، اساتید دانشگاه و کارشناسان دستگاه‌های اجرایی، همراه با باشگاه خدمات رفاهی و تسهیلات ویژه برای عموم شهروندان.
              </p>

              {/* Clean Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/auth/login"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3.5 px-6 sm:px-7 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-98 flex items-center gap-2.5 cursor-pointer"
                >
                  <span>عضویت سریع بدون نیاز به کد ملی</span>
                  <ArrowLeft className="w-4 h-4 text-slate-300" />
                </Link>

                <Link
                  href="/dashboard/discounts"
                  className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm py-3.5 px-6 rounded-xl transition shadow-2xs cursor-pointer"
                >
                  مشاهده مراکز رفاهی و تخفیف‌ها
                </Link>

                <Link
                  href="/dashboard/upgrade-vip"
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300/80 font-bold text-sm py-3.5 px-6 rounded-xl transition flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>عضویت در کارگروه‌های نخبگان (VIP)</span>
                </Link>
              </div>

            </div>

            {/* Left Column: Official Profile Card of Dr. Hossein Noori */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-md">
                
                {/* Official Portrait */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm aspect-[16/11] bg-slate-100">
                  <Image
                    src="/hero.png"
                    alt="دکتر حسین نوری"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 480px"
                    className="object-cover object-top"
                  />
                  <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs">
                    <span className="bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow">
                      <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                      <span>نماینده مردم در مجلس شورای اسلامی</span>
                    </span>
                    <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg font-bold text-[11px] shadow">
                      رسمی
                    </span>
                  </div>
                </div>

                {/* Profile Header */}
                <div className="mt-5 pb-4 border-b border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                    دکتر حسین نوری
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    موسس باشگاه نخبگان، متخصصین و شبکه هم‌افزایی شهری
                  </p>
                </div>

                {/* Credentials List (Clean, uncrowded) */}
                <div className="mt-4 space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-3 py-1.5 border-b border-slate-50">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    <span className="font-bold">دانش‌آموخته دکتری تخصصی الهیات</span>
                  </div>

                  <div className="flex items-center gap-3 py-1.5 border-b border-slate-50">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    <span className="font-bold">دانش‌آموخته سطح ۳ حوزه علمیه قم</span>
                  </div>

                  <div className="flex items-center gap-3 py-1.5 border-b border-slate-50">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    <span className="font-bold">محقق و تحلیلگر مسائل سیاسی</span>
                  </div>

                  <div className="flex items-center gap-3 py-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    <span className="font-bold">مدرس دانشگاه</span>
                  </div>
                </div>

                {/* Dignified Quote Banner */}
                <div className="mt-5 bg-slate-50 border-r-4 border-slate-800 p-4 rounded-xl text-xs text-slate-700 leading-relaxed font-medium">
                  «توسعه پایدار شهری در گرو پیوند عمیق میان نمایندگان خانه ملت، نخبگان متعهد و مدیران تحول‌آفرین دستگاه‌های اجرایی است.»
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Message & Vision of Founder (دکتر حسین نوری) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Landmark className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-3 text-center md:text-right">
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200/70 px-3.5 py-1 rounded-full text-xs font-bold">
                <span>پیام موسس باشگاه و نماینده مجلس</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 leading-relaxed">
                چرا پیوند نخبگان سازمانی با خانه ملت یک ضرورت راهبردی است؟
              </h2>
              <p className="text-sm text-slate-600 leading-loose font-normal">
                «تصمیم‌گیری‌های کلان در مجلس شورای اسلامی و نظارت میدانی بر دستگاه‌های اجرایی زمانی به نقطه اوج کارآمدی می‌رسد که به شبکه نخبگان کارشناس، امین و دلسوز در بدنه ادارات متصل باشد. این باشگاه بستری است تا ظرفیت کارشناسی اساتید، مدیران و کارمندان متعهد در حل گره‌های شهری و رفع موانع زندگی مردم به کار گرفته شود.»
              </p>
              <div className="pt-2 text-xs font-bold text-slate-800">
                — دکتر حسین نوری <span className="text-slate-500 font-normal">| نماینده مردم در مجلس شورای اسلامی</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Six Specialized Expert Committees (کارگروه‌های شش‌گانه نخبگان) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-slate-200/80 text-slate-800 px-3.5 py-1 rounded-full text-xs font-bold mb-2.5">
            <GraduationCap className="w-3.5 h-3.5 text-slate-700" />
            <span>حوزه‌های فعالیت و هم‌اندیشی</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950">
            کارگروه‌های شش‌گانه مشورتی و تخصصی نخبگان
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
            متخصصان و کارشناسان شاغل در ادارات می‌توانند با عضویت در کارگروه متناسب با تخصص خود، در تصمیم‌سازی‌های حوزه انتخابیه نقش‌آفرینی کنند
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Committee 1 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 transition border border-amber-200/60">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-950 mb-2">
                کارگروه مدیریت و تحول اداری
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                بررسی چالش‌های بروکراتیک، تسریع در حل پرونده‌های مالیاتی و استخدامی، و هماهنگی میان کارشناسان بدنه دستگاه‌های اجرایی استان.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href="/dashboard/upgrade-vip" className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1">
                <span>عضویت کارشناسی در این کارگروه</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Committee 2 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5 group-hover:scale-110 transition border border-teal-200/60">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-950 mb-2">
                کارگروه عمران، مسکن و شهرسازی
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                نظارت و پیگیری پروژه‌های نیمه‌تمام شهری، بازآفرینی بافت‌های فرسوده، اصلاح طرح‌های تفصیلی و تعامل مستمر با شهرداری‌ها.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href="/dashboard/upgrade-vip" className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1">
                <span>عضویت کارشناسی در این کارگروه</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Committee 3 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition border border-emerald-200/60">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-950 mb-2">
                کارگروه بهداشت، درمان و سلامت
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                پایش تجهیزات بیمارستانی و درمانگاه‌ها، مطالبات کادر درمان و پرستاران، و تسهیل خدمات بیمه سلامت و تامین اجتماعی برای اقشار کم‌برخوردار.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href="/dashboard/upgrade-vip" className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1">
                <span>عضویت کارشناسی در این کارگروه</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Committee 4 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition border border-indigo-200/60">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-950 mb-2">
                کارگروه آموزش، دانشگاه و پژوهش
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                ارتباط مستقیم با اعضای هیئت علمی، فرهنگیان آموزش و پرورش، نخبگان حوزوی و دانشگاهی و حمایت از شرکت‌های دانش‌بنیان.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href="/dashboard/upgrade-vip" className="text-xs font-bold text-indigo-800 hover:text-indigo-950 flex items-center gap-1">
                <span>عضویت کارشناسی در این کارگروه</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Committee 5 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5 group-hover:scale-110 transition border border-rose-200/60">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-950 mb-2">
                کارگروه اقتصاد، اصناف و اشتغال
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                پیگیری تسهیلات بانکی برای کارآفرینان جوان، رفع موانع صنفی در اتاق اصناف، حمایت از کسب‌وکارهای خانگی و تولیدکنندگان خرد.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href="/dashboard/upgrade-vip" className="text-xs font-bold text-rose-800 hover:text-rose-950 flex items-center gap-1">
                <span>عضویت کارشناسی در این کارگروه</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Committee 6 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-5 group-hover:scale-110 transition border border-sky-200/60">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-950 mb-2">
                کارگروه حقوقی، صلح و امور قضایی
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                معاضدت‌های حقوقی به شهروندان، مشاوره در تدوین طرح‌ها و لوایح قانونی، و ایجاد صلح و سازش در اختلافات محلی با حضور حقوقدانان و وکلا.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href="/dashboard/upgrade-vip" className="text-xs font-bold text-sky-800 hover:text-sky-950 flex items-center gap-1">
                <span>عضویت کارشناسی در این کارگروه</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Welfare Club & Digital Citizen Cards (باشگاه رفاهی و کارت‌های شهروندی) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3.5 py-1 rounded-full text-xs font-bold mb-3">
              <Tag className="w-3.5 h-3.5 text-amber-700" />
              <span>خدمات ملموس به حامیان و شهروندان</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950">
              باشگاه خدمات رفاهی و کارت شهروندی نگین
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2.5 font-medium leading-relaxed">
              ارائه تخفیف‌های واقعی و بدون واسطه در بیش از ده‌ها مرکز بهداشتی، ورزشی، آموزشی و رفاهی سطح شهر
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Card 1: Silver Card (Public Member) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-sm border border-slate-300 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-950">کارت نقره‌ای شهروندی</h3>
                    <p className="text-xs text-slate-500">عضویت عمومی — آنی و بدون کد ملی</p>
                  </div>
                </div>
                <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
                  ۱۰٪ تا ۲۵٪ تخفیف
                </span>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 mb-8 leading-relaxed">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ثبت‌نام ۳۰ ثانیه‌ای تنها با شماره موبایل (بدون نیاز به کد ملی)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>صدور کارت بارکددار دیجیتال در صفحه کاربری اختصاصی</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>دسترسی به تخفیف مجموعه‌های تفریحی، رستوران‌ها و فروشگاه‌های منتخب</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                <Link
                  href="/auth/login"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl transition flex items-center gap-1.5"
                >
                  <span>دریافت کارت نقره‌ای</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <span className="text-xs text-slate-500 font-medium font-fa-digits">بدون هزینه اشتراک</span>
              </div>
            </div>

            {/* Visual Card 2: Gold VIP Card (Specialists & Elites) */}
            <div className="lg:col-span-6 bg-gradient-to-br from-emerald-50/50 via-white to-amber-50/30 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-md border-2 border-emerald-600/30 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-950">کارت طلایی نخبگان (VIP)</h3>
                    <p className="text-xs text-emerald-800 font-medium">ویژه اعضای کارگروه‌های تخصصی و حامیان</p>
                  </div>
                </div>
                <span className="bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                  تا ۵۰٪ تخفیف طلایی
                </span>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 mb-8 leading-relaxed">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>تخفیف ویژه مراکز تخصصی درمان، دندانپزشکی و کلینیک‌های پاراکلینیک</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>استفاده از سانس‌های اختصاصی مجموعه‌های ورزشی و هتل‌های طرف قرارداد</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>دعوت‌نامه رسمی به جلسات فصلی هم‌اندیشی با دکتر حسین نوری در مجلس</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-emerald-100">
                <Link
                  href="/dashboard/upgrade-vip"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>درخواست ارتقا به کارت طلایی VIP</span>
                </Link>
                <span className="text-xs text-slate-500 font-medium">تایید توسط معرف سازمانی</span>
              </div>
            </div>

          </div>

          {/* Partner Merchants Category Showcase */}
          <div className="mt-12 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-950">
                  دسته‌بندی مراکز همکار و طرف قرارداد باشگاه
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  کارت دیجیتال خود را در هنگام مراجعه به مراکز زیر ارائه دهید
                </p>
              </div>
              <Link
                href="/dashboard/discounts"
                className="text-xs sm:text-sm font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1"
              >
                <span>مشاهده فهرست کامل مراکز و درصد تخفیف‌ها</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 hover:bg-amber-50/50 rounded-2xl p-4 border border-slate-200/70 transition text-center">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2.5">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">کلینیک‌ها و دندانپزشکی</h4>
                <p className="text-[11px] text-slate-500 mt-1">تا ۴۰٪ تخفیف خدمات درمانی</p>
              </div>

              <div className="bg-slate-50 hover:bg-amber-50/50 rounded-2xl p-4 border border-slate-200/70 transition text-center">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-2.5">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">استخر و مجموعه‌های ورزشی</h4>
                <p className="text-[11px] text-slate-500 mt-1">تا ۵۰٪ تخفیف بلیت استخر</p>
              </div>

              <div className="bg-slate-50 hover:bg-amber-50/50 rounded-2xl p-4 border border-slate-200/70 transition text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2.5">
                  <Utensils className="w-5 h-5" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">رستوران‌ها و تالارها</h4>
                <p className="text-[11px] text-slate-500 mt-1">تخفیف سفارش و پذیرایی</p>
              </div>

              <div className="bg-slate-50 hover:bg-amber-50/50 rounded-2xl p-4 border border-slate-200/70 transition text-center">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-2.5">
                  <QrCode className="w-5 h-5" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">تخفیف با بارکد آنی</h4>
                <p className="text-[11px] text-slate-500 mt-1">اسکن در محل بدون کاغذبازی</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. 3-Step Onboarding Journey (مسیر ۳ مرحله‌ای عضویت و مشارکت) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 px-3.5 py-1 rounded-full text-xs font-bold mb-3 border border-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>آسان و بدون معطلی</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950">
            مسیر ۳ مرحله‌ای عضویت و همراهی با باشگاه
          </h2>
          <p className="text-sm text-slate-600 mt-3 font-normal leading-relaxed">
            از ثبت‌نام ساده تا دریافت کارت خدمات رفاهی و مشارکت در تصمیم‌سازی‌های توسعه شهری
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs hover:shadow-md transition relative">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-black text-lg mb-6 border border-slate-200 font-fa-digits">
              ۱
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-950 mb-3">
              ورود سریع با شماره همراه
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-loose">
              بدون نیاز به ثبت کد ملی، بارگذاری مدارک هویتی یا فرم‌های زمان‌بر؛ تنها با دریافت رمز یکبار مصرف در کمتر از ۳۰ ثانیه وارد شوید.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>حفظ کامل محرمانگی داده‌ها</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs hover:shadow-md transition relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-lg mb-6 border border-emerald-200 font-fa-digits">
              ۲
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-950 mb-3">
              انتخاب تخصص یا حامی عمومی
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-loose">
              به عنوان شهروند حامی از خدمات عمومی استفاده کنید، یا در صورت تمایل کارگروه تخصصی سازمانی خود را برای نقش‌آفرینی کارشناسی انتخاب فرمایید.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>پوشش ۱۴ دستگاه اجرایی و دانشگاهی</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs hover:shadow-md transition relative">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-black text-lg mb-6 border border-slate-200 font-fa-digits">
              ۳
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-950 mb-3">
              صدور کارت دیجیتال و تخفیف‌ها
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-loose">
              کارت هوشمند شهروندی اختصاصی شما بلافاصله صادر می‌شود. بارکد آن را در مراکز رفاهی طرف قرارداد ارائه دهید و از تخفیف‌های ویژه بهره‌مند شوید.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>استفاده آنی در سراسر شهر</span>
            </div>
          </div>

        </div>

        {/* Step CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-4 px-8 rounded-xl shadow-sm transition active:scale-98"
          >
            <span>همین حالا عضو باشگاه شوید</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. Direct Citizen Voice & Idea Submission (میز ارتباط مستقیم مردمی و ثبت ایده) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-2xs">
                <MessageSquareText className="w-4 h-4 text-emerald-700" />
                <span>میز خدمت و پاسخگویی خانه ملت</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 leading-snug">
                صدای شما، پشتوانه تصمیم‌سازی‌های
                <br />
                <span className="text-emerald-800">
                  دکتر حسین نوری در مجلس شورای اسلامی
                </span>
              </h2>

              <p className="text-sm text-slate-600 leading-loose max-w-2xl font-normal">
                اگر صاحب ایده نوآورانه برای توسعه شهر هستید، یا با مانع اداری و معضل شهری روبرو شده‌اید، پیام شما به صورت مستقیم در دبیرخانه کارگروه‌های تخصصی باشگاه ثبت، کد رهگیری صادر و جهت اقدام به دفتر نماینده منعکس می‌شود.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-700" />
                    <span>ثبت ایده و پیشنهاد توسعه‌ای</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    طرح‌های علمی و کاربردی برای حل چالش‌های مسکن، محیط‌زیست، اشتغال و آموزش.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>پیگیری مطالبات و مشکلات اداری</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    انعکاس موانع اداری و ناهماهنگی دستگاه‌های اجرایی جهت پیگیری و تذکر قانونی نماینده.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-sm transition"
                >
                  <MessageSquareText className="w-4 h-4" />
                  <span>ورود به سامانه و ثبت پیام یا ایده</span>
                </Link>
              </div>
            </div>

            {/* Quick Contact & Consultation Notice Card */}
            <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
              <h3 className="text-base sm:text-lg font-black text-slate-950 flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-emerald-700" />
                <span>اطلاعات دفتر ارتباطات مردمی</span>
              </h3>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">آدرس دفتر مرکزی:</span>
                    <span>دفتر مراجعات مردمی دکتر حسین نوری (نماینده مردم در مجلس شورای اسلامی)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">ساعات پاسخگویی حضوری و تلفنی:</span>
                    <span className="font-fa-digits">شنبه تا چهارشنبه از ساعت ۸:۳۰ الی ۱۶:۰۰</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">خط مستقیم دبیرخانه باشگاه:</span>
                    <span className="font-fa-digits text-slate-900 font-bold dir-ltr inline-block">۰۲۱-۶۴۴۵۱۱۱۱</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                کلیه پیام‌های ارسال‌شده در سامانه، به صورت الکترونیکی کد رهگیری دریافت کرده و بدون واسطه به رویت نماینده مجلس می‌رسد.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. Frequently Asked Questions (پرسش‌های متداول) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 px-3.5 py-1 rounded-full text-xs font-bold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
            <span>پاسخ به سوالات پرتکرار</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950">
            پرسش‌های متداول شهروندان و نخبگان
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
            پاسخ شفاف به مهم‌ترین پرسش‌ها درباره فرآیند عضویت، امنیت داده‌ها و خدمات رفاهی
          </p>
        </div>

        <div className="space-y-4">
          {/* FAQ Item 1 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:border-amber-300 transition">
            <h3 className="text-sm sm:text-base font-black text-slate-950 mb-2 flex items-center gap-2">
              <span className="text-amber-500 font-bold">۰۱.</span>
              <span>آیا برای ثبت‌نام و دریافت کارت باشگاه نیاز به ارائه کد ملی یا مدارک شناسایی است؟</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pr-7">
              خیر؛ این سامانه برای احترام به حریم خصوصی شهروندان و کارشناسان اداری طراحی شده است. ثبت‌نام اولیه و صدور کارت نقره‌ای شهروندی تنها با شماره تلفن همراه و رمز یکبار مصرف در کمتر از ۳۰ ثانیه انجام می‌پذیرد و هیچ نیازی به کد ملی نیست.
            </p>
          </div>

          {/* FAQ Item 2 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:border-amber-300 transition">
            <h3 className="text-sm sm:text-base font-black text-slate-950 mb-2 flex items-center gap-2">
              <span className="text-amber-500 font-bold">۰۲.</span>
              <span>اعضای کارگروه‌های تخصصی نخبگان (کارت طلایی VIP) چگونه تایید می‌شوند؟</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pr-7">
              فرآیند احراز هویت کارشناسان سازمانی از طریق شبکه معتمدین و رابطین سازمانی انجام می‌گیرد تا شأن کارشناسان اداری کاملاً محفوظ مانده و بدون بروکراسی به کارگروه‌های تخصصی متصل شوند.
            </p>
          </div>

          {/* FAQ Item 3 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:border-amber-300 transition">
            <h3 className="text-sm sm:text-base font-black text-slate-950 mb-2 flex items-center gap-2">
              <span className="text-amber-500 font-bold">۰۳.</span>
              <span>تخفیف‌های رفاهی در مراکز طرف قرارداد چگونه اعمال می‌شود؟</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pr-7">
              پس از ورود به حساب کاربری، یک کارت دیجیتال هوشمند حاوی بارکد اختصاصی به شما نمایش داده می‌شود. کافی است در هنگام مراجعه به مراکز طرف قرارداد (درمانگاه، استخر، رستوران یا فروشگاه) کارت را روی صفحه گوشی به متصدی پذیرش نشان دهید تا تخفیف روی صورتحساب اعمال گردد.
            </p>
          </div>

          {/* FAQ Item 4 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:border-amber-300 transition">
            <h3 className="text-sm sm:text-base font-black text-slate-950 mb-2 flex items-center gap-2">
              <span className="text-amber-500 font-bold">۰۴.</span>
              <span>آیا پیشنهادات و طرح‌های ارسالی مستقیماً توسط نماینده مجلس بررسی می‌شوند؟</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pr-7">
              بله؛ تمامی ایده‌ها و گزارش‌های ارسالی توسط کارشناسان دبیرخانه کارگروه مربوطه بررسی اولیه شده و طرح‌های کاربردی در جلسات منظم هفتگی به صورت مستقیم در اختیار دکتر حسین نوری جهت پیگیری در مجلس شورای اسلامی قرار می‌گیرد.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Official Civic Footer (پاورقی رسمی شبکه نخبگان و دفتر نماینده) */}
      <footer className="bg-slate-950 text-white border-t border-white/10 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            {/* Col 1: Identity */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-lg">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white">باشگاه متخصصین و حامیان توسعه شهری</h4>
                  <p className="text-[11px] text-amber-300">دفتر ارتباطات مردمی دکتر حسین نوری (نماینده مجلس)</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                سامانه پیوند نخبگان سازمانی، دانشگاهی و حوزوی با خانه ملت؛ بستری برای هم‌اندیشی، پیگیری مطالبات بر زمین‌مانده شهر و ارائه خدمات رفاهی ملموس به حامیان گرامی.
              </p>
            </div>

            {/* Col 2: Fast Links */}
            <div className="lg:col-span-3 space-y-3">
              <h5 className="text-xs font-black text-amber-300 uppercase tracking-wider">دسترسی سریع</h5>
              <ul className="space-y-2 text-xs text-slate-400 font-medium">
                <li>
                  <Link href="/auth/login" className="hover:text-white transition">ورود سریع به حساب کاربری</Link>
                </li>
                <li>
                  <Link href="/dashboard/discounts" className="hover:text-white transition">مراکز رفاهی و تخفیف‌ها</Link>
                </li>
                <li>
                  <Link href="/dashboard/upgrade-vip" className="hover:text-white transition">عضویت در کارگروه‌های تخصصی</Link>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-white transition">میز خدمت و ثبت ایده شهری</Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Principles & Commitment */}
            <div className="lg:col-span-4 space-y-3">
              <h5 className="text-xs font-black text-amber-300 uppercase tracking-wider">تعهدات و استانداردهای سامانه</h5>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>عدم ذخیره‌سازی کد ملی به منظور حفظ حریم خصوصی</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>نظارت مستقیم و مستمر نماینده مردم در مجلس</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>پیگیری مطالبات مردمی در مراجع قانونی ذی‌ربط</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>
              © کلیه حقوق مادی و معنوی این سامانه متعلق به شبکه حامیان و متخصصین توسعه شهری است.
            </p>
            <p className="text-slate-400">
              فعالیت در چارچوب قوانین جمهوری اسلامی ایران
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
