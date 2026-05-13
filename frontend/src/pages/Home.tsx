import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Shield, Truck, RefreshCw, Certificate } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAdBanners, getProducts } from '../services/api';
import PiercingBooking from '../components/PiercingBooking';
import { Toaster } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Home: React.FC = () => {
  const { t, language, getLocalizedField } = useLanguage();

  // Fetch Ad Banners
  const { data: adBanners = [], isLoading: isLoadingBanners } = useQuery({
    queryKey: ['adBanners'],
    queryFn: getAdBanners,
    select: (data) => data.filter((banner: any) => banner.isActive).sort((a: any, b: any) => a.order - b.order),
  });

  // Fetch Featured Products
  const { data: allProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const featuredProducts = allProducts.filter((product: any) => product.featured).slice(0, 4);

  // Placeholder categories
  const categories = [
    {
      name_en: 'Rings',
      name_he: 'טבעות',
      image: 'https://images.unsplash.com/photo-1598910404395-6d60a5e2f7f9?q=80&w=2940&auto=format&fit=crop',
      link: '/products?category=rings',
    },
    {
      name_en: 'Necklaces',
      name_he: 'שרשראות',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=2940&auto=format&fit=crop',
      link: '/products?category=necklaces',
    },
    {
      name_en: 'Earrings',
      name_he: 'עגילים',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2940&auto=format&fit=crop',
      link: '/products?category=earrings',
    },
    {
      name_en: 'Bracelets',
      name_he: 'צמידים',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2940&auto=format&fit=crop',
      link: '/products?category=bracelets',
    },
  ];

  if (isLoadingBanners || isLoadingProducts) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-amber-700 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-stone-500 font-serif italic">Loading Joya Elegance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <Toaster position="top-center" />
      
      {/* Hero Banner Section */}
      <section className="relative w-full h-[70vh] md:h-[90vh]">
        <Carousel className="w-full h-full">
          <CarouselContent className="h-full">
            {adBanners.length > 0 ? (
              adBanners.map((banner: any, index: number) => (
                <CarouselItem key={banner._id || index} className="h-full">
                  <div
                    className="relative h-full w-full bg-cover bg-center flex items-center justify-center text-white"
                    style={{ backgroundImage: `url(${banner.image})` }}
                  >
                    <div className="absolute inset-0 bg-black/40"></div>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="relative z-10 text-center max-w-4xl px-6"
                    >
                      <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">
                        {getLocalizedField(banner, 'title')}
                      </h2>
                      <p className="text-xl md:text-3xl mb-8 font-light italic">
                        {getLocalizedField(banner, 'subtitle')}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to={banner.link}>
                          <Button variant="default" className="bg-white text-stone-900 hover:bg-stone-100 px-10 py-6 text-xl rounded-none transition-all duration-300 transform hover:scale-105">
                            {t('home.discoverMore')}
                          </Button>
                        </Link>
                        <PiercingBooking 
                          trigger={
                            <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-10 py-6 text-xl rounded-none transition-all duration-300">
                              {t('home.bookNow')}
                            </Button>
                          } 
                        />
                      </div>
                    </motion.div>
                  </div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="h-full">
                 <div
                    className="relative h-full w-full bg-cover bg-center flex items-center justify-center text-white"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2940&auto=format&fit=crop')` }}
                  >
                    <div className="absolute inset-0 bg-black/40"></div>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="relative z-10 text-center max-w-4xl px-6"
                    >
                      <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">
                        {t('app.title')}
                      </h2>
                      <p className="text-xl md:text-3xl mb-8 font-light italic">
                        {language === 'en' ? 'Exquisite Craftsmanship, Timeless Elegance' : 'אומנות מעולה, אלגנטיות נצחית'}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/products">
                          <Button variant="default" className="bg-white text-stone-900 hover:bg-stone-100 px-10 py-6 text-xl rounded-none transition-all duration-300 transform hover:scale-105">
                            {t('home.discoverMore')}
                          </Button>
                        </Link>
                        <PiercingBooking 
                          trigger={
                            <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-10 py-6 text-xl rounded-none transition-all duration-300">
                              {t('home.bookNow')}
                            </Button>
                          } 
                        />
                      </div>
                    </motion.div>
                  </div>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex left-8 bg-transparent text-white border-white hover:bg-white/20" />
          <CarouselNext className="hidden md:flex right-8 bg-transparent text-white border-white hover:bg-white/20" />
        </Carousel>
      </section>

      {/* Piercing Services Section - NEW */}
      <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[url('https://images.unsplash.com/photo-1560731210-608b8941656b?q=80&w=2000&auto=format&fit=crop')] opacity-10 grayscale"></div>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-amber-500 uppercase tracking-widest font-semibold mb-4 block">
                {t('home.piercingLocation')}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">
                {t('home.schedulePiercing')}
              </h2>
              <p className="text-stone-300 text-lg leading-relaxed mb-10 max-w-lg">
                {t('home.piercingDescription')}
              </p>
              <div className="space-y-6 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center text-amber-500">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{language === 'en' ? 'Safe & Sterile' : 'בטוח וסטרילי'}</h4>
                    <p className="text-stone-400 text-sm">{language === 'en' ? 'Highest medical standards' : 'הסטנדרטים הרפואיים הגבוהים ביותר'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center text-amber-500">
                    <Certificate className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{language === 'en' ? 'Expert Piercers' : 'פירסרים מומחים'}</h4>
                    <p className="text-stone-400 text-sm">{language === 'en' ? 'Years of professional experience' : 'שנים של ניסיון מקצועי'}</p>
                  </div>
                </div>
              </div>
              <PiercingBooking 
                trigger={
                  <Button variant="default" className="bg-amber-600 hover:bg-amber-700 text-white px-12 py-7 text-xl rounded-none">
                    {t('home.bookNow')}
                  </Button>
                } 
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square md:aspect-video lg:aspect-square overflow-hidden rounded-sm"
            >
              <img 
                src="https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=1965&auto=format&fit=crop" 
                alt="Piercing Studio"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4">
              {language === 'en' ? 'Curated Collections' : 'קולקציות נבחרות'}
            </h2>
            <div className="w-24 h-1 bg-amber-700 mx-auto"></div>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {categories.map((category, index) => (
              <motion.div 
                variants={itemVariants} 
                key={index} 
                className="group relative h-[450px] overflow-hidden rounded-none shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <img
                  src={category.image}
                  alt={language === 'en' ? category.name_en : category.name_he}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-stone-900/40 transition-all duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-3xl font-serif font-bold mb-4 drop-shadow-md">
                    {language === 'en' ? category.name_en : category.name_he}
                  </h3>
                  <Link to={category.link}>
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-stone-900 rounded-none px-6 py-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      {t('home.discoverMore')}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-stone-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className={language === 'he' ? 'text-right' : 'text-left'}>
              <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4">
                {t('home.featuredPieces')}
              </h2>
              <p className="text-stone-500 italic font-light text-lg">
                {language === 'en' ? 'Exceptional jewelry for your most precious moments.' : 'תכשיטים יוצאי דופן לרגעים היקרים ביותר שלך.'}
              </p>
            </div>
            <Link to="/products">
              <Button variant="ghost" className="text-amber-800 hover:text-amber-900 hover:bg-transparent p-0 text-lg flex items-center gap-2 group">
                {t('home.viewAll')}
                <span className={`transition-transform duration-300 ${language === 'he' ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`}>
                  {language === 'he' ? '←' : '→'}
                </span>
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuredProducts.map((product: any) => (
              <motion.div
                key={product._id}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="group overflow-hidden border-none bg-transparent shadow-none">
                  <Link to={`/product/${product._id}`} className="block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-white mb-6">
                      <img
                        src={product.images[0]}
                        alt={getLocalizedField(product, 'name')}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {product.countInStock === 0 && (
                        <div className="absolute top-4 right-4 bg-stone-900/80 text-white text-xs px-3 py-1 uppercase tracking-widest">
                          {t('productCard.outOfStock')}
                        </div>
                      )}
                    </div>
                    <div className="text-center px-2">
                      <h3 className="text-xl font-serif text-stone-900 mb-2 group-hover:text-amber-800 transition-colors">
                        {getLocalizedField(product, 'name')}
                      </h3>
                      <p className="text-amber-700 font-bold text-lg">₪{product.price.toLocaleString()}</p>
                    </div>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: language === 'he' ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-stone-100 -z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2940&auto=format&fit=crop"
                alt="Craftsmanship"
                className="rounded-none shadow-2xl w-full h-[600px] object-cover"
              />
              <div className="absolute -bottom-10 -right-10 p-12 bg-stone-900 text-white hidden md:block max-w-xs">
                <p className="italic text-xl font-serif">"Every jewel we create is a piece of art, a legacy of beauty."</p>
                <p className="mt-4 font-bold uppercase tracking-widest text-sm text-amber-500">A. Joya, Founder</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: language === 'he' ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={language === 'he' ? 'text-right' : 'text-left'}
            >
              <span className="text-amber-700 uppercase tracking-[0.3em] font-bold mb-6 block">Our Heritage</span>
              <h2 className="text-5xl md:text-6xl font-serif text-stone-900 mb-8 leading-tight">
                Crafting Timeless <br /> Legacies Since 1998
              </h2>
              <p className="text-stone-600 text-xl leading-relaxed mb-10 font-light">
                {t('footer.brandDescription')} For over two decades, Joya has been at the forefront of luxury jewelry design in Israel. Our artisans blend ancient techniques with modern vision to create pieces that resonate with soul and sophistication.
              </p>
              <div className="grid grid-cols-2 gap-10 mb-12">
                <div>
                  <h3 className="text-4xl font-serif font-bold text-amber-800 mb-2">25+</h3>
                  <p className="text-stone-500 uppercase tracking-widest text-xs font-bold">Years of Excellence</p>
                </div>
                <div>
                  <h3 className="text-4xl font-serif font-bold text-amber-800 mb-2">10k</h3>
                  <p className="text-stone-500 uppercase tracking-widest text-xs font-bold">Private Clients</p>
                </div>
              </div>
              <Link to="/about">
                <Button variant="default" className="bg-stone-900 hover:bg-stone-800 text-white px-10 py-6 text-lg rounded-none transition-all duration-300">
                  {language === 'en' ? 'Our Journey' : 'המסע שלנו'}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services/Features Section */}
      <section className="py-24 bg-stone-50 border-y border-stone-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Truck, title: 'service.freeShipping', desc: 'service.freeShippingDescription' },
              { icon: RefreshCw, title: 'service.30DayReturns', desc: 'service.30DayReturnsDescription' },
              { icon: Shield, title: 'service.lifetimeCare', desc: 'service.lifetimeCareDescription' },
              { icon: Certificate, title: 'service.certifiedQuality', desc: 'service.certifiedQualityDescription' }
            ].map((service, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="mb-6 p-5 bg-white rounded-full shadow-sm group-hover:bg-amber-50 transition-colors duration-300">
                  <service.icon className="h-8 w-8 text-amber-700" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-3 uppercase tracking-widest">{t(service.title)}</h3>
                <p className="text-stone-500 text-sm leading-relaxed max-w-[240px]">
                  {t(service.desc)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <h2 className="text-4xl font-serif text-stone-900 mb-4">
              {t('home.testimonials')}
            </h2>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map(s => <span key={s} className="text-amber-500">★</span>)}
            </div>
          </div>
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-4xl font-serif italic text-stone-700 leading-relaxed mb-10"
          >
            "Joya's jewelry is simply exquisite. The craftsmanship is unparalleled, and every piece tells a unique story. Their piercing studio at Kiryon is professional and welcoming."
          </motion.blockquote>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-stone-200 mb-4"></div>
            <p className="text-xl font-bold text-stone-900">Sarah L.</p>
            <p className="text-stone-400 uppercase tracking-widest text-xs mt-1">Loyal Client</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
