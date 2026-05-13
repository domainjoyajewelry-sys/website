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
  getLocalizedField: <T extends Translations>(obj: T, field: keyof T) => string;
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
  "footer.newsletterTitle": { en: "Join Our Newsletter", he: "הצטרפו לניוזלטר שלנו" },
  "footer.quickLinks": { en: "Quick Links", he: "קישורים מהירים" },
  "footer.help": { en: "Help", he: "עזרה" },
  "footer.contact": { en: "Contact Us", he: "צרו קשר" },
  "footer.shipping": { en: "Shipping", he: "משלוח" },
  "footer.faqs": { en: "FAQs", he: "שאלות נפוצות" },
  "footer.sizeGuide": { en: "Size Guide", he: "מדריך מידות" },
  "footer.care": { en: "Jewelry Care", he: "טיפול בתכשיטים" },
  "footer.warranty": { en: "Warranty", he: "אחריות" },
  "footer.copyright": { en: "© 2026 Joya. All rights reserved.", he: "© 2026 ג'ויה. כל הזכויות שמורות." },
  "home.featuredPieces": { en: "Featured Pieces", he: "פריטים נבחרים" },
  "home.viewAll": { en: "View All", he: "צפו בכולם" },
  "home.discoverMore": { en: "Discover More", he: "גלו עוד" },
  "home.25Years": { en: "25 Years of Excellence", he: "25 שנות מצוינות" },
  "home.10000Clients": { en: "10,000+ Happy Clients", he: "מעל 10,000 לקוחות מרוצים" },
  "home.ethicallySourced": { en: "100% Ethically Sourced", he: "מקור אתי 100%" },
  "service.freeShipping": { en: "Free Shipping", he: "משלוח חינם" },
  "service.30DayReturns": { en: "30-Day Returns", he: "החזרות עד 30 יום" },
  "service.lifetimeCare": { en: "Lifetime Care", he: "טיפול לכל החיים" },
  "service.certifiedQuality": { en: "Certified Quality", he: "איכות מוסמכת" },
  "productCard.addToBag": { en: "Add to Bag", he: "הוסף לסל" },
  "productCard.outOfStock": { en: "Out of Stock", he: "אזל מהמלאי" },
  "products.allJewelry": { en: "All Jewelry", he: "כל התכשיטים" },
  "products.category": { en: "Category", he: "קטגוריה" },
  "products.priceRange": { en: "Price Range", he: "טווח מחירים" },
  "products.materials": { en: "Materials", he: "חומרים" },
  "products.gemstones": { en: "Gemstones", he: "אבני חן" },
  "products.clearAll": { en: "Clear All", he: "נקה הכל" },
  "products.featured": { en: "Featured", he: "מומלצים" },
  "products.newest": { en: "Newest", he: "החדשים ביותר" },
  "products.priceLowHigh": { en: "Price: Low to High", he: "מחיר: נמוך לגבוה" },
  "products.priceHighLow": { en: "Price: High to Low", he: "מחיר: גבוה לנמוך" },
  "productDetail.stockStatus": { en: "In Stock", he: "במלאי" },
  "productDetail.outOfStock": { en: "Out of Stock", he: "אזל מהמלאי" },
  "productDetail.quantity": { en: "Quantity", he: "כמות" },
  "productDetail.freeShipping": { en: "Free Shipping", he: "משלוח חינם" },
  "productDetail.lifetimeWarranty": { en: "Lifetime Warranty", he: "אחריות לכל החיים" },
  "productDetail.details": { en: "Product Details", he: "פרטי מוצר" },
  "productDetail.shippingReturns": { en: "Shipping & Returns", he: "משלוח והחזרות" },
  "productDetail.careInstructions": { en: "Care Instructions", he: "הוראות טיפול" },
  "productDetail.youMayAlsoLike": { en: "You May Also Like", he: "אולי יעניין אותך גם" },
  "cart.shoppingBag": { en: "Shopping Bag", he: "סל קניות" },
  "cart.emptyBag": { en: "Your Bag is Empty", he: "הסל שלך ריק" },
  "cart.continueShopping": { en: "Continue Shopping", he: "המשך קניות" },
  "cart.signInPrompt": { en: "Sign in to save your cart", he: "התחבר כדי לשמור את הסל שלך" },
  "cart.subtotal": { en: "Subtotal", he: 'סה"כ לפני מע"מ' },
  "cart.shipping": { en: "Shipping", he: "משלוח" },
  "cart.estimatedTax": { en: "Estimated Tax", he: "מס משוער" },
  "cart.total": { en: "Total", he: 'סה"כ' },
  "cart.proceedToCheckout": { en: "Proceed to Checkout", he: "המשך לקופה" },
  "cart.secureCheckout": { en: "Secure checkout", he: "קופה מאובטחת" },
  "checkout.shippingInfo": { en: "Shipping Info", he: "פרטי משלוח" },
  "checkout.payment": { en: "Payment", he: "תשלום" },
  "checkout.review": { en: "Review Order", he: "סקירת הזמנה" },
  "checkout.fullName": { en: "Full Name", he: "שם מלא" },
  "checkout.email": { en: "Email", he: "אימייל" },
  "checkout.phone": { en: "Phone", he: "טלפון" },
  "checkout.address": { en: "Address", he: "כתובת" },
  "checkout.city": { en: "City", he: "עיר" },
  "checkout.state": { en: "State", he: "מדינה" },
  "checkout.postalCode": { en: "Postal Code", he: "מיקוד" },
  "checkout.country": { en: "Country", he: "ארץ" },
  "checkout.continueToPayment": { en: "Continue to Payment", he: "המשך לתשלום" },
  "checkout.back": { en: "Back", he: "חזור" },
  "checkout.creditCard": { en: "Credit Card", he: "כרטיס אשראי" },
  "checkout.paypal": { en: "PayPal", he: "פייפאל" },
  "checkout.bankTransfer": { en: "Bank Transfer", he: "העברה בנקאית" },
  "checkout.cardNumber": { en: "Card Number", he: "מספר כרטיס" },
  "checkout.cardName": { en: "Name on Card", he: "שם בעל הכרטיס" },
  "checkout.expiry": { en: "Expiry Date", he: "תאריך תפוגה" },
  "checkout.cvv": { en: "CVV", he: "CVV" },
  "checkout.continueToReview": { en: "Continue to Review", he: "המשך לסקירה" },
  "checkout.placeOrder": { en: "Place Order", he: "בצע הזמנה" },
  "checkout.orderSuccess": { en: "Order placed successfully!", he: "ההזמנה בוצעה בהצלחה!" },
  "checkout.orderNumber": { en: "Order Number", he: "מספר הזמנה" },
  "checkout.viewOrders": { en: "View Orders", he: "צפה בהזמנות" },
  "orders.myOrders": { en: "My Orders", he: "ההזמנות שלי" },
  "orders.orderNumber": { en: "Order #", he: "מספר הזמנה" },
  "orders.datePlaced": { en: "Date Placed", he: "תאריך הזמנה" },
  "orders.status": { en: "Status", he: "סטטוס" },
  "orders.total": { en: "Total", he: 'סה"כ' },
  "orders.itemCount": { en: "Items", he: "פריטים" },
  "orders.viewDetails": { en: "View Details", he: "צפה בפרטים" },
  "orders.trackingNumber": { en: "Tracking Number", he: "מספר מעקב" },
  "profile.personalInfo": { en: "Personal Information", he: "פרטים אישיים" },
  "profile.addresses": { en: "Addresses", he: "כתובות" },
  "profile.preferences": { en: "Preferences", he: "העדפות" },
  "profile.saveChanges": { en: "Save Changes", he: "שמור שינויים" },
  "profile.streetAddress": { en: "Street Address", he: "כתובת רחוב" },
  "profile.saveAddress": { en: "Save Address", he: "שמור כתובת" },
  "profile.emailNotifications": { en: "Email Notifications", he: "התראות באימייל" },
  "profile.marketingEmails": { en: "Marketing Emails", he: "מיילים שיווקיים" },
  "profile.smsNotifications": { en: "SMS Notifications", he: "התראות SMS" },
  "admin.dashboard": { en: "Dashboard", he: "לוח בקרה" },
  "admin.products": { en: "Products", he: "מוצרים" },
  "admin.categories": { en: "Categories", he: "קטגוריות" },
  "admin.orders": { en: "Orders", he: "הזמנות" },
  "admin.customers": { en: "Customers", he: "לקוחות" },
  "admin.banners": { en: "Banners", he: "באנרים" },
  "admin.signOut": { en: "Sign Out", he: "התנתק" },
  "admin.totalRevenue": { en: "Total Revenue", he: "הכנסה כוללת" },
  "admin.totalOrders": { en: "Total Orders", he: 'סה"כ הזמנות' },
  "admin.totalProducts": { en: "Total Products", he: 'סה"כ מוצרים' },
  "admin.totalCustomers": { en: "Total Customers", he: 'סה"כ לקוחות' },
  "admin.recentOrders": { en: "Recent Orders", he: "הזמנות אחרונות" },
  "admin.pendingActions": { en: "Pending Actions", he: "פעולות ממתינות" },
  "admin.addProduct": { en: "Add Product", he: "הוסף מוצר" },
  "admin.image": { en: "Image", he: "תמונה" },
  "admin.name": { en: "Name", he: "שם" },
  "admin.category": { en: "Category", he: "קטגוריה" },
  "admin.price": { en: "Price", he: "מחיר" },
  "admin.stock": { en: "Stock", he: "מלאי" },
  "admin.featured": { en: "Featured", he: "מומלץ" },
  "admin.actions": { en: "Actions", he: "פעולות" },
  "admin.edit": { en: "Edit", he: "ערוך" },
  "admin.delete": { en: "Delete", he: "מחק" },
  "admin.addCategory": { en: "Add Category", he: "הוסף קטגוריה" },
  "admin.slug": { en: "Slug", he: "סלאג" },
  "admin.customer": { en: "Customer", he: "לקוח" },
  "admin.date": { en: "Date", he: "תאריך" },
  "admin.role": { en: "Role", he: "תפקיד" },
  "admin.ordersCount": { en: "Orders Count", he: "מספר הזמנות" },
  "admin.totalSpent": { en: "Total Spent", he: 'סה"כ הוצא' },
  "admin.joinedDate": { en: "Joined Date", he: "תאריך הצטרפות" },
  "admin.addBanner": { en: "Add Banner", he: "הוסף באנר" },
  "admin.title": { en: "Title", he: "כותרת" },
  "admin.subtitle": { en: "Subtitle", he: "כותרת משנה" },
  "admin.active": { en: "Active", he: "פעיל" },
  "admin.order": { en: "Order", he: "סדר" },
  "admin.link": { en: "Link", he: "קישור" },
  "admin.create": { en: "Create", he: "צור" },
  "admin.update": { en: "Update", he: "עדכן" },
  "admin.description": { en: "Description", he: "תיאור" },
  "admin.materials": { en: "Materials", he: "חומרים" },
  "admin.gemstones": { en: "Gemstones", he: "אבני חן" },
  "admin.imageUrls": { en: "Image URLs (comma-separated)", he: "כתובות תמונה (מופרדות בפסיק)" },
  "admin.nameEn": { en: "Name (EN)", he: "שם (אנגלית)" },
  "admin.nameHe": { en: "Name (HE)", he: "שם (עברית)" },
  "admin.descriptionEn": { en: "Description (EN)", he: "תיאור (אנגלית)" },
  "admin.descriptionHe": { en: "Description (HE)", he: "תיאור (עברית)" },
  "admin.titleEn": { en: "Title (EN)", he: "כותרת (אנגלית)" },
  "admin.titleHe": { en: "Title (HE)", he: "כותרת (עברית)" },
  "admin.subtitleEn": { en: "Subtitle (EN)", he: "כותרת משנה (אנגלית)" },
  "admin.subtitleHe": { en: "Subtitle (HE)", he: "כותרת משנה (עברית)" },
  "app.Joya": { en: "Joya", he: "ג'ויה" },
  "global.backToStore": { en: "Back to Store", he: "חזרה לחנות" },
  "footer.newsletterDescription": { en: "Sign up for exclusive offers, original stories, activism updates, and more.", he: "הירשמו למבצעים בלעדיים, סיפורים מקוריים, עדכוני אקטיביזם ועוד." },
  "footer.subscribe": { en: "Subscribe", he: "הירשם" },
  "footer.brandDescription": { en: "Joya is a luxury jewelry brand dedicated to craftsmanship and timeless elegance. Each piece tells a story of passion and precision.", he: "ג'ויה הוא מותג תכשיטי יוקרה המוקדש לאומנות ואלגנטיות נצחית. כל פריט מספר סיפור של תשוקה ודיוק." },
  "service.freeShippingDescription": { en: "Enjoy complimentary shipping on all orders, ensuring your precious items arrive safely and swiftly.", he: "תהנו ממשלוח חינם על כל ההזמנות, מה שמבטיח שהפריטים היקרים שלכם יגיעו בבטחה ובמהירות." },
  "service.30DayReturnsDescription": { en: "Not completely satisfied? Return your purchase within 30 days for a full refund, no questions asked.", he: "לא מרוצים לחלוטין? החזירו את הרכישה שלכם תוך 30 יום לקבלת החזר כספי מלא, ללא שאלות." },
  "service.lifetimeCareDescription": { en: "Our commitment extends beyond your purchase with complimentary lifetime cleaning and maintenance.", he: "המחויבות שלנו נמשכת מעבר לרכישה שלכם עם ניקוי ותחזוקה חינם לכל החיים." },
  "service.certifiedQualityDescription": { en: "Every piece comes with a certificate of authenticity, guaranteeing the finest materials and craftsmanship.", he: "כל פריט מגיע עם תעודת מקוריות, המבטיחה את החומרים והאומנות הטובים ביותר." },
  "home.testimonials": { en: "What Our Clients Say", he: "מה אומרים הלקוחות שלנו" },
  "home.home": { en: "Home", he: "בית" },
  "productDetail.reviews": { en: "reviews", he: "חוות דעת" },
  "productDetail.shippingReturnsDescription": { en: "Enjoy peace of mind with our hassle-free shipping and returns policy. We offer insured shipping for all orders and a straightforward return process within 30 days of purchase.", he: "תהנו משקט נפשי עם מדיניות המשלוחים וההחזרות ללא טרחה שלנו. אנו מציעים משלוח מבוטח לכל ההזמנות ותהליך החזרה פשוט תוך 30 יום מהרכישה." },
  "productDetail.careInstructionsDescription": { en: "To maintain the beauty of your jewelry, avoid contact with harsh chemicals, perfumes, and lotions. Clean gently with a soft cloth and store in a dry, cool place.", he: "כדי לשמור על יופיים של התכשיטים שלכם, הימנעו ממגע עם כימיקלים קשים, בשמים ותחליבים. נקו בעדינות עם מטלית רכה ואחסנו במקום יבש וקריר." },
  "products.filters": { en: "Filters", he: "סינונים" },
  "products.allJewelrySubtitle": { en: "Explore our exquisite collection of fine jewelry, crafted with passion and precision.", he: "גלו את קולקציית התכשיטים המעולה שלנו, המעוצבת בתשוקה ובדיוק." },
  "products.itemsFound": { en: "items found", he: "פריטים נמצאו" },
  "products.sortBy": { en: "Sort By", he: "מיין לפי" },
  "products.noProductsFound": { en: "No products found matching your criteria.", he: "לא נמצאו מוצרים התואמים לקריטריונים שלך." },
  "products.clearAllFilters": { en: "Clear All Filters", he: "נקה את כל הסינונים" },
  "cart.orderSummary": { en: "Order Summary", he: "סיכום הזמנה" },
  "cart.freeShippingProgress": { en: "You're ₪{amount} away from free shipping!", he: "חסרים לך ₪{amount} למשלוח חינם!" },
  "checkout.checkout": { en: "Checkout", he: "קופה" },
  "checkout.orderItems": { en: "Order Items", he: "פריטי הזמנה" },
  "orders.noOrders": { en: "You haven't placed any orders yet.", he: "טרם ביצעת הזמנות." },
  "orders.status.pending": { en: "Pending", he: "ממתין" },
  "orders.status.processing": { en: "Processing", he: "בטיפול" },
  "orders.status.shipped": { en: "Shipped", he: "נשלח" },
  "orders.status.delivered": { en: "Delivered", he: "נמסר" },
  "orders.status.cancelled": { en: "Cancelled", he: "בוטל" },
  "orders.orderDetails": { en: "Order Details", he: "פרטי הזמנה" },
  "orders.shippingAddress": { en: "Shipping Address", he: "כתובת למשלוח" },
  "profile.myProfile": { en: "My Profile", he: "הפרופיל שלי" },
  "home.schedulePiercing": { en: "Professional Piercing Services", he: "שירותי פירסינג מקצועיים" },
  "home.piercingLocation": { en: "Location: Kiryon Krayot", he: "מיקום: קריון קריות" },
  "home.bookNow": { en: "Book an Appointment", he: "תיאום תור" },
  "home.piercingDescription": { en: "Experience safe and artistic piercing by our experts at our Kiryon Krayot studio. We use only the highest quality titanium and gold jewelry.", he: "בואו לחוות פירסינג בטוח ואמנותי על ידי המומחים שלנו בסטודיו בקריון קריות. אנו משתמשים רק בתכשיטי טיטניום וזהב באיכות הגבוהה ביותר." },
  "booking.title": { en: "Schedule Your Piercing", he: "תאמו את הפירסינג שלכם" },
  "booking.name": { en: "Full Name", he: "שם מלא" },
  "booking.phone": { en: "Phone Number", he: "מספר טלפון" },
  "booking.service": { en: "Select Service", he: "בחר שירות" },
  "booking.date": { en: "Preferred Date", he: "תאריך מועדף" },
  "booking.time": { en: "Preferred Time", he: "שעה מועדפת" },
  "booking.submit": { en: "Confirm Booking", he: "אשר הזמנה" },
  "booking.success": { en: "Thank you! We will contact you shortly to confirm your appointment.", he: "תודה! ניצור איתך קשר בהקדם לאישור התור." },
  // Metal & Gemstone translations
  "metal.gold": { en: "Gold", he: "זהב" },
  "metal.silver": { en: "Silver", he: "כסף" },
  "metal.whiteGold": { en: "White Gold", he: "זהב לבן" },
  "metal.roseGold": { en: "Rose Gold", he: "רוז גולד" },
  "metal.platinum": { en: "Platinum", he: "פלטינה" },
  "gemstone.diamond": { en: "Diamond", he: "יהלום" },
  "gemstone.pearl": { en: "Pearl", he: "פנינה" },
  "gemstone.sapphire": { en: "Sapphire", he: "ספיר" },
  "gemstone.emerald": { en: "Emerald", he: "אמרלד" },
  "gemstone.ruby": { en: "Ruby", he: "רובי" },
  "gemstone.none": { en: "No Gemstone", he: "ללא אבני חן" }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'he'>(() => {
    // Initialize language from localStorage or default to 'he'
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
    return key; // Fallback to key if translation not found
  };

  const getLocalizedField = <T extends { [key: string]: any }>(obj: T, field: string): string => {
    const localizedField = `${field}_${language}`;
    if (localizedField in obj && obj[localizedField] !== null && obj[localizedField] !== undefined) {
      return obj[localizedField];
    }
    if (field in obj && obj[field] !== null && obj[field] !== undefined) {
      return obj[field];
    }
    return ''; // Fallback
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
