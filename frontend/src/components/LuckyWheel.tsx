import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getPrizes, recordSpin } from '../services/api';
import { Button } from './ui/button';
import { Gift, X, Trophy } from 'lucide-react';
import { toast } from 'sonner';

const LuckyWheel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { language, t } = useLanguage();
  const { user, login } = useAuth();
  const [prizes, setPrizes] = useState<any[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<any>(null);

  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const data = await getPrizes();
        setPrizes(data);
      } catch (err) {
        console.error('Failed to fetch prizes');
      }
    };
    fetchPrizes();
  }, []);

  const spinWheel = async () => {
    if (isSpinning || (user && user.hasSpunWheel) || prizes.length === 0) return;

    setIsSpinning(true);
    
    // Choose a random prize
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const selectedPrize = prizes[randomIndex];
    
    // Calculate rotation
    const segmentAngle = 360 / prizes.length;
    const extraSpins = 5 + Math.floor(Math.random() * 5); // 5 to 10 full spins
    
    // Target is the middle of the segment
    // Arrow is at the top (270 degrees in SVG coordinate system if 0 is right)
    // We want the winner to land at the arrow
    const targetRotation = rotation + (extraSpins * 360) + (360 - (randomIndex * segmentAngle)) - (segmentAngle / 2);
    
    setRotation(targetRotation);

    // Wait for animation to finish
    setTimeout(async () => {
      setIsSpinning(false);
      setWonPrize(selectedPrize);
      
      if (user) {
        try {
          await recordSpin(selectedPrize._id);
          login({ ...user, hasSpunWheel: true, wonPrize: selectedPrize.label });
        } catch (err) {
          toast.error('Failed to save your win');
        }
      } else {
        localStorage.setItem('joya_guest_won', selectedPrize.label);
      }
    }, 5000);
  };

  const getSegmentPath = (index: number, total: number) => {
    const angle = 360 / total;
    const startAngle = angle * index;
    const endAngle = startAngle + angle;
    
    const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
    const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
    const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
    const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
    
    return `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
  };

  if (user && user.hasSpunWheel && !wonPrize) {
    return (
        <div className="p-12 text-center space-y-8 bg-white max-w-lg mx-auto border border-zinc-100 shadow-2xl">
          <Trophy className="w-16 h-16 mx-auto text-amber-400 mb-4" />
          <h2 className="text-3xl font-serif uppercase tracking-widest">{language === 'he' ? 'כבר השתתפת' : 'You Already Spun!'}</h2>
          <p className="text-zinc-500 font-serif tracking-widest leading-loose uppercase text-[10px]">
            {language === 'he' ? 'כל משתמש רשאי לסובב את הגלגל פעם אחת בלבד.' : 'Each member is entitled to one spin of the lucky wheel.'}
          </p>
          <div className="p-6 bg-zinc-50 border border-zinc-100 italic">
             {language === 'he' ? 'הפרס שלך:' : 'Your Reward:'} <span className="font-bold text-black uppercase ml-2">{user.wonPrize}</span>
          </div>
          <Button onClick={onClose} variant="ghost" className="uppercase tracking-widest text-[10px] font-bold">
             {t('admin.cancel')}
          </Button>
        </div>
      );
  }

  return (
    <div className="p-6 sm:p-10 text-center bg-white max-w-2xl mx-auto border border-zinc-100 shadow-2xl relative overflow-hidden flex flex-col min-h-[550px] sm:min-h-[650px] justify-between">
      <button onClick={onClose} className="absolute top-6 right-6 text-zinc-300 hover:text-black transition-colors z-30"><X className="w-6 h-6" /></button>
      
      <div className="space-y-4 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-widest">{language === 'he' ? 'גלגל המזל של ג׳ויה' : 'The JOYA Lucky Wheel'}</h2>
        <p className="text-zinc-400 font-serif tracking-widest uppercase text-[9px] sm:text-[10px]">
          {language === 'he' ? 'סובבו וגלו את המתנה שלכם' : 'Spin to reveal your exclusive boutique gift'}
        </p>
      </div>

      <div className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] mx-auto my-8 sm:my-12 flex items-center justify-center">
        {/* The Arrow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 sm:-translate-y-6 z-20 drop-shadow-lg">
          <div className="w-0 h-0 border-l-[12px] sm:border-l-[20px] border-l-transparent border-r-[12px] sm:border-r-[20px] border-r-transparent border-t-[20px] sm:border-t-[35px] border-t-black"></div>
        </div>

        {/* The Wheel (SVG) */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 5, ease: [0.45, 0.05, 0.55, 0.95] }}
          className="w-full h-full relative"
          style={{ transformOrigin: 'center center' }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 overflow-visible">
            {prizes.map((prize, i) => {
              const angle = 360 / prizes.length;
              const textRotation = angle * i + angle / 2;
              return (
                <g key={prize._id}>
                  <path
                    d={getSegmentPath(i, prizes.length)}
                    fill={i % 2 === 0 ? '#1a1a1a' : '#f5f5dc'}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="0.2"
                  />
                  <text
                    x="75"
                    y="50"
                    fill={i % 2 === 0 ? '#ffffff' : '#000000'}
                    fontSize="3"
                    fontWeight="bold"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    className="uppercase tracking-tighter"
                    transform={`rotate(${textRotation}, 50, 50)`}
                    style={{ fontFamily: 'Cinzel, serif' }}
                  >
                    {language === 'he' ? prize.label_he : prize.label}
                  </text>
                </g>
              );
            })}
            {/* Inner Gold Circle */}
            <circle cx="50" cy="50" r="6" fill="#D4AF37" stroke="black" strokeWidth="1" />
            <circle cx="50" cy="50" r="2" fill="black" />
          </svg>
        </motion.div>
        
        {/* Outer Frame Decoration */}
        <div className="absolute inset-0 rounded-full border-[12px] border-black pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
        <div className="absolute -inset-2 rounded-full border-[1px] border-zinc-200 pointer-events-none"></div>
      </div>

      <div className="relative z-10 min-h-[140px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {wonPrize ? (
            <motion.div 
              key="won"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-2xl font-serif italic text-black">
                 {language === 'he' ? 'זכית ב:' : 'You won:'} {language === 'he' ? wonPrize.label_he : wonPrize.label}
              </div>
              
              {!user ? (
                <div className="space-y-6">
                   <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                     {language === 'he' ? 'כדי לקבל את המתנה, עליך להירשם או להיכנס לחשבון' : 'To receive your gift, you must register or log in to your account'}
                   </p>
                   <Button onClick={() => window.location.href='/login'} className="w-full bg-[#f5f5dc] text-black border border-zinc-200 rounded-none py-7 uppercase tracking-[0.4em] font-bold hover:bg-[#e8e8c8] transition-all">
                     {language === 'he' ? 'הירשמו עכשיו לקבלת הפרס' : 'Register Now to Claim'}
                   </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400">
                    {language === 'he' ? 'המתנה נוספה לחשבונך ותופיע בהזמנה הבאה' : 'Your gift has been added to your account for your next order'}
                  </p>
                  <Button onClick={onClose} className="w-full bg-black text-white rounded-none py-7 uppercase tracking-[0.4em] font-bold">
                    {language === 'he' ? 'מעולה, תודה!' : 'Wonderful, Thank You'}
                  </Button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="spin" className="space-y-6">
              <Button 
                onClick={spinWheel} 
                disabled={isSpinning}
                className="w-full bg-black text-white rounded-none py-8 uppercase tracking-[0.4em] font-bold hover:bg-[#D4AF37] transition-all"
              >
                {isSpinning ? (language === 'he' ? 'מסתובב...' : 'Spinning...') : (language === 'he' ? 'סובבו עכשיו' : 'Spin Now')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LuckyWheel;
