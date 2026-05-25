import React, { useRef, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Shield, Truck, RefreshCw, Award, ArrowRight, Instagram } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getAdBanners } from '../services/api';
import PiercingBooking from '../components/PiercingBooking';
import { Toaster } from 'sonner';

const ScrollSection: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const Home: React.FC = () => {
  const { t, language, getLocalizedField } = useLanguage();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
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
      
      {/* Redesigned Premium Hero - Dynamic Background */}
      <section ref={heroRef} className={`relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center pt-32 ${activeBanner.backgroundType === 'solid' ? 'bg-black' : ''}`}>
        
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

        {(activeBanner.backgroundType === 'image' || (activeBanner.backgroundType === 'video' && activeBanner.videoActive === false)) && (
          <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
            <img 
              src={activeBanner.image} 
              className="w-full h-full object-cover"
              alt="JOYA Hero"
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </motion.div>
        )}

        {activeBanner.backgroundType === 'solid' && (
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
            <h1 className="text-white text-5xl sm:text-7xl md:text-8xl font-serif uppercase tracking-[0.2em] mb-12">
              JOYA
            </h1>
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

        {/* Dynamic Metal Selection Gallery */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pb-20 mt-auto">
          {metalPreviews.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1, duration: 1.2 }}
              onClick={() => navigate(`/products?color=${m.color}`)}
              className="group cursor-pointer flex flex-col items-center"
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden border border-white/10 mb-4 sm:mb-6">
                <img src={m.image} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" alt={m.name} />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700"></div>
              </div>
              
              <div className="flex flex-col items-center">
                 <span className="text-white text-[10px] sm:text-[11px] md:text-[13px] uppercase tracking-[0.3em] sm:tracking-[0.4em] font-bold text-center px-2 transition-all duration-500 group-hover:tracking-[0.5em]">
                   {language === 'he' ? m.name_he : m.name}
                 </span>
                 <div className="w-6 h-[1px] bg-white/30 mt-3 sm:mt-4 transition-all duration-700 group-hover:w-16 group-hover:bg-white/60"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <ScrollSection className="py-32 sm:py-48 px-6 bg-white border-y border-zinc-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-serif mb-12 sm:mb-16 leading-[1.2] sm:leading-[1.1] text-black tracking-tight uppercase font-medium px-4">
            {language === 'he' ? 'דיוק בכל חיתוך, תשוקה בכל עיצוב.' : 'Precision in every cut, passion in every design.'}
          </h2>
          <Link to="/products" className="inline-flex items-center gap-6 sm:gap-8 text-black font-bold uppercase text-[12px] sm:text-[14px] tracking-[1em] group opacity-60 hover:opacity-100 transition-opacity">
            {t('home.viewAll')}
            <div className="w-10 sm:w-12 h-[1px] bg-black transition-all group-hover:w-20"></div>
          </Link>
        </div>
      </ScrollSection>

      {/* Featured Collection */}
      <section className="py-32 sm:py-48 px-6 max-w-screen-2xl mx-auto">
        <div className="flex flex-col items-center mb-20 sm:mb-28">
           <span className="text-[12px] sm:text-[14px] uppercase tracking-[0.8em] sm:tracking-[1em] text-zinc-400 mb-6 font-serif opacity-70">
             {language === 'he' ? 'נבחר עבורך' : 'Curated For You'}
           </span>
           <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif uppercase tracking-[0.1em] font-medium">
             {language === 'he' ? 'מוצגים' : 'Featured'}
           </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20">
          {featuredProducts.length > 0 ? featuredProducts.map((product: any, i: number) => (
            <motion.div 
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="flex flex-col group"
            >
              <Link to={`/product/${product._id}`} className="overflow-hidden aspect-[3/4] bg-zinc-50 mb-8 sm:mb-10 relative border border-zinc-100 grayscale hover:grayscale-0 transition-all duration-1000">
                <img 
                  src={product.images[0]} 
                  alt={getLocalizedField(product, 'name')}
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
              </Link>
              <span className="text-[9px] uppercase tracking-[0.5em] sm:tracking-[0.6em] text-zinc-400 mb-4 sm:mb-5 font-serif">{getLocalizedField(product.category, 'name')}</span>
              <h3 className="text-lg sm:text-xl font-serif mb-4 sm:mb-5 uppercase tracking-[0.1em] sm:tracking-[0.2em] font-medium">{getLocalizedField(product, 'name')}</h3>
              <p className="text-base sm:text-lg font-body italic text-zinc-500 italic font-light tracking-widest">₪{product.price.toLocaleString()}</p>
            </motion.div>
          )) : (
            <div className="col-span-3 text-center py-20 text-zinc-300 italic font-serif text-2xl tracking-[0.4em]">
              Curating our latest creations...
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 sm:py-48 bg-black text-white px-6">
        <div className="max-w-5xl mx-auto">
          <span className="text-[12px] sm:text-[14px] uppercase tracking-[1em] sm:tracking-[1.2em] text-zinc-600 block mb-16 sm:mb-20 text-center font-serif">{t('home.testimonials')}</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 sm:gap-20">
            {testimonials.map((item, i) => (
              <ScrollSection key={i} className="flex flex-col items-center text-center">
                <p className="text-xl sm:text-2xl md:text-3xl font-body italic mb-8 sm:mb-10 leading-relaxed font-light opacity-80 px-4">"{item.text}"</p>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.6em] sm:tracking-[0.8em] font-bold font-serif">{item.name}</span>
                <span className="text-[12px] sm:text-[14px] text-zinc-600 uppercase tracking-[0.4em] sm:tracking-[0.6em] mt-3 sm:mt-4 font-serif">{item.location}</span>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 sm:py-48 px-6 bg-white">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-20 max-w-screen-2xl mx-auto">
          {[
            { icon: Truck, title: 'service.freeShipping' },
            { icon: RefreshCw, title: 'service.30DayReturns' },
            { icon: Shield, title: 'service.lifetimeCare' },
            { icon: Award, title: 'service.certifiedQuality' }
          ].map((service, i) => (
            <ScrollSection key={i} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-zinc-100 flex items-center justify-center mb-8 sm:mb-10 text-black transition-all duration-1000 group-hover:border-black group-hover:scale-105">
                <service.icon className="w-5 h-5 sm:w-6 sm:h-6 opacity-60 group-hover:opacity-100" />
              </div>
              <h4 className="text-[10px] sm:text-[11px] font-serif mb-4 sm:mb-5 tracking-[0.3em] sm:tracking-[0.4em] uppercase font-medium">{t(service.title)}</h4>
              <p className="text-[8px] sm:text-[9px] text-zinc-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] leading-loose max-w-[180px] font-body opacity-80 group-hover:opacity-100 transition-opacity hidden sm:block">
                {t(service.title + 'Description')}
              </p>
            </ScrollSection>
          ))}
        </div>
      </section>

      {/* Footer Copyright */}
      <footer className="py-20 sm:py-24 border-t border-zinc-100 text-center bg-zinc-50">
         <div className="mb-10 sm:mb-14 opacity-80">
           <Link to="/" className="text-3xl sm:text-4xl font-serif font-bold uppercase tracking-[0.8em] sm:tracking-[1em] text-black">JOYA</Link>
         </div>
         <p className="text-[9px] uppercase tracking-[0.6em] sm:tracking-[0.8em] text-zinc-400 font-serif">
           {t('footer.copyright')}
         </p>
      </footer>
    </div>
  );
};

export default Home;
