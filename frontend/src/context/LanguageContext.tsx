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
  "nav.loginRegister": { en: "Login / Register", he: "התחברות / הרשמה" },
  "nav.logout": { en: "Logout", he: "התנתקות" },
  "global.loading": { en: "Revealing masterpiece...", he: "טוען את היצירה..." },
  "global.loadingData": { en: "Loading data...", he: "טוען נתונים..." },
  "global.loadingProfile": { en: "Loading profile...", he: "טוען פרופיל..." },
  "global.loadingOrders": { en: "Loading orders...", he: "טוען הזמנות..." },
  "global.loadingPrizes": { en: "Loading prizes...", he: "טוען פרסים..." },
  "global.refining": { en: "Refining collection...", he: "מרענן את הקולקציה..." },
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
  "footer.subscribe": { en: "Subscribe", he: "הרשמה" },
  "footer.privacy": { en: "Privacy", he: "פרטיות" },
  "footer.terms": { en: "Terms", he: "תנאי שימוש" },
  "footer.accessibility": { en: "Accessibility", he: "נגישות" },
  "footer.copyright": { en: "© 2026 Joya. All rights reserved.", he: "© 2026 ג'ויה. כל הזכויות שמורות." },
  "footer.brandDescription": { 
    en: "Luxury jewelry house dedicated to exquisite craftsmanship and ethical sourcing. Every piece tells a story of elegance and timeless beauty.", 
    he: "בית תכשיטי יוקרה המוקדש לאומנות מעולה ומקורות אתיים. כל פריט מספר סיפור של אלגנטיות ויופי נצחי." 
  },
  "footer.contactWhatsapp": { en: "Contact us on WhatsApp", he: "צרו קשר בווצאפ" },

  "home.luxuryHouse": { en: "Luxury Jewelry House", he: "בית תכשיטי יוקרה" },
  "home.timelessElegance": { en: "Exquisite Craftsmanship, Timeless Elegance", he: "אומנות מעולה, אלגנטיות נצחית" },
  "home.shopCollection": { en: "Shop Collection", he: "לקולקציה החדשה" },
  "home.featuredPieces": { en: "Featured Pieces", he: "פריטים נבחרים" },
  "home.curatedSelection": { en: "Curated Selection", he: "קולקציה נבחרת" },
  "home.curatingLatest": { en: "Curating our latest creations...", he: "אוצרים את היצירות האחרונות שלנו..." },
  "home.viewAll": { en: "View All", he: "צפו בכולם" },
  "home.discoverMore": { en: "Discover More", he: "גלו עוד" },
  "home.25Years": { en: "25 Years of Excellence", he: "25 שנות מצוינות" },
  "home.testimonials": { en: "What Our Clients Say", he: "מה אומרים הלקוחות שלנו" },
  "home.discoverElements": { en: "Discover the Elements", he: "גלו את החומרים" },
  "home.selectionByMetal": { en: "Selection by Metal", he: "בחרו לפי סוג המתכת" },
  "home.everyPieceStory": { en: "Every Piece Tells A Story", he: "כל פריט מספר סיפור" },
  "home.legacyText": { 
    en: "From ethical sourcing to the hands of our master artisans, we create more than jewelry. We create a legacy.", 
    he: "מהמכרות האתיים ועד לידיים של האמנים המומחים שלנו, אנחנו יוצרים יותר מתכשיטים. אנחנו יוצרים מורשת." 
  },
  "home.ourStory": { en: "Our Story", he: "הסיפור שלנו" },
  "home.clientWords": { en: "Client Kind Words", he: "המילים שלכם" },
  "home.readyToShine": { en: "Ready to Shine?", he: "מוכנים לזהור?" },
  "home.findPerfect": { en: "Find the perfect addition to your curated collection", he: "גלו את התוספת המושלמת לאוסף שלכם" },
  "home.shopCollections": { en: "Shop Collections", he: "קנו עכשיו" },
  "home.contactStylist": { en: "Contact Stylist", he: "תיאום ייעוץ" },
  "home.home": { en: "Home", he: "בית" },
  "home.bookNow": { en: "Book an Appointment", he: "תיאום תור" },
  "service.freeShipping": { en: "Free Shipping", he: "משלוח חינם" },
  "service.freeShippingDesc": { en: "Complimentary delivery on all pieces", he: "משלוח חינם על כל הפריטים" },
  "service.30DayReturns": { en: "30-Day Returns", he: "החזרות עד 30 יום" },
  "service.30DayReturnsDesc": { en: "Secure and seamless returns policy", he: "מדיניות החזרות מאובטחת וקלה" },
  "service.lifetimeCare": { en: "Lifetime Care", he: "טיפול לכל החיים" },
  "service.lifetimeCareDesc": { en: "Professional cleaning and maintenance", he: "ניקוי ותחזוקה מקצועיים" },
  "service.certifiedQuality": { en: "Certified Quality", he: "איכות מוסמכת" },
  "service.certifiedQualityDesc": { en: "GIA certified stones and 18k hallmark", he: "אבנים באישור GIA וזהב 18K" },
  "productDetail.freeShipping": { en: "Free Shipping", he: "משלוח חינם" },
  "productDetail.30DayReturns": { en: "30-Day Returns", he: "החזרות עד 30 יום" },
  "productDetail.lifetimeWarranty": { en: "Lifetime Warranty", he: "אחריות לכל החיים" },
  "productDetail.completeTheLook": { en: "Complete the Look", he: "השלימו את הלוק" },
  "productCard.addToBag": { en: "Add to Bag", he: "הוסף לסל" },
  "productCard.outOfStock": { en: "Out of Stock", he: "אזל מהמלאי" },
  "products.allJewelry": { en: "All Jewelry", he: "כל התכשיטים" },
  "products.allJewelrySubtitle": { en: "Explore our exquisite collection of fine jewelry, crafted with passion and precision.", he: "גלו את קולקציית התכשיטים המעולה שלנו, המעוצבת בתשוקה ובדיוק." },
  "products.newCollection": { en: "New Collection", he: "קולקציה חדשה" },
  "products.category": { en: "Category", he: "קטגוריה" },
  "products.priceRange": { en: "Price Range", he: "טווח מחירים" },
  "products.materials": { en: "Materials", he: "חומרים" },
  "products.gemstones": { en: "Gemstones", he: "אבני חן" },
  "products.color": { en: "Color", he: "צבע" },
  "products.metalColor": { en: "Metal Color", he: "צבע מתכת" },
  "products.bodyPart": { en: "Body Part", he: "מיקום בגוף" },
  "products.clearAll": { en: "Clear All", he: "נקה הכל" },
  "products.itemsFound": { en: "items found", he: "פריטים נמצאו" },
  "products.noProductsFound": { en: "No products found matching your criteria.", he: "לא נמצאו מוצרים התואמים לקריטריונים שלך." },
  "products.clearAllFilters": { en: "Clear All Filters", he: "נקה את כל הסינונים" },
  "productDetail.quantity": { en: "Quantity", he: "כמות" },
  "productDetail.outOfStock": { en: "Out of Stock", he: "אזל מהמלאי" },
  "productDetail.selectColor": { en: "Select Color", he: "בחר צבע" },
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
  "admin.products": { en: "Products", he: "מוצרים" },
  "admin.categories": { en: "Categories", he: "קטגוריות" },
  "admin.orders": { en: "Orders", he: "הזמנות" },
  "admin.customers": { en: "Customers", he: "לקוחות" },
  "admin.prizes": { en: "Lucky Wheel", he: "גלגל המזל" },
  "admin.totalRevenue": { en: "Total Revenue", he: "סך הכנסות" },
  "admin.totalOrders": { en: "Total Orders", he: "סך הזמנות" },
  "admin.totalProducts": { en: "Total Products", he: "סך מוצרים" },
  "admin.totalCustomers": { en: "Total Customers", he: "סך לקוחות" },
  "admin.recentOrders": { en: "Recent Orders", he: "הזמנות אחרונות" },
  "admin.order": { en: "Order", he: "הזמנה" },
  "admin.customer": { en: "Customer", he: "לקוח" },
  "admin.date": { en: "Date", he: "תאריך" },
  "admin.status": { en: "Status", he: "סטטוס" },
  "admin.total": { en: "Total", he: "סה״כ" },
  "admin.overview": { en: "Overview of your boutique's performance", he: "סקירה של ביצועי הבוטיק שלך" },
  "admin.manageProducts": { en: "Product Management", he: "ניהול מוצרים" },
  "admin.itemsInCatalog": { en: "items in catalog", he: "פריטים בקטלוג" },
  "admin.addNewProduct": { en: "Add New Product", he: "הוסף מוצר חדש" },
  "admin.nameEn": { en: "Name (EN)", he: "(אנגלית) שם" },
  "admin.nameHe": { en: "Name (HE)", he: "(עברית) שם" },
  "admin.price": { en: "Price", he: "מחיר" },
  "admin.stock": { en: "Stock", he: "מלאי" },
  "admin.category": { en: "Category", he: "קטגוריה" },
  "admin.selectCategory": { en: "Select Category", he: "בחר קטגוריה" },
  "admin.imageUrl": { en: "Image URL", he: "קישור לתמונה" },
  "admin.metalEn": { en: "Metal (EN)", he: "(אנגלית) מתכת" },
  "admin.metalHe": { en: "Metal (HE)", he: "(עברית) מתכת" },
  "admin.cancel": { en: "Cancel", he: "ביטול" },
  "admin.savePiece": { en: "Save Piece", he: "שמור פריט" },
  "admin.image": { en: "Image", he: "תמונה" },
  "admin.name": { en: "Name", he: "שם" },
  "admin.actions": { en: "Actions", he: "פעולות" },
  "admin.synchronizing": { en: "Synchronizing catalog...", he: "מסנכרן קטלוג..." },
  "admin.banners": { en: "Hero Design", he: "עיצוב דף הבית" },
  "admin.manageBanners": { en: "Hero Section Design", he: "ניהול עיצוב דף הבית" },
  "admin.bannerDescription": { en: "Customize your boutique's video, photos, and visual storytelling for the main hero page", he: "התאם אישית את הוידאו, התמונות והסיפור הוויזואלי של הבוטיק שלך בדף הבית" },
  "admin.addNewBanner": { en: "Create New Design", he: "הוסף עיצוב חדש" },
  "admin.bannerTitle": { en: "Design Title", he: "כותרת עיצוב" },
  "admin.saveChanges": { en: "Save Design", he: "שמור עיצוב" },
  "admin.preview": { en: "Preview", he: "תצוגה מקדימה" },
  "admin.active": { en: "Active", he: "פעיל" },
  "admin.inactive": { en: "Inactive", he: "לא פעיל" },
  "admin.noBanners": { en: "No active banners found", he: "לא נמצאו באנרים פעילים" },
  "admin.syncVisuals": { en: "Synchronizing visual assets...", he: "מסנכרן נכסים חזותיים..." },
  "admin.manageOrders": { en: "Order Overview", he: "ניהול הזמנות" },
  "admin.viewingRecent": { en: "Viewing recent transactions", he: "צופה בעסקאות אחרונות" },
  "admin.orderId": { en: "Order ID", he: "מספר הזמנה" },
  "admin.items": { en: "Items", he: "פריטים" },
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
  "global.scroll": { en: "Scroll", he: "גללו" },
  "nav.giftCard": { en: "Gift Card", he: "כרטיס מתנה" },
  "metal.gold": { en: "Gold", he: "זהב" },
  "metal.silver": { en: "Silver", he: "כסף" },
  "metal.roseGold": { en: "Rose Gold", he: "רוז גולד" },
  "metal.whiteGold": { en: "White Gold", he: "זהב לבן" },
  "metal.platinum": { en: "Platinum", he: "פלטינה" },
  "metal.titanium": { en: "Titanium", he: "טיטניום" },
  "bodyPart.ear": { en: "Ear", he: "אוזן" },
  "bodyPart.nose": { en: "Nose", he: "אף" },
  "bodyPart.lip": { en: "Lip", he: "שפה" },
  "bodyPart.belly": { en: "Belly", he: "טבור" },
  "tryOn.title": { en: "Virtual Try-On", he: "מדידה וירטואלית" },
  "tryOn.allowCamera": { en: "Please allow camera access to use Virtual Try-On", he: "אנא אפשרו גישה למצלמה כדי להשתמש במדידה וירטואלית" },
  "tryOn.noCamera": { en: "No camera found on this device", he: "לא נמצאה מצלמה במכשיר זה" },
  "tryOn.close": { en: "Close", he: "סגור" },
  "tryOn.scale": { en: "Scale", he: "גודל" },
  "tryOn.rotate": { en: "Rotate", he: "סיבוב" },
  "tryOn.instruction": { en: "Drag to position, use sliders to resize and rotate", he: "גררו למיקום, השתמשו בסרגלים לשינוי גודל וסיבוב" },
  "tryOn.uploadPhoto": { en: "Upload Photo", he: "העלאת תמונה" },
  "tryOn.useCamera": { en: "Use Live Camera", he: "חזרה למצלמה" },
  "tryOn.snap": { en: "Snap Photo", he: "צלמו תמונה" },
  "tryOn.removeBackground": { en: "Background Removal", he: "הסרת רקע" },
  "tryOn.white": { en: "White", he: "לבן" },
  "tryOn.black": { en: "Black", he: "שחור" },
  "tryOn.crop": { en: "Crop Image", he: "גזירת תמונה" },
  "tryOn.reset": { en: "Reset", he: "איפוס" },
  "productDetail.color": { en: "Color", he: "צבע" },
  "productDetail.sku": { en: "SKU", he: "מק״ט" },
  "specs.title": { en: "Specifications", he: "מפרט טכני" },
  "specs.piercingSide": { en: "Piercing Side", he: "צד פירסינג" },
  "specs.unitType": { en: "Unit Type", he: "סוג יחידה" },
  "specs.pipeLength": { en: "Pipe Length", he: "אורך מוט" },
  "specs.right": { en: "Right", he: "ימין" },
  "specs.left": { en: "Left", he: "שמאל" },
  "specs.both": { en: "Both", he: "שניהם" },
  "specs.single": { en: "Single", he: "בודד" },
  "specs.pair": { en: "Pair", he: "זוג" },
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
    // Try exact match first
    let translation = allTranslations[key];
    
    // If not found, try case-insensitive match
    if (!translation) {
      const lowerKey = key.toLowerCase();
      const actualKey = Object.keys(allTranslations).find(k => k.toLowerCase() === lowerKey);
      if (actualKey) {
        translation = allTranslations[actualKey];
      }
    }

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
