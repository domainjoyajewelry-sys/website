import React, { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Shield, Truck, RefreshCw, Award, ArrowRight } from 'lucide-react';
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

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const featuredProducts = allProducts.filter((p: any) => p.featured).slice(0, 3);

  return (
    <div className="bg-white">
      <Toaster position="top-center" />
      
      {/* Cinematic Hero */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
        <motion.div style={{ y, opacity }} className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2940&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-60 scale-110"
            alt="Hero"
          />
        </motion.div>
        
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-6xl md:text-9xl font-serif text-white italic mb-8 tracking-tighter"
          >
            {t('app.title')}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <PiercingBooking 
              trigger={
                <Button className="bg-white text-black hover:bg-zinc-200 rounded-none px-12 py-8 text-lg uppercase tracking-widest transition-all">
                  {t('home.bookNow')}
                </Button>
              }
            />
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
          <div className="w-[1px] h-12 bg-white/20"></div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <ScrollSection className="py-32 px-6 bg-zinc-50">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.5em] text-zinc-400 mb-8 block">Our Philosophy</span>
          <h2 className="text-4xl md:text-6xl font-serif italic mb-12 leading-tight text-black">
            {language === 'he' ? 'אומנות פוגשת אלגנטיות בכל פרט קטן. אנחנו יוצרים תכשיטים שנשארים איתך לנצח.' : 'Where craftsmanship meets timeless elegance. We create pieces that stay with you forever.'}
          </h2>
          <Link to="/products" className="inline-flex items-center gap-4 text-black font-medium group uppercase text-xs tracking-[0.3em]">
            {t('home.viewAll')}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>
      </ScrollSection>

      {/* Featured Collection - Popping Images */}
      <section className="py-32 px-6 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
          {featuredProducts.length > 0 ? featuredProducts.map((product: any, i: number) => (
            <motion.div 
              key={product._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col group"
            >
              <Link to={`/products/${product._id}`} className="overflow-hidden aspect-[4/5] bg-zinc-100 mb-8">
                <img 
                  src={product.images[0]} 
                  alt={getLocalizedField(product, 'name')}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </Link>
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-2">{getLocalizedField(product.category, 'name')}</span>
              <h3 className="text-2xl font-serif italic mb-4">{getLocalizedField(product, 'name')}</h3>
              <p className="text-xl font-light">₪{product.price.toLocaleString()}</p>
            </motion.div>
          )) : (
            <div className="col-span-3 text-center py-20 text-zinc-400 italic font-serif text-2xl">
              Curating elegance...
            </div>
          )}
        </div>
      </section>

      {/* Full Width Image Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.2 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2940" 
            className="w-full h-full object-cover"
            alt="Craftsmanship"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="text-center text-white px-6 max-w-3xl">
              <ScrollSection>
                <h2 className="text-5xl md:text-7xl font-serif italic mb-8 tracking-tight">
                  {language === 'he' ? 'דיוק בכל חיתוך' : 'Precision in every cut'}
                </h2>
                <p className="text-lg md:text-xl font-light opacity-90 leading-relaxed mb-12">
                   {language === 'he' ? 'היהלומים שלנו נבחרים בקפידה ומעובדים בעבודת יד כדי להבטיח נצנוץ מושלם שנמשך דורות.' : 'Our diamonds are carefully selected and hand-crafted to ensure a perfect sparkle that lasts generations.'}
                </p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black rounded-none px-12 py-8 uppercase tracking-widest">
                  {t('home.discoverMore')}
                </Button>
              </ScrollSection>
           </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
          {[
            { icon: Truck, title: 'service.freeShipping' },
            { icon: RefreshCw, title: 'service.30DayReturns' },
            { icon: Shield, title: 'service.lifetimeCare' },
            { icon: Award, title: 'service.certifiedQuality' }
          ].map((service, i) => (
            <ScrollSection key={i} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full border border-zinc-200 flex items-center justify-center mb-6 text-black">
                <service.icon className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-serif italic mb-2">{t(service.title)}</h4>
              <p className="text-xs text-zinc-500 uppercase tracking-widest leading-loose">
                {t(service.title + 'Description')}
              </p>
            </ScrollSection>
          ))}
        </div>
      </section>

      {/* Footer Copyright */}
      <footer className="py-20 border-t border-zinc-100 text-center">
         <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-400">
           {t('footer.copyright')}
         </p>
      </footer>
    </div>
  );
};

export default Home;
