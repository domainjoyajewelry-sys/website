import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ScrollToTop: React.FC = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const xOffset = language === 'he' ? "-100%" : "0%";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, x: xOffset }}
          animate={{ opacity: 1, y: 0, x: xOffset }}
          exit={{ opacity: 0, y: 20, x: xOffset }}
          onClick={scrollToTop}
          className="fixed bottom-8 left-1/2 z-40 bg-white/80 backdrop-blur-md text-black w-12 h-12 rounded-full shadow-2xl border border-zinc-100 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-500 group"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6 transition-transform group-hover:-translate-y-1" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
