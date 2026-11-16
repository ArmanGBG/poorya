import { PrismaClient, UserRole, MemberTier, OrganizationCategory, VerificationStatus, VerificationMethod, InfluenceLevel, IntimacyLevel, InteractionType, InteractionOutcome } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 شروع ایجاد داده‌های اولیه (Persian Seed Data)...");

  // 1. پاکسازی داده‌های قبلی برای اجرای روان و تست‌های مجدد
  await prisma.auditLog.deleteMany();
  await prisma.discountRedemption.deleteMany();
  await prisma.discountOffer.deleteMany();
  await prisma.partnerBusiness.deleteMany();
  await prisma.interactionLog.deleteMany();
  await prisma.organizationalProfile.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  // --------------------------------------------------------------------------
  // 2. ساخت درختواره استاندارد سازمان‌ها و ادارات (Organizations Tree)
  // --------------------------------------------------------------------------
  console.log("🏢 ایجاد سازمان‌ها و ادارات...");

  // ادارات دولتی
  const taxOffice = await prisma.organization.create({
    data: {
      name: "اداره کل امور مالیاتی استان",
      category: OrganizationCategory.GOVERNMENT_OFFICE,
      city: "تهران",
    },
  });

  const taxBranchValAdd = await prisma.organization.create({
    data: {
      name: "اداره امور مالیاتی ارزش افزوده و اشخاص حقوقی",
      category: OrganizationCategory.GOVERNMENT_OFFICE,
      parentId: taxOffice.id,
      city: "تهران",
    },
  });

  const socialSecurity = await prisma.organization.create({
    data: {
      name: "سازمان تامین اجتماعی - اداره کل غرب",
      category: OrganizationCategory.GOVERNMENT_OFFICE,
      city: "تهران",
    },
  });

  const deedsRegistry = await prisma.organization.create({
    data: {
      name: "اداره کل ثبت اسناد و املاک",
      category: OrganizationCategory.GOVERNMENT_OFFICE,
      city: "تهران",
    },
  });

  // بانک‌ها
  const bankMelli = await prisma.organization.create({
    data: {
      name: "بانک ملی ایران",
      category: OrganizationCategory.BANK,
      city: "تهران",
    },
  });

  const bankMellat = await prisma.organization.create({
    data: {
      name: "بانک ملت - مدیریت شعب استان",
      category: OrganizationCategory.BANK,
      city: "تهران",
    },
  });

  const bankMaskan = await prisma.organization.create({
    data: {
      name: "بانک مسکن - سرپرستی منطقه",
      category: OrganizationCategory.BANK,
      city: "تهران",
    },
  });

  // شهرداری
  const municipalityCentral = await prisma.organization.create({
    data: {
      name: "شهرداری مرکزی (معاونت شهرسازی و درآمد)",
      category: OrganizationCategory.MUNICIPALITY,
      city: "تهران",
    },
  });

  const municipalityDist2 = await prisma.organization.create({
    data: {
      name: "شهرداری منطقه ۲",
      category: OrganizationCategory.MUNICIPALITY,
      parentId: municipalityCentral.id,
      city: "تهران",
    },
  });

  // بهداشت، درمان و دانشگاه
  const medUniversity = await prisma.organization.create({
    data: {
      name: "دانشگاه علوم پزشکی و خدمات درمانی",
      category: OrganizationCategory.HOSPITAL_UNIVERSITY,
      city: "تهران",
    },
  });

  const imamHospital = await prisma.organization.create({
    data: {
      name: "مجتمع بیمارستانی امام خمینی",
      category: OrganizationCategory.HOSPITAL_UNIVERSITY,
      parentId: medUniversity.id,
      city: "تهران",
    },
  });

  // قضایی
  const judiciaryCourt = await prisma.organization.create({
    data: {
      name: "دادگستری کل استان - مجتمع قضایی شهید بهشتی",
      category: OrganizationCategory.JUDICIARY_LAW,
      city: "تهران",
    },
  });

  // اصناف
  const tradeUnion = await prisma.organization.create({
    data: {
      name: "اتاق اصناف و اتحادیه تولیدکنندگان",
      category: OrganizationCategory.GUILD_UNION,
      city: "تهران",
    },
  });

  // صنایع خصوصی
  const industryHolding = await prisma.organization.create({
    data: {
      name: "هلدینگ صنعتی و فناوری پیشرو",
      category: OrganizationCategory.PRIVATE_COMPANY,
      city: "تهران",
    },
  });

  // --------------------------------------------------------------------------
  // 3. ساخت کاربران و نقش‌های سیستمی (RBAC Users)
  // --------------------------------------------------------------------------
  console.log("👥 ایجاد کاربران با سطوح دسترسی مختلف...");

  // الف) پنل اختصاصی نماینده (REPRESENTATIVE_VIP)
  const repUser = await prisma.user.create({
    data: {
      phone: "09121111111",
      fullName: "دکتر حسین نوری (نماینده مردم در مجلس)",
      role: UserRole.REPRESENTATIVE_VIP,
      tier: MemberTier.VIP,
      isPhoneVerified: true,
      neighborhood: "نیاوران",
    },
  });

  // ب) رئیس دفتر نماینده
  const chiefOfStaff = await prisma.user.create({
    data: {
      phone: "09122222222",
      fullName: "مهندس علیرضا رضایی (رئیس دفتر نماینده)",
      role: UserRole.REPRESENTATIVE_VIP,
      tier: MemberTier.VIP,
      isPhoneVerified: true,
      neighborhood: "سعادت‌آباد",
    },
  });

  // ج) سرشاخه معتمد (CONNECTOR)
  const connectorUser = await prisma.user.create({
    data: {
      phone: "09123333333",
      fullName: "حاج قاسم نجفی (معتمد بازار و سرشاخه اصناف)",
      role: UserRole.CONNECTOR,
      tier: MemberTier.VIP,
      isPhoneVerified: true,
      referralCode: "NAJAFI110",
      neighborhood: "بازار بزرگ",
    },
  });

  // د) ادمین دبیرخانه و احراز هویت (ADMIN_VERIFIER)
  const verifierAdmin = await prisma.user.create({
    data: {
      phone: "09124444444",
      fullName: "فاطمه معتمدی (دبیرخانه و مسئول احراز هویت)",
      role: UserRole.ADMIN_VERIFIER,
      tier: MemberTier.VIP,
      isPhoneVerified: true,
      neighborhood: "یوسف‌آباد",
    },
  });

  // ه) ادمین باشگاه تخفیفات (ADMIN_CLUB) - مطلقا فاقد دسترسی به CRM
  const clubAdmin = await prisma.user.create({
    data: {
      phone: "09125555555",
      fullName: "کامران فرهمند (مدیر امور باشگاه و پذیرندگان)",
      role: UserRole.ADMIN_CLUB,
      tier: MemberTier.STANDARD,
      isPhoneVerified: true,
      neighborhood: "گیشا",
    },
  });

  // و) نیروهای سازمانی VIP با موقعیت‌های حساس (Insiders)
  // ۱. پزشک دارای چند سمت همزمان (استاد دانشگاه + بیمارستان)
  const vipDoctor = await prisma.user.create({
    data: {
      phone: "09126666666",
      fullName: "دکتر جواد کاظمی",
      role: UserRole.MEMBER_VIP,
      tier: MemberTier.VIP,
      isPhoneVerified: true,
      referredById: connectorUser.id,
      neighborhood: "ولنجک",
    },
  });

  const profileDocPrimary = await prisma.organizationalProfile.create({
    data: {
      userId: vipDoctor.id,
      organizationId: medUniversity.id,
      customDepartment: "معاونت درمان - اداره نظارت و اعتباربخشی",
      jobTitle: "معاون نظارت درمان و عضو هیئت علمی",
      isPrimary: true,
      verificationStatus: VerificationStatus.VERIFIED,
      verificationMethod: VerificationMethod.CONNECTOR_VOUCH,
      officeDirectPhone: "021-88776655 داخلی ۲۰۴",
      vouchedByUserId: connectorUser.id,
      verifiedByAdminId: verifierAdmin.id,
      verifiedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      influenceLevel: InfluenceLevel.DECISION_MAKER,
      intimacyLevel: IntimacyLevel.INNER_CIRCLE,
      favorBalance: 2, // ۲ بار به او کمک شده (بدهکار به نماینده)
      secretAdminNotes: "همراه کامل با دفتر در امور بیماران بی‌بضاعت حوزه انتخابیه. در بحث تامین تجهیزات ام‌آر‌آی کمک خواست که از وزیر پیگیری کردیم.",
    },
  });

  await prisma.organizationalProfile.create({
    data: {
      userId: vipDoctor.id,
      organizationId: imamHospital.id,
      customDepartment: "بخش جراحی قلب و هیئت امنا",
      jobTitle: "عضو شورای سیاست‌گذاری مجتمع",
      isPrimary: false,
      verificationStatus: VerificationStatus.VERIFIED,
      verificationMethod: VerificationMethod.ADMIN_DIRECT,
      officeDirectPhone: "021-66998877 داخلی ۱۲",
      verifiedByAdminId: verifierAdmin.id,
      verifiedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      influenceLevel: InfluenceLevel.KEY_EXPERT,
      intimacyLevel: IntimacyLevel.INNER_CIRCLE,
      favorBalance: 0,
      secretAdminNotes: "سمت دوم و مشورتی در هیئت امنای بیمارستان.",
    },
  });

  // ۲. کارشناس کلیدی اداره دارایی (امضا طلایی)
  const vipTaxExpert = await prisma.user.create({
    data: {
      phone: "09127777777",
      fullName: "مهندس مهران مرادی",
      role: UserRole.MEMBER_VIP,
      tier: MemberTier.VIP,
      isPhoneVerified: true,
      neighborhood: "ستارخان",
    },
  });

  const profileTax = await prisma.organizationalProfile.create({
    data: {
      userId: vipTaxExpert.id,
      organizationId: taxBranchValAdd.id,
      customDepartment: "دایره رسیدگی اشخاص حقوقی و بخشودگی جرایم",
      jobTitle: "رئیس گروه مالیاتی (امضا طلایی رسیدگی)",
      isPrimary: true,
      verificationStatus: VerificationStatus.VERIFIED,
      verificationMethod: VerificationMethod.OFFICE_LANDLINE_CALL,
      officeDirectPhone: "021-33221144 داخلی ۳۱۰",
      verifiedByAdminId: verifierAdmin.id,
      verifiedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      influenceLevel: InfluenceLevel.KEY_EXPERT,
      intimacyLevel: IntimacyLevel.SUPPORTER,
      favorBalance: -1, // طلبکار: برای یک پرونده به دفتر لطف کرده است
      secretAdminNotes: "فوق‌العاده مسلط به بخشنامه‌های تسهیل بدهی مالیاتی تولیدکنندگان. روحیه منصف و قانون‌مدار.",
    },
  });

  // ۳. مدیر اعتبارات بانک ملی (مورد آزمون Burnout / هشدار نسوزاندن مهره!)
  const vipBankManager = await prisma.user.create({
    data: {
      phone: "09128888888",
      fullName: "بهمن صادقی",
      role: UserRole.MEMBER_VIP,
      tier: MemberTier.VIP,
      isPhoneVerified: true,
      neighborhood: "سیدخندان",
    },
  });

  const profileBank = await prisma.organizationalProfile.create({
    data: {
      userId: vipBankManager.id,
      organizationId: bankMelli.id,
      customDepartment: "اداره امور شعب - دایره اعتبارات و تسهیلات",
      jobTitle: "معاون اعتبارات و تسهیلات منطقه",
      isPrimary: true,
      verificationStatus: VerificationStatus.VERIFIED,
      verificationMethod: VerificationMethod.DOCUMENT_UPLOAD,
      officeDirectPhone: "021-88443322 داخلی ۱۵۰",
      documentUrl: "/private-docs/bank-decree-8888.pdf",
      verifiedByAdminId: verifierAdmin.id,
      verifiedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      influenceLevel: InfluenceLevel.KEY_EXPERT,
      intimacyLevel: IntimacyLevel.INNER_CIRCLE,
      favorBalance: 1,
      secretAdminNotes: "رابط قدیمی دفتر از انتخابات دور قبل. در اعطای وام‌های قرض‌الحسنه ضروری درمان و ازدواج همیشه گره‌گشا بوده است.",
    },
  });

  // ۴. کارشناس شهرداری کمیسیون ماده صد
  const vipMuniExpert = await prisma.user.create({
    data: {
      phone: "09129999999",
      fullName: "مهندس سارا رستمی",
      role: UserRole.MEMBER_VIP,
      tier: MemberTier.VIP,
      isPhoneVerified: true,
      neighborhood: "صادقیه",
    },
  });

  await prisma.organizationalProfile.create({
    data: {
      userId: vipMuniExpert.id,
      organizationId: municipalityCentral.id,
      customDepartment: "دبیرخانه کمیسیون‌های ماده ۱۰۰ قانون شهرداری",
      jobTitle: "کارشناس ارشد انطباق و تهیه لوایح",
      isPrimary: true,
      verificationStatus: VerificationStatus.VERIFIED,
      verificationMethod: VerificationMethod.OFFICE_LANDLINE_CALL,
      officeDirectPhone: "021-96012345 داخلی ۵۵",
      verifiedByAdminId: verifierAdmin.id,
      verifiedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      influenceLevel: InfluenceLevel.KEY_EXPERT,
      intimacyLevel: IntimacyLevel.SUPPORTER,
      favorBalance: 0,
      secretAdminNotes: "مسلط به آرای وحدت رویه دیوان عدالت و پرونده‌های اختلافی شهرسازی.",
    },
  });

  // کاربر عادی که درخواست ارتقا داده (PENDING در صف دبیرخانه)
  const pendingUser = await prisma.user.create({
    data: {
      phone: "09120000002",
      fullName: "حمید تقوی",
      role: UserRole.MEMBER_PUBLIC,
      tier: MemberTier.STANDARD,
      isPhoneVerified: true,
      neighborhood: "تهرانپارس",
    },
  });

  await prisma.organizationalProfile.create({
    data: {
      userId: pendingUser.id,
      organizationId: deedsRegistry.id,
      customDepartment: "واحد اجرای اسناد رسمی و ثبت شرکت‌ها",
      jobTitle: "کارشناس اجرای احکام ثبت",
      isPrimary: true,
      verificationStatus: VerificationStatus.PENDING,
      verificationMethod: VerificationMethod.OFFICE_LANDLINE_CALL,
      officeDirectPhone: "021-66778899 داخلی ۲۴",
      secretAdminNotes: "در انتظار تماس تلفنی تاییدیه توسط دبیرخانه.",
    },
  });

  // کاربر عادی تازه ثبت‌نام کرده
  await prisma.user.create({
    data: {
      phone: "09120000001",
      fullName: "علی اکبری",
      role: UserRole.MEMBER_PUBLIC,
      tier: MemberTier.STANDARD,
      isPhoneVerified: true,
      neighborhood: "پیروزی",
    },
  });

  // --------------------------------------------------------------------------
  // 4. ایجاد لاگ‌های تماس نماینده (شامل سناریوی تست Burnout / نسوزاندن مهره)
  // --------------------------------------------------------------------------
  console.log("📞 ثبت لاگ تعاملات و سناریوی نسوزاندن مهره...");

  // برای بهمن صادقی (بانک ملی) سه تماس در ۱۵ روز اخیر ثبت می‌کنیم تا هشدار نسوزاندن مهره (قرمز) فعال شود!
  await prisma.interactionLog.create({
    data: {
      orgProfileId: profileBank.id,
      loggedByUserId: repUser.id,
      subject: "تسهیلات ۲۰۰ میلیون تومانی درمان سرپرست خانوار بی‌بضاعت",
      type: InteractionType.REQUESTED_FAVOR_FROM_USER,
      outcome: InteractionOutcome.RESOLVED,
      notes: "با دستور شعبه پرداخت شد و متقاضی تماس گرفت و تشکر کرد.",
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // ۱۲ روز پیش
    },
  });

  await prisma.interactionLog.create({
    data: {
      orgProfileId: profileBank.id,
      loggedByUserId: chiefOfStaff.id,
      subject: "استعلام روند تسویه وام اشتغال روستایی یکی از مراجعین",
      type: InteractionType.REQUESTED_FAVOR_FROM_USER,
      outcome: InteractionOutcome.RESOLVED,
      notes: "پرونده بررسی شد، گفت ضامن دوم نیاز دارد که حل شد.",
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // ۶ روز پیش
    },
  });

  await prisma.interactionLog.create({
    data: {
      orgProfileId: profileBank.id,
      loggedByUserId: repUser.id,
      subject: "تبریک روز کارمند و احوالپرسی صمیمانه",
      type: InteractionType.GREETING_CALL,
      outcome: InteractionOutcome.RESOLVED,
      notes: "بسیار خوشحال شد و گفت در خدمت اهداف حوزه انتخابیه است.",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // ۲ روز پیش
    },
  });

  // برای دکتر کاظمی: تماس ۲۵ روز پیش (۱ تماس - وضعیت عادی سبز)
  await prisma.interactionLog.create({
    data: {
      orgProfileId: profileDocPrimary.id,
      loggedByUserId: repUser.id,
      subject: "جلسه مشترک با مجمع نمایندگان استان پیرامون بودجه درمانی",
      type: InteractionType.REQUESTED_FAVOR_FROM_USER,
      outcome: InteractionOutcome.RESOLVED,
      notes: "گزارش کاملی از کمبودهای دارویی ارائه داد.",
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    },
  });

  // برای مهران مرادی (دارایی): تماس ۵ روز پیش (۱ تماس - وضعیت عادی)
  await prisma.interactionLog.create({
    data: {
      orgProfileId: profileTax.id,
      loggedByUserId: repUser.id,
      subject: "استفساریه ماده ۲۵۱ مکرر قانون مالیات‌های مستقیم",
      type: InteractionType.REQUESTED_FAVOR_FROM_USER,
      outcome: InteractionOutcome.RESOLVED,
      notes: "راهکار قانونی مناسبی برای جلوگیری از توقیف حساب‌های کارخانه پیشنهاد کرد.",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  });

  // --------------------------------------------------------------------------
  // 5. ایجاد کسب‌وکارهای همکار و تخفیف‌های باشگاه (Loyalty & Discounts)
  // --------------------------------------------------------------------------
  console.log("🛍️ ایجاد کسب‌وکارهای همکار باشگاه و کدهای تخفیف...");

  // رستوران باغ بهشت
  const rest1 = await prisma.partnerBusiness.create({
    data: {
      name: "رستوران سنتی و فرنگی باغ بهشت",
      category: "رستوران و کافی‌شاپ",
      address: "خیابان ولیعصر، نرسیده به میدان تجریش، پلاک ۱۲۰",
      phone: "021-22110099",
      merchantPin: "4455", // پین ۴ رقمی اختصاصی اعتبارسنجی فروشگاه
      logoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop&q=80",
    },
  });

  await prisma.discountOffer.create({
    data: {
      businessId: rest1.id,
      title: "۲۰٪ تخفیف کل فاکتور برای اعضای باشگاه",
      discountPercent: 20,
      requiredTier: MemberTier.STANDARD,
      terms: "شامل روزهای شنبه تا چهارشنبه، بدون محدودیت سفارش",
    },
  });

  await prisma.discountOffer.create({
    data: {
      businessId: rest1.id,
      title: "۳۵٪ تخفیف VIP به همراه سالادبار رایگان",
      discountPercent: 35,
      requiredTier: MemberTier.VIP,
      terms: "مخصوص اعضای سطح طلایی (VIP)، تمام ایام هفته",
    },
  });

  // کلینیک تخصصی دندانپزشکی
  const clinicDent = await prisma.partnerBusiness.create({
    data: {
      name: "مرکز تخصصی دندانپزشکی نگین سلامت",
      category: "خدمات پزشکی و سلامت",
      address: "میدان ونک، خیابان ملاصدرا، برج سلامت، طبقه ۴",
      phone: "021-88990011",
      merchantPin: "7890",
      logoUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=200&auto=format&fit=crop&q=80",
    },
  });

  await prisma.discountOffer.create({
    data: {
      businessId: clinicDent.id,
      title: "۲۵٪ تخفیف خدمات عمومی، جرم‌گیری و معاینه",
      discountPercent: 25,
      requiredTier: MemberTier.STANDARD,
      terms: "نیاز به رزرو قبلی تلفنی",
    },
  });

  await prisma.discountOffer.create({
    data: {
      businessId: clinicDent.id,
      title: "۴۵٪ تخفیف VIP ایمپلنت و زیبایی دندان",
      discountPercent: 45,
      requiredTier: MemberTier.VIP,
      terms: "ویژه نخبگان و کادر ادارات، با شرایط اقساطی",
    },
  });

  // مجموعه ورزشی و استخر
  const sportsClub = await prisma.partnerBusiness.create({
    data: {
      name: "مجموعه ورزشی و آب‌درمانی البرز",
      category: "ورزش و تندرستی",
      address: "خیابان شریعتی، بالاتر از پل رومی، مجموعه البرز",
      phone: "021-22667788",
      merchantPin: "2345",
      logoUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=80",
    },
  });

  await prisma.discountOffer.create({
    data: {
      businessId: sportsClub.id,
      title: "۳۰٪ تخفیف استخر، سونا و جکوزی",
      discountPercent: 30,
      requiredTier: MemberTier.STANDARD,
      terms: "سانس‌های آقایان و بانوان در تمام روزهای هفته",
    },
  });

  await prisma.discountOffer.create({
    data: {
      businessId: sportsClub.id,
      title: "۵۰٪ تخفیف اشتراک فصلی VIP و مربی اختصاصی",
      discountPercent: 50,
      requiredTier: MemberTier.VIP,
      terms: "تخفیف ویژه طلایی برای اعضا و خانواده درجه یک",
    },
  });

  console.log("✅ بذرگذاری داده‌های اولیه با موفقیت انجام شد.");
}

main()
  .catch((e) => {
    console.error("❌ خطا در اجرای بذرگذاری:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
