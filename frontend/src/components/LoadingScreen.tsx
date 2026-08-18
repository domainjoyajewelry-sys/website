import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (onComplete) onComplete();
    }, 1500); // 1.5s smooth intro splash

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
          }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="relative flex flex-col items-center">
            {/* Elegant Shimmer Background */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.05 }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse", 
                ease: "easeInOut" 
              }}
              className="absolute w-[500px] h-[500px] bg-[#f5f5dc] rounded-full blur-[100px]"
            />

            {/* Brand Logo / Text */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <img src="/logo.png" alt="JOYA" className="h-24 sm:h-32 w-auto mb-12" />
              
              <div className="space-y-4 text-center">
                <span className="text-[10px] uppercase tracking-[1em] text-zinc-400 block font-serif">
                  Luxury Jewelry House
                </span>
                
                {/* Minimalist Progress Line */}
                <div className="w-48 h-[1px] bg-zinc-100 overflow-hidden relative mx-auto mt-8">
                  <motion.div
                    initial={{ left: "-100%" }}
                    animate={{ left: "100%" }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    className="absolute inset-0 bg-black w-1/2"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Luxury Text Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="absolute bottom-12 text-[9px] uppercase tracking-[0.6em] text-zinc-500 font-serif"
          >
            Crafting Timeless Elegance
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
