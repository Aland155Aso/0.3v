import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Record<string, Record<Language, string>> = {
  home: { en: 'Home', ku: 'سەرەتا', ar: 'الرئيسية' },
  shop: { en: 'Shop', ku: 'فرۆشگا', ar: 'المتجر' },
  about: { en: 'About', ku: 'دەربارە', ar: 'عننا' },
  contact: { en: 'Contact', ku: 'پەیوەندی', ar: 'اتصل بنا' },
  cart: { en: 'Cart', ku: 'سەبەتە', ar: 'السلة' },
  hero_title: { en: 'Premium Supplements for Your Health & Performance', ku: 'تەواوکەری خۆراکی نایاب بۆ تەندروستی و توانای تۆ', ar: 'مكملات غذائية ممتازة لصحتك وأدائك' },
  shop_now: { en: 'Shop Now', ku: 'ئێستا بکڕە', ar: 'تسوق الآن' },
  featured_products: { en: 'Featured Products', ku: 'بەرهەمە دیارەکان', ar: 'المنتجات المميزة' },
  categories: { en: 'Categories', ku: 'هاوپۆلەکان', ar: 'الفئات' },
  add_to_cart: { en: 'Add to Cart', ku: 'بۆ سەبەتە', ar: 'أضف إلى السلة' },
  price: { en: 'Price', ku: 'نرخ', ar: 'السعر' },
  quantity: { en: 'Quantity', ku: 'بڕ', ar: 'الكمية' },
  total: { en: 'Total', ku: 'کۆ', ar: 'المجموع' },
  checkout: { en: 'Checkout', ku: 'پارەدان', ar: 'الدفع' },
  empty_cart: { en: 'Your cart is empty', ku: 'سەبەتەکەت بەتاڵە', ar: 'سلتك فارغة' },
  mission: { en: 'Our Mission', ku: 'ئەرکی ئێمە', ar: 'مهمتنا' },
  vision: { en: 'Our Vision', ku: 'دیدگای ئێمە', ar: 'رؤيتنا' },
  name: { en: 'Name', ku: 'ناو', ar: 'الاسم' },
  email: { en: 'Email', ku: 'ئیمەیڵ', ar: 'البريد الإلكتروني' },
  message: { en: 'Message', ku: 'نامە', ar: 'الرسالة' },
  send: { en: 'Send Message', ku: 'نامە بنێرە', ar: 'إرسال الرسالة' },
  dark_mode: { en: 'Dark Mode', ku: 'دۆخی تاریک', ar: 'الوضع الليلي' },
  light_mode: { en: 'Light Mode', ku: 'دۆخی ڕووناک', ar: 'الوضع النهاري' },
  best_seller: { en: 'Best Seller', ku: 'پڕفرۆشترین', ar: 'الأكثر مبيعاً' },
  our_products: { en: 'Our Products', ku: 'بەرهەمەکانمان', ar: 'منتجاتنا' },
  on_sale: { en: 'On Sale', ku: 'داشکاندن', ar: 'تخفيضات' },
  skin_care: { en: 'Skin Care', ku: 'پێست', ar: 'العناية بالبشرة' },
  herbs: { en: 'Herbs', ku: 'تەواوکەری خۆراکی', ar: 'الأعشاب' },
  vitamins: { en: 'Vitamins', ku: 'ڤیتامینەکان', ar: 'الفيتامينات' },
  pre_workout: { en: 'Pre-workout', ku: 'پێش ڕاهێنان', ar: 'قبل التمرين' },
  creatine: { en: 'Creatine', ku: 'کریتین', ar: 'كرياتين' },
  accessories: { en: 'Accessories', ku: 'پێداویستییەکان', ar: 'إكسسوارات' },
  healthy_lifestyle: { en: 'Healthy Lifestyle', ku: 'ژیانی تەندروست', ar: 'نمط حياة صحي' },
  info: { en: 'Info', ku: 'زانیاری', ar: 'معلومات' },
  learn_more: { en: 'Learn More', ku: 'زیاتر بزانە', ar: 'تعلم المزيد' },
  see_more: { en: 'See More', ku: 'زیاتر ببینە', ar: 'شاهد المزيد' },
  view_all: { en: 'View All', ku: 'هەمووی ببینە', ar: 'عرض الكل' },
  quality_assured: { en: 'Quality Assured', ku: 'بەرزترین کوالێتی', ar: 'جودة مضمونة' },
  genuine_products: { en: '100% genuine products', ku: '١٠٠٪ بەرهەماکانمان ئۆرجیناڵە ', ar: 'منتجات أصلية 100%' },
  fast_delivery_feature: { en: 'Fast Delivery', ku: 'گەیاندنی خێرا و سەلامەت', ar: 'توصيل سريع' },
  delivery_time: { en: 'Within 24-48 hours', ku: 'لەماوەی ٢٤ -٤٨ کاتژمێر دەگاتە دەستت', ar: 'خلال 24-48 ساعة' },
  best_prices_feature: { en: 'Best Prices', ku: 'گوونجاوترین نرخ', ar: 'أفضل الأسعار' },
  market_rates: { en: 'Competitive market rates', ku: 'بەرهەمێک زۆر هەرزان بوو مەرج نییە کوالێتی بەرز بێت', ar: 'أسعار تنافسية' },
  instant_support_feature: { en: 'Instant Support', ku: 'باشترین خزمەتگوزاری', ar: 'دعم فوري' },
  customer_support_247: { en: '24/7 customer service', ku: 'بەردەوام لە خزمەت کریارانداین', ar: 'خدمة عملاء 24/7' },
  currency: { en: 'IQD', ku: 'دینار', ar: 'دینار' },
  more_info: { en: 'More Info', ku: 'زانیاری زیاتر', ar: 'مزيد من المعلومات' },
  customer_info: { en: 'Customer Information', ku: 'زانیاری کڕیار', ar: 'معلومات العميل' },
  customer_name: { en: 'Customer Name', ku: 'ناوی کڕیار', ar: 'اسم العميل' },
  customer_phone: { en: 'Customer Phone Number', ku: 'ژمارەی مۆبایلی کڕیار', ar: 'رقم هاتف العميل' },
  customer_address: { en: 'Customer Address', ku: 'ناونیشانی کڕیار', ar: 'عنوان العميل' },
  select_city: { en: 'Select City', ku: 'شار هەڵبژێرە', ar: 'اختر المدينة' },
  order: { en: 'Order', ku: 'داواکردن', ar: 'طلب' },
  delivery_fee: { en: 'Delivery Fee', ku: 'کرێی گەیاندن', ar: 'رسوم التوصيل' },
  suggested_usage: { en: 'Suggested Usage', ku: 'ژەمی پێشنیار کراو', ar: 'الاستخدام المقترح' },
  caution: { en: 'Caution', ku: 'ئاگەداری', ar: 'تحذير' },
  supplement_facts: { en: 'Supplement Facts', ku: 'ژەمی خۆراکی', ar: 'حقائق المكملات' },
  buy_items: { en: 'Buy Items', ku: 'ئێستا بیکڕە', ar: 'اشترِ الآن' },
  hero_subtitle: { 
    en: 'Fuel your journey with the highest quality supplements. Scientifically formulated for maximum results.', 
    ku: 'گەشتی ژیانت درێزتر بکە بە وەرگرتنی ڤیتامینی سوودبەخش و تەواوکرەی خۆراکی بەسوود',
    ar: 'عزز رحلتك بأجود المكملات الغذائية. تم تركيبها علمياً لتحقيق أقصى قدر من النتائج.'
  },
  wellness_hub_title: { 
    en: 'Health & Wellness Hub', 
    ku: 'زانیاری تەندرووستی', 
    ar: 'مركز الصحة والعافية' 
  },
  wellness_hub_desc: { 
    en: 'Expert tips and guides for your fitness journey.', 
    ku: 'هەموو زانیارە بەسسودەکان و تویژنەوە تازەکان لێرە بڵاو دەکریتەوە', 
    ar: 'نصائح وأدلة الخبراء لرحلة لياقتك البدنية.' 
  },
  our_story: { en: 'Our Story', ku: 'چیرۆکی ئێمە', ar: 'قصتنا' },
  about_desc1: { 
    en: 'Bio Supplements was founded with a simple goal: to provide athletes and health enthusiasts in the region with access to premium, authentic, and effective supplements.', 
    ku: 'بایۆ سەپلیمێنت دامەزرا بە ئامانجێکی سادە: دابینکردنی تەواوکەری خۆراکی نایاب و ڕەسەن بۆ وەرزشوانان و ئارەزوومەندانی تەندروستی لە ناوچەکەدا.',
    ar: 'تأسست Bio Supplements بهدف بسيط: تزويد الرياضيين وعشاق الصحة في المنطقة بإمكانية الوصول إلى مكملات غذائية ممتازة وأصلية وفعالة.'
  },
  about_desc2: { 
    en: 'Today, we are proud to be a leading provider of sports nutrition, vitamins, and wellness products.', 
    ku: 'ئەمڕۆ، ئێمە شانازی دەکەین بەوەی کە دابینکەرێکی پێشەنگی خۆراکی وەرزشی و ڤیتامین و بەرهەمەکانی تەندروستین.',
    ar: 'اليوم، نحن فخورون بأن نكون مزوداً رائداً للتغذية الرياضية والفيتامينات ومنتجات العافية.'
  },
  happy_clients: { en: 'Happy Clients', ku: 'کڕیاری دڵخۆش', ar: 'عميل سعيد' },
  authentic: { en: 'Authentic', ku: 'ڕەسەن', ar: 'أصلي' },
  top_brands: { en: 'Top Brands', ku: 'براندە سەرەکییەکان', ar: 'أفضل الماركات' },
  lab_tested: { en: 'Lab Tested', ku: 'پشکنینی تاقیگە', ar: 'مفحوص مخبرياً' },
  mission_desc: { 
    en: 'To inspire and enable people to live healthier, more active lives by providing the best nutritional tools and knowledge.', 
    ku: 'بۆ ئیلهامبەخشین و تواناکردنی خەڵک بۆ ئەوەی ژیانێکی تەندروستتر و چالاکتر بژین لە ڕێگەی دابینکردنی باشترین ئامراز و زانیارییە خۆراکییەکان.',
    ar: 'لإلهام وتمكين الناس من عيش حياة أكثر صحة ونشاطاً من خلال توفير أفضل الأدوات والمعرفة الغذائية.'
  },
  vision_desc: { 
    en: 'To be the most trusted and innovative supplement provider in the Middle East, recognized for our commitment to quality and customer success.', 
    ku: 'بۆ ئەوەی ببینە جێی متمانەترین و داهێنەرترین دابینکەری تەواوکەری خۆراکی لە ڕۆژهەڵاتی ناوەڕاست.',
    ar: 'أن نكون مزود المكملات الغذائية الأكثر ثقة وابتكاراً في الشرق الأوسط، والمعروف بالتزامنا بالجودة ونجاح العملاء.'
  },
  contact_desc: { 
    en: "Have questions about our products or your order? We're here to help. Reach out to our team anytime.", 
    ku: 'پرسیارت هەیە دەربارەی بەرهەمەکانمان یان داواکارییەکەت؟ ئێمە لێرەین بۆ یارمەتیدان.',
    ar: 'لديك أسئلة حول منتجاتنا أو طلبك؟ نحن هنا للمساعدة. تواصل مع فريقنا في أي وقت.'
  },
  get_in_touch: { en: 'Get in Touch', ku: 'پەیوەندیمان پێوە بکە', ar: 'تواصل معنا' },
  call_us: { en: 'Call Us', ku: 'پەیوەندیمان پێوە بکە', ar: 'اتصل بنا' },
  visit_us: { en: 'Visit Us', ku: 'سەردانمان بکە', ar: 'زورونا' },
  business_hours: { en: 'Business Hours', ku: 'کاتەکانی کارکردن', ar: 'ساعات العمل' },
  mon_fri: { en: 'Monday - Friday', ku: 'دووشەممە - هەینی', ar: 'الاثنين - الجمعة' },
  sat: { en: 'Saturday', ku: 'شەممە', ar: 'السبت' },
  sun: { en: 'Sunday', ku: 'یەکشەممە', ar: 'الأحد' },
  closed: { en: 'Closed', ku: 'داخراوە', ar: 'مغلق' },
  message_placeholder: { en: 'How can we help you?', ku: 'چۆن دەتوانین یارمەتیت بدەین؟', ar: 'كيف يمكننا مساعدتك؟' },
  message_sent: { en: 'Message Sent!', ku: 'نامەکە نێردرا!', ar: 'تم إرسال الرسالة!' },
  error_message: { en: 'Something went wrong. Please try again later.', ku: 'هەڵەیەک ڕوویدا. تکایە دواتر هەوڵ بدەرەوە.', ar: 'حدث خطأ ما. يرجى المحاولة مرة أخرى لاحقاً.' },
  knowledge_title: { en: 'Knowledge for a Better You', ku: 'زانیاری بۆ تۆیەکی باشتر', ar: 'معرفة من أجل ذات أفضل' },
  knowledge_desc: { 
    en: 'Explore our latest articles, guides, and tips on nutrition, supplements, and fitness.', 
    ku: 'نوێترین وتار و ڕێنمایی و ئامۆژگارییەکانمان دەربارەی خۆراک و تەواوکەرەکان و فیتنس بپشکنە.',
    ar: 'استكشف أحدث مقالاتنا وأدلتنا ونصائحنا حول التغذية والمكملات واللياقة البدنية.'
  },
  read_article: { en: 'Read Article', ku: 'وتارەکە بخوێنەرەوە', ar: 'اقرأ المقال' },
  no_articles: { en: 'No articles yet', ku: 'هێشتا هیچ وتارێک نییە', ar: 'لا توجد مقالات بعد' },
  stay_updated: { en: 'Stay Updated', ku: 'ئاگاداربە', ar: 'ابقَ على اطلاع' },
  newsletter_desc: { en: 'Subscribe to our newsletter for the latest tips and offers.', ku: 'ببە بە ئەندام لە نامەکانمان بۆ نوێترین ئامۆژگاری و ئۆفەرەکان.', ar: 'اشترك في نشرتنا الإخبارية للحصول على أحدث النصائح والعروض.' },
  subscribe: { en: 'Subscribe', ku: 'بەشداربە', ar: 'اشتراك' },
  sort_by: { en: 'Sort By', ku: 'ڕیزکردن بەپێی', ar: 'ترتيب حسب' },
  newest: { en: 'Newest First', ku: 'نوێترینەکان', ar: 'الأحدث أولاً' },
  price_low: { en: 'Price: Low to High', ku: 'نرخ: کەم بۆ زۆر', ar: 'السعر: من الأقل للأعلى' },
  price_high: { en: 'Price: High to Low', ku: 'نرخ: زۆر بۆ کەم', ar: 'السعر: من الأعلى للأقل' },
  top_rated: { en: 'Top Rated', ku: 'بەرزترین هەڵسەنگاندن', ar: 'الأعلى تقييماً' },
  price_range: { en: 'Price Range', ku: 'مەودای نرخ', ar: 'نطاق السعر' },
  availability: { en: 'Availability', ku: 'بەردەستبوون', ar: 'التوفر' },
  all_items: { en: 'All Items', ku: 'هەموو بەرهەمەکان', ar: 'كل العناصر' },
  in_stock: { en: 'In Stock', ku: 'بەردەستە', ar: 'متوفر' },
  out_of_stock: { en: 'Out of Stock', ku: 'بەردەست نییە', ar: 'نفدت الكمية' },
  free_shipping: { en: 'Free Shipping!', ku: 'گەیاندنی بێبەرامبەر!', ar: 'توصيل مجاني!' },
  shipping_offer: { en: 'On orders over $100.', ku: 'بۆ داواکاری سەروو ١٠٠ دۆلار.', ar: 'للطلبات التي تزيد عن 100 دولار.' },
  no_products: { en: 'No products found', ku: 'هیچ بەرهەمێک نەدۆزرایەوە', ar: 'لم يتم العثور على منتجات' },
  clear_filters: { en: 'Clear all filters', ku: 'پاککردنەوەی هەموو فلتەرەکان', ar: 'مسح كل الفلاتر' },
  items_total: { en: 'Items total', ku: 'کۆی بەرهەمەکان', ar: 'إجمالي العناصر' },
  back: { en: 'Back', ku: 'گەڕانەوە', ar: 'رجوع' },
  reviews: { en: 'Reviews', ku: 'هەڵسەنگاندنەکان', ar: 'المراجعات' },
  related_products: { en: 'Related Products', ku: 'بەرهەمە پەیوەندیدارەکان', ar: 'منتجات ذات صلة' },
  customer_reviews: { en: 'Customer Reviews', ku: 'هەڵسەنگاندنی کڕیاران', ar: 'مراجعات العملاء' },
  write_review: { en: 'Write a Review', ku: 'هەڵسەنگاندن بنووسە', ar: 'اكتب مراجعة' },
  no_reviews: { en: 'No reviews yet', ku: 'هێشتا هیچ هەڵسەنگاندنێک نییە', ar: 'لا توجد مراجعات بعد' },
  secure_payment: { en: 'Secure Payment', ku: 'پارەدانی پارێزراو', ar: 'دفع آمن' },
  fast_shipping: { en: 'Fast Shipping', ku: 'گەیاندنی خێرا', ar: 'شحن سريع' },
  returns_30_days: { en: '30 Day Returns', ku: 'گەڕانەوە لە ٣٠ ڕۆژدا', ar: 'إرجاع خلال 30 يوماً' },
  empty_cart_desc: { en: "Looks like you haven't added anything to your cart yet. Explore our premium supplements and start your fitness journey today!", ku: 'وادیارە هێشتا هیچت بۆ سەبەتەکەت زیاد نەکردووە. بەرهەمە نایابەکانمان بپشکنە و گەشتەکەت دەست پێبکە!', ar: 'يبدو أنك لم تضف أي شيء إلى سلتك بعد. استكشف مكملاتنا الممتازة وابدأ رحلتك اليوم!' },
  free: { en: 'FREE', ku: 'بێبەرامبەر', ar: 'مجاني' },
  cart_footer_badges: { en: 'Secure SSL Encryption • 30-Day Returns • 24/7 Support', ku: 'پاراستنی پارەدان • گەڕانەوە لە ٣٠ ڕۆژدا • خزمەتگوزاری ٢٤ کاتژمێر', ar: 'تشفير SSL آمن • إرجاع خلال 30 يوماً • دعم 24/7' },
  search: { en: 'Search products...', ku: 'گەڕان بۆ بەرهەمەکان...', ar: 'البحث عن المنتجات...' },
  all_categories: { en: 'All Categories', ku: 'هەموو جۆرەکان', ar: 'جميع الفئات' },
  all_rights_reserved: { en: 'All rights reserved.', ku: 'هەموو مافەکان پارێزراوە.', ar: 'جميع الحقوق محفوظة.' },
  shipping_policy: { en: 'Shipping Policy', ku: 'یاساکانی گەیاندن', ar: 'سياسة الشحن' },
  privacy_policy: { en: 'Privacy Policy', ku: 'پاراستنی زانیارییەکان', ar: 'سياسة الخصوصية' },
  premium_quality: { en: 'Premium Quality Supplements', ku: 'تەواوکەری خۆراکی کوالێتی بەرز', ar: 'مكملات غذائية عالية الجودة' },
  categories_desc: { en: 'Explore our wide range of premium health and fitness products.', ku: 'بگەڕێ بەناو کۆمەڵە بەرهەمە نایابەکانمان بۆ تەندروستی و وەرزش.', ar: 'استكشف مجموعتنا الواسعة من منتجات الصحة واللياقة البدنية المتميزة.' },
  testimonials_title: { en: 'What Our Athletes Say', ku: 'ئەوەی وەرزشوانەکانمان دەڵێن', ar: 'ماذا يقول رياضيونا' },
  testimonials_desc: { en: 'Real results from real people who trust Bio Supplements.', ku: 'ئەنجامی ڕاستەقینە لە کەسانی ڕاستەقینەوە کە متمانەیان بە بایۆ سەپڵیمێنت هەیە.', ar: 'نتائج حقيقية من أشخاص حقيقيين يثقون في بايو سابليمنت.' },
  testimonial1_text: { en: 'The mass gainer here is the best I have ever used. Clean calories and great taste.', ku: 'باشترین ماس گەینەرە کە تا ئێستا بەکارم هێنابێت. کالۆری پاک و تامی زۆر خۆشە.', ar: 'مكمل زيادة الوزن هنا هو الأفضل الذي استخدمته على الإطلاق. سعرات حرارية نظيفة وطعم رائع.' },
  testimonial1_role: { en: 'Bodybuilder', ku: 'یاریزانی لەشجوانی', ar: 'لاعب كمال أجسام' },
  testimonial2_text: { en: 'I recommend Bio Supplements to all my clients. Quality and transparency are top-notch.', ku: 'پێشنیاری بایۆ سەپڵیمێنت دەکەم بۆ هەموو کڕیارەکانم. کوالێتی و ڕوونییان لە ئاستێکی زۆر بەرزدایە.', ar: 'أوصي ببايو سابليمنت لجميع عملائي. الجودة والشفافية في أعلى المستويات.' },
  testimonial2_role: { en: 'Fitness Coach', ku: 'ڕاهێنەری وەرزشی', ar: 'مدرب لياقة بدنية' },
  testimonial3_text: { en: 'Fast delivery and amazing customer service. The pre-workout gives me insane focus.', ku: 'گەیاندنی خێرا و خزمەتگوزاری کڕیارانی نایاب. پری-وۆرک ئاوتەکە تەرکیزێکی زۆر باشم پێ دەبەخشێت.', ar: 'شحن سريع وخدمة عملاء مذهلة. مكمل ما قبل التمرين يمنحني تركيزاً خيالياً.' },
  testimonial3_role: { en: 'Powerlifter', ku: 'یاریزانی هێز', ar: 'لاعب رفع أثقال' },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
  }, [language]);

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language === 'ar' || language === 'ku';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
