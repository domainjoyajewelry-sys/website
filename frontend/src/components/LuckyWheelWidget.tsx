import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from 'lucide-react';
import LuckyWheel from './LuckyWheel';
import { Dialog, DialogContent } from './ui/dialog';

const LuckyWheelWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-8 z-40 bg-[#f5f5dc] text-black p-5 rounded-full shadow-2xl border border-zinc-200 group flex items-center gap-3 overflow-hidden"
      >
        <Gift className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap text-[10px] uppercase tracking-widest font-bold">
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
