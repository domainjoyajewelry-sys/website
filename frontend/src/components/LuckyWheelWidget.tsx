import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from 'lucide-react';
import LuckyWheel from './LuckyWheel';
import { Dialog, DialogContent } from './ui/dialog';

const LuckyWheelWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button - Circular and on the Left */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-52 left-8 z-40 bg-[#f5f5dc] text-black w-14 h-14 rounded-full shadow-2xl border border-zinc-200 flex items-center justify-center group"
      >
        <Gift className="w-6 h-6" />
        <span className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-black text-white text-[9px] uppercase tracking-widest font-bold px-3 py-2 pointer-events-none">
           Lucky Wheel
        </span>
      </motion.button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl p-0 bg-transparent border-none shadow-none sm:rounded-none">
           <LuckyWheel onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LuckyWheelWidget;
