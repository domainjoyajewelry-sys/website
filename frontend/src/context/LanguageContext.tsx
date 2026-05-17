import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';

// Define the shape of the translation object
interface Translations {
  [key: string]: string | { en: string; he: string };
}

// Define the shape of the LanguageContext
interface LanguageContextType {
  language: 'en' | 'he';
  toggleLanguage: () => void;
  t: (key: string) => string;
  getLocalizedField: <T extends { [key: string]: any }>(obj: T, field: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Placeholder for all translations
const allTranslations: Translations = {
  "app.title": { en: "Joya - Luxury Jewelry", he: "ג'ויה - תכשיטי יוקרה" },
  "header.topBanner": { en: "Complimentary Shipping on Orders Over ₪500", he: "משלוח חינם בהזמנות מעל ₪500" },
  "nav.newArrivals": { en: "New Arrivals", he: "מהדורות חדשות" },
  "nav.collections": { en: "Collections", he: "קולקציות" },
  "nav.more": { en: "More", he: "עוד" },
  "nav.rings": { en: "Rings", he: "טבעות" },
  "nav.necklaces": { en: "Necklaces", he: "שרשראות" },
  "nav.earrings": { en: "Earrings", he: "עגילים" },
  "nav.bracelets": { en: "Bracelets", he: "צמידים" },
  "nav.piercing": { en: "Piercing", he: "פירסינג" },
  "footer.newsletterTitle": { en: "Join Our Newsletter", he: "הצטרפו לניוזלטר שלנו" },
  "footer.newsletterDescription": { en: "Sign up for exclusive offers, original stories, and luxury updates.", he: "הירשמו למבצעים בלעדיים, סיפורים מקוריים ועדכוני יוקרה." },
  "footer.quickLinks": { en: "Quick Links", he: "קישורים מהירים" },
  "footer.help": { en: "Help", he: "עזרה" },
  "footer.contact": { en: "Contact Us", he: "צרו קשר" },
  "footer.shipping": { en: "Shipping", he: "משלוח" },
  "footer.faqs": { en: "FAQs", he: "שאלות נפוצות" },
  "footer.sizeGuide": { en: "Size Guide", he: "מדריך מידות" },
  "footer.care": { en: "Jewelry Care", he: "טיפול בתכשיטים" },
  "footer.warranty": { en: "Warranty", he: "אחריות" },
  "footer.copyright": { en: "© 2026 Joya. All rights reserved.", he: "© 2026 ג'ויה. כל הזכויות שמורות." },
  "footer.brandDescription": { 
    en: "JOYA represents the pinnacle of luxury jewelry. Our mission is to curate exceptional pieces that celebrate life's most precious moments with unparalleled craftsmanship.", 
    he: "JOYA מייצגת את פסגת תכשיטי היוקרה. המשימה שלנו היא לאצור פריטים יוצאי דופן החוגגים את הרגעים היקרים ביותר בחיים עם אומנות ללא פשרות." 
  },
  "footer.subscribe": { en: "Subscribe", he: "הרשמה" },
  "home.featuredPieces": { en: "Featured Pieces", he: "פריטים נבחרים" },
  "home.viewAll": { en: "View All", he: "צפו בכולם" },
  "home.discoverMore": { en: "Discover More", he: "גלו עוד" },
  "home.25Years": { en: "25 Years of Excellence", he: "25 שנות מצוינות" },
  "home.testimonials": { en: "What Our Clients Say", he: "מה אומרים הלקוחות שלנו" },
  "home.home": { en: "Home", he: "בית" },
  "home.bookNow": { en: "Book an Appointment", he: "תיאום תור" },
  "service.freeShipping": { en: "Free Shipping", he: "משלוח חינם" },
  "service.30DayReturns": { en: "30-Day Returns", he: "החזרות עד 30 יום" },
  "service.lifetimeCare": { en: "Lifetime Care", he: "טיפול לכל החיים" },
  "service.certifiedQuality": { en: "Certified Quality", he: "איכות מוסמכת" },
  "productCard.addToBag": { en: "Add to Bag", he: "הוסף לסל" },
  "productCard.outOfStock": { en: "Out of Stock", he: "אזל מהמלאי" },
  "products.allJewelry": { en: "All Jewelry", he: "כל התכשיטים" },
  "products.allJewelrySubtitle": { en: "Explore our exquisite collection of fine jewelry, crafted with passion and precision.", he: "גלו את קולקציית התכשיטים המעולה שלנו, המעוצבת בתשוקה ובדיוק." },
  "products.category": { en: "Category", he: "קטגוריה" },
  "products.priceRange": { en: "Price Range", he: "טווח מחירים" },
  "products.materials": { en: "Materials", he: "חומרים" },
  "products.gemstones": { en: "Gemstones", he: "אבני חן" },
  "products.color": { en: "Color", he: "צבע" },
  "products.bodyPart": { en: "Body Part", he: "מיקום בגוף" },
  "products.clearAll": { en: "Clear All", he: "נקה הכל" },
  "products.itemsFound": { en: "items found", he: "פריטים נמצאו" },
  "products.noProductsFound": { en: "No products found matching your criteria.", he: "לא נמצאו מוצרים התואמים לקריטריונים שלך." },
  "products.clearAllFilters": { en: "Clear All Filters", he: "נקה את כל הסינונים" },
  "productDetail.quantity": { en: "Quantity", he: "כמות" },
  "productDetail.outOfStock": { en: "Out of Stock", he: "אזל מהמלאי" },
  "productDetail.details": { en: "Product Details", he: "פרטי מוצר" },
  "productDetail.youMayAlsoLike": { en: "You May Also Like", he: "אולי יעניין אותך גם" },
  "cart.shoppingBag": { en: "Shopping Bag", he: "סל קניות" },
  "cart.emptyBag": { en: "Your Bag is Empty", he: "הסל שלך ריק" },
  "cart.continueShopping": { en: "Continue Shopping", he: "המשך קניות" },
  "cart.orderSummary": { en: "Order Summary", he: "סיכום הזמנה" },
  "cart.subtotal": { en: "Subtotal", he: 'סה"כ לפני מע"מ' },
  "cart.shipping": { en: "Shipping", he: "משלוח" },
  "cart.total": { en: "Total", he: 'סה"כ' },
  "cart.proceedToCheckout": { en: "Proceed to Checkout", he: "המשך לקופה" },
  "checkout.checkout": { en: "Checkout", he: "קופה" },
  "checkout.fullName": { en: "Full Name", he: "שם מלא" },
  "checkout.email": { en: "Email", he: "אימייל" },
  "checkout.address": { en: "Address", he: "כתובת" },
  "checkout.city": { en: "City", he: "עיר" },
  "checkout.postalCode": { en: "Postal Code", he: "מיקוד" },
  "checkout.continueToPayment": { en: "Continue to Payment", he: "המשך לתשלום" },
  "checkout.back": { en: "Back", he: "חזור" },
  "checkout.payment": { en: "Payment", he: "תשלום" },
  "checkout.placeOrder": { en: "Place Order", he: "בצע הזמנה" },
  "checkout.orderSuccess": { en: "Order placed successfully!", he: "ההזמנה בוצעה בהצלחה!" },
  "checkout.orderNumber": { en: "Order Number", he: "מספר הזמנה" },
  "profile.personalInfo": { en: "Personal Information", he: "פרטים אישיים" },
  "orders.myOrders": { en: "My Orders", he: "ההזמנות שלי" },
  "admin.dashboard": { en: "Dashboard", he: "לוח בקרה" },
  "booking.title": { en: "Schedule Your Piercing", he: "תאמו את הפירסינג שלכם" },
  "booking.name": { en: "Full Name", he: "שם מלא" },
  "booking.phone": { en: "Phone Number", he: "מספר טלפון" },
  "booking.service": { en: "Select Service", he: "בחר שירות" },
  "booking.date": { en: "Preferred Date", he: "תאריך מועדף" },
  "booking.time": { en: "Preferred Time", he: "שעה מועדפת" },
  "booking.submit": { en: "Confirm Booking", he: "אשר הזמנה" },
  "booking.success": { en: "Thank you! We will contact you shortly to confirm your appointment.", he: "תודה! ניצור איתך קשר בהקדם לאישור התור." },
  "info.aboutTitle": { en: "The JOYA Heritage", he: "סיפור המותג JOYA" },
  "info.aboutText": { 
    en: "Founded on the principles of excellence and timeless beauty, JOYA has been a leading name in luxury jewelry for over two decades. Each piece in our collection is a testament to our dedication to quality, sourced ethically and crafted by the world's finest artisans. From the brilliance of our diamonds to the warmth of our gold, JOYA is where art meets elegance.",
    he: "JOYA נוסדה על עקרונות של מצוינות ויופי נצחי, והיא שם מוביל בתכשיטי יוקרה כבר למעלה משני עשורים. כל פריט באוסף שלנו הוא עדות למסירות שלנו לאיכות, מקורו אתי והוא עוצב על ידי מיטב האומנים בעולם. מהברק של היהלומים שלנו ועד לחמימות של הזהב שלנו, JOYA היא המקום שבו אמנות פוגשת אלגנטיות."
  },
  "info.shippingTitle": { en: "Shipping & Delivery", he: "משלוחים ואספקה" },
  "info.shippingText": {
    en: "We offer complimentary insured shipping on all orders over ₪500. Standard delivery typically takes 3-5 business days within Israel. For international orders, please allow 7-14 business days. Every JOYA piece arrives in our signature luxury packaging, ready for gifting.",
    he: "אנו מציעים משלוח מבוטח חינם לכל ההזמנות מעל ₪500. משלוח סטנדרטי לוקח בדרך כלל 3-5 ימי עסקים בתוך ישראל. להזמנות בינלאומיות, אנא המתינו 7-14 ימי עסקים. כל פריט של JOYA מגיע באריזת היוקרה המזוהה שלנו, מוכן להענקה כמתנה."
  },
  "info.faqTitle": { en: "Frequently Asked Questions", he: "שאלות נפוצות" },
  "info.faqText": {
    en: "Q: Do you offer custom designs? A: Yes, our master jewelers specialize in creating bespoke pieces tailored to your vision. Q: Is your gold hallmarked? A: Absolutely, all our gold is certified and hallmarked for purity. Q: What is your return policy? A: We accept returns within 30 days of purchase in original condition.",
    he: "ש: האם אתם מציעים עיצובים בהתאמה אישית? ת: כן, הצורפים המומחים שלנו מתמחים ביצירת פריטים בהתאמה אישית לפי החזון שלכם. ש: האם הזהב שלכם מסומן בסימני אימות? ת: בהחלט, כל הזהב שלנו מאושר ומסומן בסימני אימות לטוהר המתכת. ש: מהי מדיניות ההחזרות שלכם? ת: אנו מקבלים החזרות תוך 30 יום מהרכישה במצב המקורי."
  },
  "info.careTitle": { en: "Jewelry Care Guide", he: "מדריך לטיפול בתכשיטים" },
  "info.careText": {
    en: "To maintain the eternal brilliance of your JOYA jewelry, we recommend professional cleaning once a year. At home, use a soft cloth and avoid contact with harsh chemicals, perfumes, or lotions. Store each piece separately in its JOYA box to prevent scratching.",
    he: "כדי לשמור על הברק הנצחי של תכשיטי JOYA שלכם, אנו ממליצים על ניקוי מקצועי פעם בשנה. בבית, השתמשו במטלית רכה והימנעו ממגע עם כימיקלים קשים, בשמים או תחליבים. אחסנו כל פריט בנפרד בקופסת JOYA שלו כדי למנוע שריטות."
  },
  "info.warrantyTitle": { en: "Lifetime Warranty", he: "אחריות לכל החיים" },
  "info.warrantyText": {
    en: "Every JOYA creation is backed by our lifetime warranty against manufacturing defects. We stand behind our craftsmanship and offer complimentary maintenance services to ensure your jewelry remains as stunning as the day you received it.",
    he: "כל יצירה של JOYA מגובה באחריות לכל החיים שלנו כנגד פגמי ייצור. אנו עומדים מאחורי האומנות שלנו ומציעים שירותי תחזוקה משלימים כדי להבטיח שהתכשיטים שלכם יישארו מדהימים כמו ביום שקיבלתם אותם."
  },
  "info.contactTitle": { en: "Contact the House of JOYA", he: "צרו קשר עם בית JOYA" },
  "info.contactText": {
    en: "Our concierges are available to assist you with any inquiries. Visit our flagship studio at Kiryon Krayot, or reach us via WhatsApp at +972 51-234-5678. You may also email us at concierge@joya.co.il for personal styling advice.",
    he: "יועצי השירות שלנו זמינים לסייע לכם בכל שאלה. בקרו בסטודיו הדגל שלנו בקריון קריות, או צרו איתנו קשר בוואטסאפ בטלפון 051-234-5678. ניתן גם לשלוח לנו מייל לכתובת concierge@joya.co.il לייעוץ סטיילינג אישי."
  },
  "global.backToStore": { en: "Back to Store", he: "חזרה לחנות" },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'he'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('language') as 'en' | 'he') || 'he';
    }
    return 'he';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'en' ? 'he' : 'en'));
  };

  const t = (key: string): string => {
    const translation = allTranslations[key];
    if (typeof translation === 'string') {
      return translation;
    }
    if (translation && language in translation) {
      return translation[language as keyof typeof translation];
    }
    return key;
  };

  const getLocalizedField = <T extends { [key: string]: any }>(obj: T, field: string): string => {
    if (!obj || typeof obj !== 'object') return '';
    const localizedField = `${field}_${language}`;
    if (localizedField in obj && obj[localizedField] !== null && obj[localizedField] !== undefined) {
      return obj[localizedField];
    }
    if (field in obj && obj[field] !== null && obj[field] !== undefined) {
      return obj[field];
    }
    return '';
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, getLocalizedField }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
