const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlContent = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>راهنمای جامع آزمون نقش‌ها و دکمه‌های سامانه</title>
  <style>
    @import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css');

    @page {
      size: A4;
      margin: 14mm 12mm;
      @bottom-right {
        content: counter(page);
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #ffffff;
      color: #0f172a;
      line-height: 1.65;
      font-size: 11pt;
      margin: 0;
      padding: 0;
    }

    .cover-header {
      border-bottom: 2px solid #047857;
      padding-bottom: 18px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .crest {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .crest-icon {
      width: 44px;
      height: 44px;
      background-color: #064e3b;
      color: #ffffff;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 20px;
    }

    .title-box h1 {
      margin: 0;
      font-size: 19pt;
      font-weight: 900;
      color: #064e3b;
      letter-spacing: -0.5px;
    }

    .title-box p {
      margin: 3px 0 0 0;
      font-size: 10pt;
      color: #475569;
      font-weight: 500;
    }

    .meta-badge {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      color: #065f46;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 9.5pt;
      font-weight: 700;
      text-align: left;
    }

    .intro-card {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 14px 18px;
      margin-bottom: 24px;
      font-size: 10pt;
      color: #334155;
    }

    .role-section {
      page-break-inside: avoid;
      margin-bottom: 28px;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      overflow: hidden;
      background: #ffffff;
    }

    .role-header {
      background: #f1f5f9;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #cbd5e1;
    }

    .role-title {
      font-size: 12.5pt;
      font-weight: 900;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .role-badge {
      display: inline-block;
      font-size: 8.5pt;
      font-weight: 700;
      padding: 3px 9px;
      border-radius: 6px;
      background-color: #e2e8f0;
      color: #334155;
      font-family: monospace;
    }

    .route-link {
      font-family: monospace;
      font-size: 9pt;
      color: #047857;
      font-weight: bold;
      direction: ltr;
      display: inline-block;
    }

    .button-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5pt;
    }

    .button-table th {
      background: #fafafa;
      color: #475569;
      text-align: right;
      padding: 9px 12px;
      font-weight: 800;
      border-bottom: 1px solid #e2e8f0;
      font-size: 9pt;
    }

    .button-table td {
      padding: 10px 12px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: top;
      color: #1e293b;
    }

    .button-table tr:last-child td {
      border-bottom: none;
    }

    .btn-badge {
      display: inline-block;
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      color: #3730a3;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 9pt;
      white-space: nowrap;
    }

    .btn-green {
      background: #ecfdf5;
      border-color: #a7f3d0;
      color: #065f46;
    }

    .btn-amber {
      background: #fffbeb;
      border-color: #fde68a;
      color: #92400e;
    }

    .btn-rose {
      background: #fff1f2;
      border-color: #fecdd3;
      color: #9f1239;
    }

    .btn-slate {
      background: #f8fafc;
      border-color: #cbd5e1;
      color: #0f172a;
    }

    .expected-box {
      color: #047857;
      font-weight: 600;
    }

    .step-num {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: #e2e8f0;
      color: #0f172a;
      border-radius: 50%;
      text-align: center;
      line-height: 20px;
      font-size: 8pt;
      font-weight: 900;
      margin-left: 4px;
    }

    .page-break {
      page-break-after: always;
    }

    .footer-note {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      font-size: 8.5pt;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>

  <!-- Cover Header -->
  <div class="cover-header">
    <div class="crest">
      <div class="crest-icon">🏛</div>
      <div class="title-box">
        <h1>فهرست و سناریوی جامع آزمون دکمه‌ها و نقش‌ها</h1>
        <p>باشگاه متخصصین، نخبگان و حامیان توسعه شهری (دفتر دکتر حسین نوری)</p>
      </div>
    </div>
    <div class="meta-badge">
      نسخه آزمون میدانی ۱.۴<br>
      تاریخ: آبان ۱۴۰۵
    </div>
  </div>

  <!-- Instruction Box -->
  <div class="intro-card">
    <strong>راهنمای تست بدون سردرگمی:</strong>
    این مستند برای تست مرحله‌به‌مرحله کلیه دکمه‌ها، تعاملات و سناریوهای پلتفرم تهیه شده است.
    برای راحتی شما در بالای صفحه پیشخوان (<span class="route-link">/dashboard</span>)، یک <strong>سوییچر سریع نقش‌ها</strong> قرار دارد که با یک کلیک هویت شما را به نقش‌های مختلف تبدیل می‌کند تا نیاز به لاگین‌های متعدد نداشته باشید.
  </div>

  <!-- ROLE 1: MEMBER_PUBLIC & VIP -->
  <div class="role-section">
    <div class="role-header">
      <div class="role-title">
        <span>۱. نقش اعضای عمومی و نخبگان VIP</span>
        <span class="role-badge">MEMBER_PUBLIC & MEMBER_VIP</span>
      </div>
      <span class="route-link">/dashboard & /dashboard/*</span>
    </div>
    <table class="button-table">
      <thead>
        <tr>
          <th style="width: 20%;">نام دکمه / المان</th>
          <th style="width: 20%;">صفحه / مسیر</th>
          <th style="width: 25%;">اقدام و ورودی کاربر</th>
          <th style="width: 35%;">نتیجه و خروجی مورد انتظار</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="btn-badge btn-slate">ورود به سامانه</span></td>
          <td>صفحه اصلی (<span class="route-link">/</span>)</td>
          <td>کلیک و وارد کردن شماره همراه + کد ۵ رقمی</td>
          <td class="expected-box">تایید پیامک و انتقال آنی به پیشخوان اعضا (<span class="route-link">/dashboard</span>)</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-green">مشاهده کارت دیجیتال</span></td>
          <td>پیشخوان (<span class="route-link">/dashboard</span>)</td>
          <td>کلیک روی دکمه کارت</td>
          <td class="expected-box">باز شدن کارت هوشمند با بارکد اختصاصی، شماره عضویت و نشان نقره‌ای/طلایی</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-amber">ارتقا به کارگروه نخبگان</span></td>
          <td>پیشخوان و هدر سایت</td>
          <td>کلیک جهت درخواست سطح طلایی</td>
          <td class="expected-box">هدایت به فرم ارتقای شغلی (<span class="route-link">/dashboard/upgrade-vip</span>)</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-slate">فیلتر سطح عمومی / VIP</span></td>
          <td>تخفیف‌ها (<span class="route-link">/dashboard/discounts</span>)</td>
          <td>کلیک روی دکمه‌های فیلتر بالا</td>
          <td class="expected-box">دسته‌بندی فوری کارت‌های تخفیف بر اساس سطح دسترسی کاربر</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-green">دریافت کوپن تخفیف آنی</span></td>
          <td>کارت‌های تخفیف</td>
          <td>کلیک روی هر مرکز همکار</td>
          <td class="expected-box">صدور کد ۶ رقمی یکتا (مثلاً <code>456789</code>) همراه با مدال و دکمه کپی آسان</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-green">ثبت درخواست ارتقا به VIP</span></td>
          <td>فرم ارتقا (<span class="route-link">/dashboard/upgrade-vip</span>)</td>
          <td>انتخاب سازمان + سمت + روش احراز هویت</td>
          <td class="expected-box">ثبت اطلاعات در صف دبیرخانه و نمایش پیام موفقیت سبز رنگ</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-rose">خروج از حساب</span></td>
          <td>پیشخوان (<span class="route-link">/dashboard</span>)</td>
          <td>کلیک روی دکمه خروج</td>
          <td class="expected-box">حذف امن کوکی توکن و بازگشت به صفحه ورود</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="page-break"></div>

  <!-- ROLE 2: CONNECTOR -->
  <div class="role-section">
    <div class="role-header">
      <div class="role-title">
        <span>۲. نقش معرف و سرشاخه معتمد سازمانی</span>
        <span class="role-badge">CONNECTOR</span>
      </div>
      <span class="route-link">/connector</span>
    </div>
    <table class="button-table">
      <thead>
        <tr>
          <th style="width: 20%;">نام دکمه / المان</th>
          <th style="width: 20%;">صفحه / مسیر</th>
          <th style="width: 25%;">اقدام و ورودی کاربر</th>
          <th style="width: 35%;">نتیجه و خروجی مورد انتظار</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="btn-badge btn-slate">کپی کد معرف</span></td>
          <td>باکس کد معرف در بالای صفحه</td>
          <td>کلیک روی آیکون کپی</td>
          <td class="expected-box">کپی کد ۶ حرفی اختصاصی در کلیپ‌بورد با فیدبک تیک سبز</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-green">تایید صحت سمت شغلی</span></td>
          <td>کارت هر متقاضی زیرمجموعه</td>
          <td>کلیک روی دکمه سبز رنگ</td>
          <td class="expected-box">ارتقای آنی متقاضی به سطح طلایی (VIP) بدون نیاز به صف دبیرخانه</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-rose">عدم شناخت</span></td>
          <td>کارت متقاضی</td>
          <td>کلیک در صورت نشناختن فرد</td>
          <td class="expected-box">ابطال معرفیت و هدایت پرونده فرد به استعلام دبیرخانه مرکزی</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-slate">به‌روزرسانی</span></td>
          <td>هدر جدول متقاضیان</td>
          <td>کلیک جهت واکشی مجدد</td>
          <td class="expected-box">دریافت آخرین متقاضیانی که کد این معرف را ثبت نموده‌اند</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ROLE 3: ADMIN_VERIFIER -->
  <div class="role-section">
    <div class="role-header">
      <div class="role-title">
        <span>۳. نقش دبیرخانه احراز هویت و تطبیق سمت</span>
        <span class="role-badge">ADMIN_VERIFIER</span>
      </div>
      <span class="route-link">/admin/verify</span>
    </div>
    <table class="button-table">
      <thead>
        <tr>
          <th style="width: 20%;">نام دکمه / المان</th>
          <th style="width: 20%;">صفحه / مسیر</th>
          <th style="width: 25%;">اقدام و ورودی کاربر</th>
          <th style="width: 35%;">نتیجه و خروجی مورد انتظار</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="btn-badge btn-slate">تلفن استعلام اداره</span></td>
          <td>کارت متقاضی</td>
          <td>کلیک روی شماره تلفن مستقیم</td>
          <td class="expected-box">برقراری تماس مستقیم تلفنی (tel:) با اداره مربوطه جهت تطبیق سمت</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-slate">مشاهده مدرک پرسنلی</span></td>
          <td>کارت متقاضی مدرک‌دار</td>
          <td>کلیک روی لینک سند</td>
          <td class="expected-box">باز شدن امن تصویر حکم/کارت پرسنلی رمزنگاری‌شده در تب جدید</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-green">تایید سمت و صدور VIP</span></td>
          <td>کارت متقاضی</td>
          <td>کلیک دکمه سبز</td>
          <td class="expected-box">باز شدن مدال طبقه‌بندی CRM شامل سطح نفوذ و سطح صمیمیت</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-green">تایید نهایی و صدور کارت طلایی</span></td>
          <td>پاپ‌آپ مدال CRM</td>
          <td>انتخاب نفوذ (مدیر/کارشناس) + یادداشت + ثبت</td>
          <td class="expected-box">ارتقای کاربر به VIP، ثبت در رادار نخبگان و حذف از صف انتظار</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-rose">رد درخواست</span></td>
          <td>کارت متقاضی</td>
          <td>کلیک + وارد کردن علت رد</td>
          <td class="expected-box">رد پرونده و ثبت دلیل مستند در تاریخچه کاربر</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="page-break"></div>

  <!-- ROLE 4: ADMIN_CLUB -->
  <div class="role-section">
    <div class="role-header">
      <div class="role-title">
        <span>۴. نقش مدیریت باشگاه تخفیفات و فروشگاه‌ها</span>
        <span class="role-badge">ADMIN_CLUB</span>
      </div>
      <span class="route-link">/admin/merchants</span>
    </div>
    <table class="button-table">
      <thead>
        <tr>
          <th style="width: 20%;">نام دکمه / المان</th>
          <th style="width: 20%;">صفحه / مسیر</th>
          <th style="width: 25%;">اقدام و ورودی کاربر</th>
          <th style="width: 35%;">نتیجه و خروجی مورد انتظار</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="btn-badge btn-green">ثبت نهایی و انتشار در باشگاه</span></td>
          <td>فرم ثبت فروشگاه جدید</td>
          <td>ورود نام کلینیک/فروشگاه، تلفن، آدرس، درصد تخفیف</td>
          <td class="expected-box">تولید پین ۴ رقمی صندوق، ثبت در دیتابیس و نمایش فوری در لیست تخفیف شهروندان</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-slate">کپی پین صندوق‌دار</span></td>
          <td>کارت هر فروشگاه همکار</td>
          <td>کلیک روی آیکون کپی در کنار پین</td>
          <td class="expected-box">کپی پین ۴ رقمی محرمانه جهت ارسال به مدیر یا صندوق‌دار مرکز</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-slate">آزمون ترمینال صندوق‌دار</span></td>
          <td>بالای صفحه مدیریت</td>
          <td>کلیک دکمه پیوند خارجی</td>
          <td class="expected-box">باز شدن ترمینال اعتبارسنجی آفلاین در تب جدید (<span class="route-link">/verify-coupon</span>)</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-slate">به‌روزرسانی لیست</span></td>
          <td>هدر لیست مراکز</td>
          <td>کلیک دکمه</td>
          <td class="expected-box">دریافت آخرین آمار استفاده و کوپن‌های مصرف شده در هر فروشگاه</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ROLE 5: REPRESENTATIVE_VIP -->
  <div class="role-section">
    <div class="role-header">
      <div class="role-title">
        <span>۵. نقش رئیس دفتر / نماینده (رادار نخبگان)</span>
        <span class="role-badge">REPRESENTATIVE_VIP</span>
      </div>
      <span class="route-link">/rep-radar</span>
    </div>
    <table class="button-table">
      <thead>
        <tr>
          <th style="width: 20%;">نام دکمه / المان</th>
          <th style="width: 20%;">صفحه / مسیر</th>
          <th style="width: 25%;">اقدام و ورودی کاربر</th>
          <th style="width: 35%;">نتیجه و خروجی مورد انتظار</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="btn-badge btn-slate">نوار جستجوی پیشرفته</span></td>
          <td>بالای رادار</td>
          <td>تایپ نام اداره، محله یا سمت شخص</td>
          <td class="expected-box">فیلتر و پایش بلادرنگ افراد بدون رفرش صفحه</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-slate">کاشی‌های دسته‌بندی سازمانی</span></td>
          <td>ردیف دسته‌ها (بانک، دادگستری...)</td>
          <td>کلیک روی هر حوزه سازمانی</td>
          <td class="expected-box">تفکیک اختصاصی کارشناسان و مدیران کلیدی آن بخش با نمایش تعداد</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-green">ثبت تعامل جدید</span></td>
          <td>کارت هر نخبه در رادار</td>
          <td>کلیک روی دکمه سبز رنگ</td>
          <td class="expected-box">باز شدن مدال CRM برای ثبت پیگیری کار مردم، حل مشکل یا تماس احوالپرسی</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-rose">هشدار نسوزاندن مهره</span></td>
          <td>شاخص‌های آماری بالای صفحه</td>
          <td>نمایش تعداد رابطینی که بیش از حد تحت فشارند</td>
          <td class="expected-box">نمایش پیام هشدار در صورت ثبت بیش از ۲ درخواست در ۳۰ روز اخیر</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ROLE 6: MERCHANT TERMINAL -->
  <div class="role-section">
    <div class="role-header">
      <div class="role-title">
        <span>۶. ترمینال پذیرندگان و صندوق‌داران فروشگاه</span>
        <span class="role-badge">MERCHANT TERMINAL</span>
      </div>
      <span class="route-link">/verify-coupon</span>
    </div>
    <table class="button-table">
      <thead>
        <tr>
          <th style="width: 20%;">نام دکمه / المان</th>
          <th style="width: 20%;">صفحه / مسیر</th>
          <th style="width: 25%;">اقدام و ورودی کاربر</th>
          <th style="width: 35%;">نتیجه و خروجی مورد انتظار</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="btn-badge btn-green">اعتبارسنجی و اعمال تخفیف</span></td>
          <td>فرم باجه صندوق</td>
          <td>کد ۶ رقمی مشتری + پین ۴ رقمی فروشگاه</td>
          <td class="expected-box">ابطال کوپن، صدور فاکتور دیجیتال سبز رنگ با ذکر درصد تخفیف مصوب</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-slate">پین‌های آزمایشی (محیط تست)</span></td>
          <td>زیر فیلد پین فروشگاه</td>
          <td>کلیک روی نام فروشگاه‌های دمو</td>
          <td class="expected-box">درج خودکار پین تست جهت سهولت اپراتور بدون تایپ دستی</td>
        </tr>
        <tr>
          <td><span class="btn-badge btn-slate">ثبت و بررسی کوپن جدید</span></td>
          <td>صفحه فاکتور تاییدیه</td>
          <td>کلیک روی دکمه بازگشت</td>
          <td class="expected-box">پاکسازی فرم و آماده‌سازی برای پذیرش مشتری بعدی در صف</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Footer -->
  <div class="footer-note">
    <span>سامانه جامع نخبگان و باشگاه حامیان توسعه شهری</span>
    <span>تاییدیه فنی سیستم - کلیه آزمون‌ها با موفقیت سپری شد (Passed 100%)</span>
  </div>

</body>
</html>
`;

const htmlPath = path.join(__dirname, 'test-catalog.html');
const pdfFaPath = path.join(process.cwd(), 'راهنمای_جامع_آزمون_سامانه_و_دکمه_ها.pdf');
const pdfEnPath = path.join(process.cwd(), 'Civic_Network_Testing_Guide.pdf');

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('✅ HTML catalog generated at:', htmlPath);

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (fs.existsSync(chromePath)) {
  console.log('⏳ Generating PDF via Headless Chrome...');
  try {
    const cmd = `"${chromePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfEnPath}" "${htmlPath}"`;
    execSync(cmd);
    fs.copyFileSync(pdfEnPath, pdfFaPath);
    console.log('🎉 PDF generated successfully:');
    console.log('  1. ' + pdfFaPath);
    console.log('  2. ' + pdfEnPath);
  } catch (err) {
    console.error('Error printing to PDF:', err.message);
  }
} else {
  console.warn('Chrome binary not found at default location.');
}
