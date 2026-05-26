import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { X, Camera, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

interface VirtualTryOnProps {
  productImage: string;
  onClose: () => void;
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ productImage, onClose }) => {
  const { t, language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    async function setupCamera() {
      try {
        const constraints = { 
          video: { 
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        };
        const userStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
        }
        setStream(userStream);
      } catch (err: any) {
        console.error("Error accessing camera:", err);
        setError(err.name === "NotAllowedError" ? t('tryOn.allowCamera') : t('tryOn.noCamera'));
      }
    }

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/60 to-transparent">
        <h2 className="text-white font-serif uppercase tracking-[0.3em] text-sm">{t('tryOn.title')}</h2>
        <button onClick={onClose} className="text-white hover:text-zinc-300 transition-colors">
          <X className="w-8 h-8" />
        </button>
      </div>

      {/* Video / Camera Feed */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-center space-y-6 px-10">
            <Camera className="w-16 h-16 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 font-serif uppercase tracking-widest text-sm">{error}</p>
            <Button onClick={onClose} variant="outline" className="text-white border-white/20 hover:bg-white/10 rounded-none uppercase tracking-[0.4em] text-[10px] font-bold">
              {t('tryOn.close')}
            </Button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover grayscale-[20%] opacity-80"
            />
            
            {/* The Draggable Product Overlay */}
            <motion.div
              drag
              dragMomentum={false}
              className="absolute z-40 cursor-move pointer-events-auto"
              style={{ x: 0, y: 0 }}
            >
              <motion.div
                animate={{ 
                  scale: scale,
                  rotate: rotation
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative"
              >
                <img 
                  src={productImage} 
                  alt="Earring Try-On" 
                  className="w-24 sm:w-32 md:w-40 h-auto drop-shadow-2xl select-none pointer-events-none"
                />
              </motion.div>
            </motion.div>

            {/* Instruction Overlay */}
            <div className="absolute bottom-40 left-0 right-0 text-center z-50 pointer-events-none">
               <span className="bg-black/40 backdrop-blur-md text-white/80 text-[9px] uppercase tracking-[0.3em] px-4 py-2 font-bold">
                 {t('tryOn.instruction')}
               </span>
            </div>
          </>
        )}
      </div>

      {/* Controls Bar */}
      {!error && (
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 bg-gradient-to-t from-black/80 to-transparent z-50">
          <div className="max-w-md mx-auto space-y-10">
            {/* Scale Control */}
            <div className="space-y-4">
               <div className="flex justify-between items-center text-white/60 text-[9px] uppercase tracking-widest font-bold">
                  <span>{t('tryOn.scale')}</span>
                  <div className="flex gap-4">
                     <button onClick={() => setScale(prev => Math.max(0.2, prev - 0.1))}><Minimize2 className="w-3 h-3" /></button>
                     <button onClick={() => setScale(prev => Math.min(3, prev + 0.1))}><Maximize2 className="w-3 h-3" /></button>
                  </div>
               </div>
               <Slider 
                 value={[scale]} 
                 min={0.2} 
                 max={3} 
                 step={0.01} 
                 onValueChange={(v) => setScale(v[0])}
                 className="[&_[role=slider]]:bg-white"
               />
            </div>

            {/* Rotation Control */}
            <div className="space-y-4">
               <div className="flex justify-between items-center text-white/60 text-[9px] uppercase tracking-widest font-bold">
                  <span>{t('tryOn.rotate')}</span>
                  <button onClick={handleReset} className="flex items-center gap-2 hover:text-white transition-colors">
                     <RotateCcw className="w-3 h-3" />
                  </button>
               </div>
               <Slider 
                 value={[rotation]} 
                 min={-180} 
                 max={180} 
                 step={1} 
                 onValueChange={(v) => setRotation(v[0])}
                 className="[&_[role=slider]]:bg-white"
               />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualTryOn;
