import React, { useRef, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Button } from '../components/ui/button';
import { ShoppingBag, Star, Shield, Clock, ArrowRight, ChevronRight, Play, LayoutGrid, Sparkles, Menu, User as UserIcon, Globe } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getAdBanners } from '../services/api';
import PiercingBooking from '../components/PiercingBooking';
import { Toaster } from 'sonner';

const ParallaxSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={ref}
      style={{ y, opacity }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const Home: React.FC = () => {
  const { t, language, getLocalizedField, toggleLanguage } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: banners = [] } = useQuery({
    queryKey: ['adbanners'],
    queryFn: getAdBanners,
  });

  const activeBanner = banners.find((b: any) => b.isActive) || {
    image: '/images/new/p1.jpeg',
    title: 'Luxury Jewelry House'
  };

  // Logic to randomize "Featured" products each time
  const featuredProducts = useMemo(() => {
    if (!allProducts || !Array.isArray(allProducts) || allProducts.length === 0) return [];
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    const prioritized = shuffled.filter((p: any) => p.featured);
    const nonPrioritized = shuffled.filter((p: any) => !p.featured);
    const combined = [...prioritized, ...nonPrioritized];
    return combined.slice(0, 3);
  }, [allProducts]);

  // Dynamic Metal Selection Logic
  const metalPreviews = useMemo(() => {
    if (!allProducts || !Array.isArray(allProducts) || allProducts.length === 0) return [];

    const metalTypes = [
      { name: 'Platinum Collection', name_he: 'קולקציית פלטינה', color: 'Silver', fallback: '/images/new/p2.jpeg' },
      { name: 'Gold Collection', name_he: 'קולקציית זהב', color: 'Gold', fallback: '/images/new/p1.jpeg' },
      { name: 'Rose Gold Collection', name_he: 'קולקציית רוז גולד', color: 'Rose Gold', fallback: '/images/new/p3.jpeg' },
      { name: 'White Gold Collection', name_he: 'קולקציית זהב לבן', color: 'White Gold', fallback: '/images/new/p1.jpeg' }
    ];

    return metalTypes.map(metal => {
      const matchingProducts = allProducts.filter((p: any) => 
        p.colors === metal.color || 
        p.colors_he?.includes(metal.color) ||
        p.materials?.includes(metal.name.replace(' Collection', ''))
      );
      const randomProduct = matchingProducts.length > 0 
        ? matchingProducts[Math.floor(Math.random() * matchingProducts.length)]
        : null;
      return { ...metal, image: randomProduct ? randomProduct.images[0] : metal.fallback };
    });
  }, [allProducts, language]);

  const testimonials = [
    { name: 'מיכל כהן', text: 'התכשיטים הכי יפים שקניתי! השירות היה מדהים והאיכות פשוט פרימיום.', location: 'תל אביב' },
    { name: 'רוני לוי', text: 'עשיתי פירסינג בקריון והיה פשוט מושלם. מקצועי, נקי ומהיר.', location: 'חיפה' },
    { name: 'שירז אברהם', text: 'השרשרת הגיעה תוך יומיים באריזה יוקרתית. מומלץ בחום!', location: 'רמת גן' },
  ];

  return (
    <div className="bg-white relative">
      <Toaster position="top-center" />
      
      {/* Redesigned Premium Hero - Dynamic Background with Embedded Nav */}
      <section ref={heroRef} className={`relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center pt-48 ${activeBanner.backgroundType === 'solid' ? 'bg-black' : ''}`}>
        
        {/* Embedded Hero Navigation */}
        <div className="absolute top-0 left-0 right-0 z-30 px-6 sm:px-12 py-10 flex items-center justify-between pointer-events-none">
           {/* Left: Collections & New */}
           <nav className="hidden lg:flex items-center gap-10 pointer-events-auto">
              <Link to="/products" className="text-[11px] uppercase tracking-[0.4em] font-bold text-white/60 hover:text-white transition-all font-serif">
                {t('nav.collections')}
              </Link>
              <Link to="/products?new=true" className="text-[11px] uppercase tracking-[0.4em] font-bold text-white/60 hover:text-white transition-all font-serif">
                {t('nav.newArrivals')}
              </Link>
           </nav>

           {/* Center: Logo */}
           <div className="absolute left-1/2 top-10 transform -translate-x-1/2 pointer-events-auto">
              <Link to="/">
                <img src="/logo.png" alt="JOYA" className="h-20 sm:h-28 md:h-36 w-auto invert brightness-200" />
              </Link>
           </div>

           {/* Right: Actions */}
           <div className="flex items-center gap-6 sm:gap-8 pointer-events-auto">
              <button onClick={toggleLanguage} className="hidden sm:block text-[11px] font-bold tracking-[0.3em] text-white/60 hover:text-white font-serif uppercase">
                {language === 'en' ? 'HE' : 'EN'}
              </button>
              <Link to="/cart" className="text-white/60 hover:text-white transition-all">
                <ShoppingBag className="w-5 h-5" />
              </Link>
              <Link to={user ? "/profile" : "/login"} className="text-white/60 hover:text-white transition-all">
                <UserIcon className="w-5 h-5" />
              </Link>
           </div>
        </div>

        {activeBanner.backgroundType === 'video' && activeBanner.video && activeBanner.videoActive !== false && (
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={activeBanner.video} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        )}

        {activeBanner.backgroundType === 'image' && (
          <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
            <img 
              src={activeBanner.image} 
              className="w-full h-full object-cover"
              alt="JOYA Hero"
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </motion.div>
        )}

        {(activeBanner.backgroundType === 'solid' || (activeBanner.backgroundType === 'video' && activeBanner.videoActive === false)) && (
           <div className="absolute inset-0 bg-black z-0"></div>
        )}
        
        <div className="relative z-10 text-center px-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <span className="text-white text-[12px] sm:text-[14px] uppercase tracking-[1em] sm:tracking-[1.2em] mb-10 font-light block opacity-90">
              {language === 'he' ? 'בית תכשיטי יוקרה' : 'Luxury Jewelry House'}
            </span>
            <p className="text-white text-lg sm:text-xl md:text-2xl font-body italic mb-14 opacity-70 max-w-2xl font-light tracking-widest leading-relaxed">
              {language === 'he' ? 'אומנות מעולה, אלגנטיות נצחית' : 'Exquisite Craftsmanship, Timeless Elegance'}
            </p>
            <div className="flex flex-col sm:flex-row gap-8">
              <Link to={activeBanner.link || "/products"}>
                <Button className="bg-[#f5f5dc] text-black hover:bg-[#e8e8c8] transition-all duration-700 rounded-none px-10 py-7 text-[12px] sm:text-[14px] uppercase tracking-[0.4em] font-bold border-none">
                  {language === 'he' ? 'לקולקציה החדשה' : 'Shop Collection'}
                </Button>
              </Link>
              <PiercingBooking 
                trigger={
                  <Button variant="outline" className="text-[#f5f5dc] border-[#f5f5dc]/40 hover:border-[#f5f5dc] hover:bg-[#f5f5dc]/5 transition-all duration-700 rounded-none px-10 py-7 text-[12px] sm:text-[14px] uppercase tracking-[0.4em] font-bold">
                    {t('home.bookNow')}
                  </Button>
                }
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer z-10"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-white/40 text-[9px] uppercase tracking-[0.6em] font-bold vertical-text">{t('global.scroll')}</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/60 to-transparent"></div>
        </motion.div>
      </section>

      {/* Boutique Experience Services */}
      <section className="bg-black py-32 border-y border-zinc-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24">
            {[
              { icon: ShoppingBag, label: 'service.freeShipping', desc: 'Complimentary delivery on all pieces' },
              { icon: Shield, label: 'service.30DayReturns', desc: 'Secure and seamless returns policy' },
              { icon: Star, label: 'service.lifetimeCare', desc: 'Professional cleaning and maintenance' },
              { icon: Clock, label: 'service.certifiedQuality', desc: 'GIA certified stones and 18k hallmark' },
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center space-y-6 group"
              >
                <div className="w-16 h-16 rounded-none border border-zinc-800 flex items-center justify-center group-hover:border-zinc-500 transition-all duration-700">
                  <s.icon className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-white text-[11px] uppercase tracking-[0.4em] font-bold">{t(s.label)}</h3>
                  <p className="text-zinc-600 text-[9px] uppercase tracking-widest leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="py-40 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12 border-b border-zinc-100 pb-16">
            <div className="space-y-6">
              <span className="text-[12px] uppercase tracking-[1em] text-zinc-400 font-light block">{language === 'he' ? 'קולקציה נבחרת' : 'Curated Selection'}</span>
              <h2 className="text-5xl sm:text-6xl font-serif text-black">{t('home.featuredPieces')}</h2>
            </div>
            <Link 
              to="/products" 
              className="group flex items-center gap-6 text-[12px] uppercase tracking-[0.5em] font-bold text-black border-b border-zinc-200 pb-2 hover:border-black transition-all"
            >
              {t('home.viewAll')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-20 gap-y-32">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-20 font-serif italic text-2xl text-zinc-300 tracking-widest uppercase">
                Curating our latest creations...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Discovery / Metal Selection - Interactive */}
      <section className="bg-zinc-50 py-40 overflow-hidden border-y border-zinc-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-32 space-y-6">
            <span className="text-[12px] uppercase tracking-[1em] text-zinc-400 font-light block">{language === 'he' ? 'גלו את החומרים' : 'Discover the Elements'}</span>
            <h2 className="text-5xl sm:text-6xl font-serif text-black">{language === 'he' ? 'בחרו לפי סוג המתכת' : 'Selection by Metal'}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {metalPreviews.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 1.2 }}
                viewport={{ once: true }}
                onClick={() => navigate(`/products?color=${m.color}`)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-10 bg-zinc-200">
                   <img 
                     src={m.image} 
                     className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-110 grayscale-[50%] group-hover:grayscale-0" 
                     alt={m.name} 
                   />
                   <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700"></div>
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                      <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                         <Play className="w-5 h-5 text-black fill-black" />
                      </div>
                   </div>
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-[12px] uppercase tracking-[0.4em] font-bold text-black group-hover:text-zinc-500 transition-colors">{language === 'he' ? m.name_he : m.name}</h3>
                  <div className="w-8 h-[1px] bg-zinc-300 mx-auto transition-all group-hover:w-16 group-hover:bg-black"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story / Vision Section */}
      <section className="relative h-screen bg-black overflow-hidden flex items-center">
         <div className="absolute inset-0 z-0 opacity-40 grayscale">
            <img src="/images/new/p1.jpeg" className="w-full h-full object-cover" alt="Vision" />
         </div>
         <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl space-y-12">
               <motion.span 
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 className="text-[#f5f5dc] text-[12px] uppercase tracking-[1em] font-light block"
               >
                 {t('home.25Years')}
               </motion.span>
               <motion.h2 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="text-white text-5xl sm:text-7xl md:text-8xl font-serif leading-tight uppercase"
               >
                 {language === 'he' ? 'כל פריט מספר סיפור' : 'Every Piece Tells A Story'}
               </motion.h2>
               <motion.p 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 transition={{ delay: 0.4 }}
                 className="text-zinc-400 text-lg sm:text-xl font-light leading-relaxed max-w-2xl font-body italic"
               >
                 {language === 'he' ? 'מהמכרות האתיים ועד לידיים של האמנים המומחים שלנו, אנחנו יוצרים יותר מתכשיטים. אנחנו יוצרים מורשת.' : 'From ethical sourcing to the hands of our master artisans, we create more than jewelry. We create a legacy.'}
               </motion.p>
               <Link to="/about">
                 <Button className="mt-8 bg-[#f5f5dc] text-black hover:bg-[#e8e8c8] rounded-none px-12 py-8 uppercase tracking-[0.5em] font-bold text-[12px]">
                   {language === 'he' ? 'הסיפור שלנו' : 'Our Story'}
                 </Button>
               </Link>
            </div>
         </div>
      </section>

      {/* Testimonials / Client Appreciation */}
      <section className="py-40 bg-white border-t border-zinc-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-32 space-y-6">
            <span className="text-[12px] uppercase tracking-[1em] text-zinc-400 font-light block">{t('home.testimonials')}</span>
            <h2 className="text-5xl sm:text-6xl font-serif text-black">{language === 'he' ? 'המילים שלכם' : 'Client Kind Words'}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
             {testimonials.map((t, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 transition={{ delay: i * 0.2 }}
                 viewport={{ once: true }}
                 className="flex flex-col items-center text-center space-y-8 group"
               >
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => <Star key={star} className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />)}
                  </div>
                  <blockquote className="text-xl sm:text-2xl font-body italic text-black leading-relaxed font-light">
                    "{t.text}"
                  </blockquote>
                  <div className="space-y-1">
                    <cite className="text-[11px] uppercase tracking-[0.4em] font-bold text-black not-italic">{t.name}</cite>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">{t.location}</p>
                  </div>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-black py-40 border-t border-zinc-900">
         <div className="container mx-auto px-6 text-center space-y-16">
            <div className="flex flex-col items-center space-y-6">
               <Sparkles className="w-10 h-10 text-[#f5f5dc] opacity-50" />
               <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white uppercase tracking-widest">{language === 'he' ? 'מוכנים לזהור?' : 'Ready to Shine?'}</h2>
               <p className="text-zinc-500 text-[12px] uppercase tracking-[0.8em] font-bold max-w-xl">{language === 'he' ? 'גלו את התוספת המושלמת לאוסף שלכם' : 'Find the perfect addition to your curated collection'}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-8">
               <Link to="/products">
                 <Button className="bg-[#f5f5dc] text-black hover:bg-[#e8e8c8] rounded-none px-16 py-8 uppercase tracking-[0.5em] font-bold text-[12px] min-w-[280px]">
                    {language === 'he' ? 'קנו עכשיו' : 'Shop Collections'}
                 </Button>
               </Link>
               <Link to="/contact">
                 <Button variant="outline" className="text-white border-white/20 hover:border-white hover:bg-white/5 rounded-none px-16 py-8 uppercase tracking-[0.5em] font-bold text-[12px] min-w-[280px]">
                    {language === 'he' ? 'תיאום ייעוץ' : 'Contact Stylist'}
                 </Button>
               </Link>
            </div>
         </div>
      </section>

      {/* Simple Footer Text */}
      <footer className="bg-white py-20 border-t border-zinc-100 text-center space-y-12">
         <div className="flex justify-center gap-16">
            <Link to="/privacy" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-black transition-colors font-bold font-serif">Privacy</Link>
            <Link to="/terms" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-black transition-colors font-bold font-serif">Terms</Link>
            <Link to="/accessibility" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-black transition-colors font-bold font-serif">Accessibility</Link>
         </div>
         <p className="text-[9px] uppercase tracking-[0.6em] sm:tracking-[0.8em] text-zinc-400 font-serif">
           {t('footer.copyright')}
         </p>
      </footer>
    </div>
  );
};

export default Home;
