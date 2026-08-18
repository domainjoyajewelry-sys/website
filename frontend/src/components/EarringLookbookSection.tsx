import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { getLookbook, getProducts } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingBag, ArrowRight, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const EarringLookbookSection: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [activeHotspot, setActiveHotspot] = useState<any>(null);

  const { data: lookbooks = [] } = useQuery({
    queryKey: ['lookbooks'],
    queryFn: getLookbook,
  });

  const lookbook = lookbooks[0] || {
    title: 'Earring & Ear Piercing Style Guide',
    title_he: 'מדריך סטיילינג עגילים ופירסינג',
    subtitle: 'Click on any marker to explore and shop the look',
    subtitle_he: 'לחצו על הנקודות המנצנצות לצפייה ורכישת התכשיט',
    image: '/images/lookbook_model.jpg',
    hotspots: [
      { x: 63, y: 50, label: 'Diamond Drop Chandelier Earring', label_he: 'עגיל ענתיק נתלה שנדליר יהלומים', price: 3450, image: '/images/new/p1.jpeg' },
      { x: 66, y: 43, label: 'Gold Huggie Lobe Hoop', label_he: 'עגיל חישוק קלאסי תנוך זהב', price: 890, image: '/images/new/p2.jpeg' },
      { x: 62, y: 38, label: 'Tragus Diamond Hoop', label_he: 'עגיל טרגוס יהלום משובץ', price: 650, image: '/images/new/p3.jpeg' },
      { x: 73, y: 33, label: 'Helix Triple Diamond Stud', label_he: 'עגיל הליקס שלישיית יהלומים', price: 1200, image: '/images/new/p1.jpeg' }
    ]
  };

  const titleText = language === 'he' ? lookbook.title_he : lookbook.title;
  const subtitleText = language === 'he' ? lookbook.subtitle_he : lookbook.subtitle;

  return (
    <section className="py-24 bg-zinc-950 text-white relative overflow-hidden">
      {/* Soft Gold Background Ambient Glow */}
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] uppercase tracking-[0.4em] font-serif font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'he' ? 'סטיילינג אינטראקטיבי' : 'Interactive Styling Guide'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif uppercase tracking-widest text-white">
            {titleText}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-serif tracking-widest uppercase">
            {subtitleText}
          </p>
        </div>

        {/* Lookbook Interactive Container */}
        <div className="relative max-w-4xl mx-auto rounded-none overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
          <div className="relative aspect-[3/4] sm:aspect-[4/3] w-full">
            <img 
              src={lookbook.image || '/images/lookbook_model.jpg'} 
              alt={titleText} 
              className="w-full h-full object-cover object-center"
            />
            
            {/* Dark Gradient Overlay for Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

            {/* Hotspot Markers */}
            {lookbook.hotspots && lookbook.hotspots.map((spot: any, index: number) => {
              const isActive = activeHotspot === spot;

              return (
                <div 
                  key={index} 
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }} 
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  {/* Pulsating Ring */}
                  <div className="relative group">
                    <motion.button
                      onClick={() => setActiveHotspot(isActive ? null : spot)}
                      onMouseEnter={() => setActiveHotspot(spot)}
                      whileHover={{ scale: 1.25 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xl ${
                        isActive 
                          ? 'bg-amber-400 text-black border-2 border-white ring-4 ring-amber-400/40' 
                          : 'bg-black/80 text-amber-400 border border-amber-400/60 hover:bg-amber-400 hover:text-black'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                    </motion.button>
                    
                    {/* Ripple Pulse Effect */}
                    <span className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />
                  </div>
                </div>
              );
            })}

            {/* Active Hotspot Floating Product Card Popover */}
            <AnimatePresence>
              {activeHotspot && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-6 start-6 end-6 sm:start-auto sm:end-8 sm:w-80 z-30 bg-zinc-950/95 backdrop-blur-md border border-amber-500/30 p-5 shadow-2xl"
                >
                  <button 
                    onClick={() => setActiveHotspot(null)}
                    className="absolute top-3 end-3 text-zinc-400 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex gap-4 items-center">
                    <img 
                      src={activeHotspot.image || (activeHotspot.product && activeHotspot.product.images?.[0]) || '/images/new/p1.jpeg'} 
                      alt={activeHotspot.label} 
                      className="w-16 h-16 object-cover border border-zinc-800"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase tracking-widest text-amber-400 font-serif font-bold block">
                        {language === 'he' ? 'קולקציית עגילים' : 'Curated Earring'}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-white truncate mt-0.5">
                        {language === 'he' ? (activeHotspot.label_he || activeHotspot.label) : activeHotspot.label}
                      </h4>
                      <p className="font-body text-lg italic text-amber-300 font-bold mt-1">
                        ₪{(activeHotspot.price || (activeHotspot.product && activeHotspot.product.price) || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-end">
                    <Button 
                      onClick={() => {
                        if (activeHotspot.product?._id) {
                          navigate(`/product/${activeHotspot.product._id}`);
                        } else {
                          navigate('/products');
                        }
                      }}
                      className="w-full bg-amber-400 hover:bg-amber-300 text-black font-serif uppercase text-[10px] tracking-[0.2em] font-bold rounded-none py-3 flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{language === 'he' ? 'לרכישת העגיל' : 'Shop This Earring'}</span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
};

export default EarringLookbookSection;
