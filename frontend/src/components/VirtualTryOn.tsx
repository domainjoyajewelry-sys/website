import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { X, Camera, RotateCcw, Maximize2, Minimize2, Upload, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

interface VirtualTryOnProps {
  productImage: string;
  onClose: () => void;
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ productImage, onClose }) => {
  const { t, language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!capturedImage) {
      setupCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [capturedImage]);

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
      setError(null);
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      if (!capturedImage) {
        setError(err.name === "NotAllowedError" ? t('tryOn.allowCamera') : t('tryOn.noCamera'));
      }
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }

  const handleSnap = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL('image/jpeg'));
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[110] bg-gradient-to-b from-black/60 to-transparent px-8 sm:px-12">
        <h2 className="text-white font-serif uppercase tracking-[0.3em] text-sm">{t('tryOn.title')}</h2>
        <div className="flex gap-6 items-center">
           <Button 
             variant="ghost" 
             size="sm"
             onClick={() => capturedImage ? setCapturedImage(null) : fileInputRef.current?.click()}
             className="text-white hover:bg-white/10 uppercase tracking-widest text-[9px] font-bold flex gap-2"
           >
             {capturedImage ? <RefreshCw className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
             {capturedImage ? t('tryOn.useCamera') : t('tryOn.uploadPhoto')}
           </Button>
           <button onClick={onClose} className="text-white hover:text-zinc-300 transition-colors p-2">
             <X className="w-8 h-8" />
           </button>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Content Area */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {error && !capturedImage ? (
          <div className="text-center space-y-8 px-10">
            <Camera className="w-16 h-16 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 font-serif uppercase tracking-widest text-sm leading-loose max-w-sm mx-auto">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button onClick={() => fileInputRef.current?.click()} className="bg-[#f5f5dc] text-black rounded-none uppercase tracking-[0.4em] text-[10px] font-bold py-6 px-10">
                  {t('tryOn.uploadPhoto')}
               </Button>
               <Button onClick={onClose} variant="outline" className="text-white border-white/20 hover:bg-white/10 rounded-none uppercase tracking-[0.4em] text-[10px] font-bold py-6 px-10">
                  {t('tryOn.close')}
               </Button>
            </div>
          </div>
        ) : (
          <>
            {capturedImage ? (
               <img src={capturedImage} className="w-full h-full object-contain" alt="Captured Feed" />
            ) : (
               <video
                 ref={videoRef}
                 autoPlay
                 playsInline
                 muted
                 className="w-full h-full object-cover grayscale-[20%] opacity-80"
               />
            )}
            
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
                  style={{ mixBlendMode: 'multiply' }}
                />
              </motion.div>
            </motion.div>

            {/* Snap Button (Only in Live mode) */}
            {!capturedImage && !error && (
               <div className="absolute bottom-48 left-1/2 -translate-x-1/2 z-50">
                  <button 
                    onClick={handleSnap}
                    className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center group hover:scale-110 transition-all active:scale-95"
                  >
                     <div className="w-12 h-12 bg-white rounded-full group-hover:bg-[#f5f5dc] transition-colors flex items-center justify-center">
                        <Camera className="w-6 h-6 text-black" />
                     </div>
                  </button>
                  <span className="block text-white text-[9px] uppercase tracking-[0.3em] font-bold mt-4 text-center">{t('tryOn.snap')}</span>
               </div>
            )}

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
      {(!error || capturedImage) && (
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
