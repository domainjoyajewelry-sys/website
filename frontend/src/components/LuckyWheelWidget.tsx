import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from 'lucide-react';
import LuckyWheel from './LuckyWheel';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { useLocation } from 'react-router-dom';

const LuckyWheelWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';

  return (
    <>
      {/* Floating Button - Circular and on the Left */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isHomePage && !isScrolled ? 0 : 1, 
          opacity: isHomePage && !isScrolled ? 0 : 1,
          x: isHomePage && !isScrolled ? -100 : 0
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-48 left-8 z-40 bg-[#f5f5dc] text-black w-14 h-14 rounded-full shadow-2xl border border-zinc-200 flex items-center justify-center group transition-all duration-700"
      >
        <Gift className="w-6 h-6" />
        <span className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-black text-white text-[9px] uppercase tracking-widest font-bold px-3 py-2 pointer-events-none">
           Lucky Wheel
        </span>
      </motion.button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl p-0 bg-transparent border-none shadow-none sm:rounded-none">
           <DialogTitle className="sr-only">Lucky Wheel</DialogTitle>
           <DialogDescription className="sr-only">Spin the wheel to win exclusive boutique gifts.</DialogDescription>
           <LuckyWheel onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LuckyWheelWidget;
