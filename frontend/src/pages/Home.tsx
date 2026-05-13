import React, { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Shield, Truck, RefreshCw, Award, ArrowRight, Instagram } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/api';
import PiercingBooking from '../components/PiercingBooking';
import { Toaster } from 'sonner';

const ScrollSection: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const Home: React.FC = () => {
  const { t, language, getLocalizedField } = useLanguage();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const featuredProducts = allProducts.filter((p: any) => p.featured).slice(0, 3);

  const testimonials = [
    { name: 'מיכל כהן', text: 'התכשיטים הכי יפים שקניתי! השירות היה מדהים והאיכות פשוט פרימיום.', location: 'תל אביב' },
    { name: 'רוני לוי', text: 'עשיתי פירסינג בקריון והיה פשוט מושלם. מקצועי, נקי ומהיר.', location: 'חיפה' },
    { name: 'שירז אברהם', text: 'השרשרת הגיעה תוך יומיים באריזה יוקרתית. מומלץ בחום!', location: 'רמת גן' },
  ];

  const piercingGallery = [
    'https://images.unsplash.com/photo-1596944229530-0f2c45339396?q=80&w=2000',
    'https://images.unsplash.com/photo-1610636257321-df62a63273e9?q=80&w=2000',
    'https://images.unsplash.com/photo-1582234032483-20f443588960?q=80&w=2000',
    'https://images.unsplash.com/photo-1596633605700-1fdc94300bf1?q=80&w=2000',
  ];

  return (
    <div className="bg-white">
      <Toaster position="top-center" />
      
      {/* Redesigned Premium Hero */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <motion.div style={{ y, opacity }} className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2940&auto=format&fit=crop" 
            className="w-full h-full object-cover"
            alt="JOYA Hero"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </motion.div>
        
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <span className="text-white text-xs md:text-sm uppercase tracking-[0.8em] mb-8 font-light block">
              Luxury Jewelry House
            </span>
            <h1 className="text-7xl md:text-[12rem] font-serif text-white italic leading-none mb-4 tracking-tighter">
              ג'ויה
            </h1>
            <p className="text-white text-lg md:text-3xl font-serif italic mb-12 opacity-80 max-w-2xl">
              {language === 'he' ? 'אומנות מעולה, אלגנטיות נצחית' : 'Exquisite Craftsmanship, Timeless Elegance'}
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/products">
                <Button className="bg-white text-black hover:bg-zinc-200 rounded-none px-16 py-8 text-xs uppercase tracking-[0.4em] font-bold transition-all border-none">
                  {language === 'he' ? 'לקולקציה החדשה' : 'Shop Collection'}
                </Button>
              </Link>
              <PiercingBooking 
                trigger={
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-none px-16 py-8 text-xs uppercase tracking-[0.4em] font-bold transition-all">
                    {t('home.bookNow')}
                  </Button>
                }
              />
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-4"
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-white to-transparent"></div>
        </motion.div>
      </section>

      {/* Moving Piercing Gallery */}
      <section className="py-32 bg-zinc-50 overflow-hidden">
        <div className="container mx-auto px-6 mb-20 text-center">
          <span className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 block mb-6">Explore Our Studio</span>
          <h2 className="text-5xl md:text-7xl font-serif italic text-black">{language === 'he' ? 'פירסינג כדרך חיים' : 'Piercing as an Art'}</h2>
        </div>
        
        <div className="flex gap-8 px-8 whitespace-nowrap overflow-hidden">
           <motion.div 
             animate={{ x: [0, -1000] }}
             transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
             className="flex gap-8 flex-nowrap"
           >
             {[...piercingGallery, ...piercingGallery].map((img, i) => (
               <div key={i} className="w-[400px] h-[500px] bg-zinc-200 flex-shrink-0 relative group">
                  <img src={img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Piercing" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Instagram className="text-white w-8 h-8" />
                  </div>
               </div>
             ))}
           </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <ScrollSection className="py-40 px-6 bg-white border-y border-zinc-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-8xl font-serif italic mb-16 leading-tight text-black tracking-tight">
            {language === 'he' ? 'דיוק בכל חיתוך, תשוקה בכל עיצוב.' : 'Precision in every cut, passion in every design.'}
          </h2>
          <Link to="/products" className="inline-flex items-center gap-6 text-black font-bold uppercase text-[10px] tracking-[0.5em] group">
            {t('home.viewAll')}
            <div className="w-12 h-[1px] bg-black transition-all group-hover:w-20"></div>
          </Link>
        </div>
      </ScrollSection>

      {/* Featured Collection */}
      <section className="py-40 px-6 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-16">
          {featuredProducts.length > 0 ? featuredProducts.map((product: any, i: number) => (
            <motion.div 
              key={product._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col group"
            >
              <Link to={`/product/${product._id}`} className="overflow-hidden aspect-[4/5] bg-zinc-50 mb-10 relative">
                <img 
                  src={product.images[0]} 
                  alt={getLocalizedField(product, 'name')}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 border border-black/0 group-hover:border-black/5 transition-all m-4"></div>
              </Link>
              <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 mb-4">{getLocalizedField(product.category, 'name')}</span>
              <h3 className="text-3xl font-serif italic mb-4">{getLocalizedField(product, 'name')}</h3>
              <p className="text-xl font-light tracking-widest text-zinc-600">₪{product.price.toLocaleString()}</p>
            </motion.div>
          )) : (
            <div className="col-span-3 text-center py-20 text-zinc-300 italic font-serif text-3xl">
              Curating our latest creations...
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-40 bg-black text-white px-6">
        <div className="max-w-6xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-500 block mb-12 text-center">{t('home.testimonials')}</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {testimonials.map((item, i) => (
              <ScrollSection key={i} className="flex flex-col items-center text-center">
                <p className="text-2xl font-serif italic mb-8 leading-relaxed">"{item.text}"</p>
                <span className="text-xs uppercase tracking-widest font-bold">{item.name}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">{item.location}</span>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-40 px-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 max-w-screen-2xl mx-auto">
          {[
            { icon: Truck, title: 'service.freeShipping' },
            { icon: RefreshCw, title: 'service.30DayReturns' },
            { icon: Shield, title: 'service.lifetimeCare' },
            { icon: Award, title: 'service.certifiedQuality' }
          ].map((service, i) => (
            <ScrollSection key={i} className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full border border-zinc-100 flex items-center justify-center mb-10 text-black transition-colors group-hover:bg-black group-hover:text-white">
                <service.icon className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-serif italic mb-4">{t(service.title)}</h4>
              <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] leading-loose max-w-[200px]">
                {t(service.title + 'Description')}
              </p>
            </ScrollSection>
          ))}
        </div>
      </section>

      {/* Footer Copyright */}
      <footer className="py-24 border-t border-zinc-100 text-center bg-zinc-50">
         <div className="mb-12">
           <Link to="/" className="text-4xl font-serif font-bold uppercase tracking-[0.5em] text-black">JOYA</Link>
         </div>
         <p className="text-[10px] uppercase tracking-[0.6em] text-zinc-400">
           {t('footer.copyright')}
         </p>
      </footer>
    </div>
  );
};

export default Home;
