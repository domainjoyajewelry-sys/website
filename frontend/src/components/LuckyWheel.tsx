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
  const wheelRef = useRef<HTMLDivElement>(null);

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
    const targetRotation = rotation + (extraSpins * 360) + (360 - (randomIndex * segmentAngle)) - (segmentAngle / 2);
    
    setRotation(targetRotation);

    // Wait for animation to finish
    setTimeout(async () => {
      setIsSpinning(false);
      setWonPrize(selectedPrize);
      
      // Only record in DB if user is logged in
      if (user) {
        try {
          await recordSpin(selectedPrize._id);
          login({ ...user, hasSpunWheel: true, wonPrize: selectedPrize.label });
        } catch (err) {
          toast.error('Failed to save your win');
        }
      } else {
        // For guest, save to local storage to prevent immediate re-spin
        localStorage.setItem('joya_guest_won', selectedPrize.label);
      }
    }, 5000);
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
    <div className="p-10 text-center bg-white max-w-2xl mx-auto border border-zinc-100 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px] justify-between">
      <button onClick={onClose} className="absolute top-6 right-6 text-zinc-300 hover:text-black transition-colors z-30"><X className="w-6 h-6" /></button>
      
      <div className="space-y-4 relative z-10">
        <h2 className="text-3xl font-serif uppercase tracking-widest">{language === 'he' ? 'גלגל המזל של ג׳ויה' : 'The JOYA Lucky Wheel'}</h2>
        <p className="text-zinc-400 font-serif tracking-widest uppercase text-[10px]">
          {language === 'he' ? 'סובבו וגלו את המתנה שלכם' : 'Spin to reveal your exclusive boutique gift'}
        </p>
      </div>

      <div className="relative w-[340px] h-[340px] mx-auto my-8">
        {/* The Arrow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
          <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-black"></div>
        </div>

        {/* The Wheel */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 5, ease: [0.45, 0.05, 0.55, 0.95] }}
          className="w-full h-full rounded-full border-[10px] border-zinc-900 relative shadow-2xl overflow-hidden"
          style={{ transformOrigin: 'center' }}
        >
          {prizes.map((prize, i) => {
            const angle = 360 / prizes.length;
            const rotate = angle * i;
            const skew = 90 - angle;
            return (
              <div
                key={prize._id}
                className="absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left"
                style={{
                  transform: `rotate(${rotate}deg) skewY(-${skew}deg)`,
                  backgroundColor: i % 2 === 0 ? '#1a1a1a' : '#f5f5dc',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <div 
                  className="absolute bottom-6 left-6 origin-bottom-left flex items-center justify-center w-[120px]"
                  style={{ transform: `skewY(${skew}deg) rotate(${angle / 2}deg)` }}
                >
                  <span className={`text-[11px] font-bold uppercase tracking-tight whitespace-nowrap ${i % 2 === 0 ? 'text-white' : 'text-black'}`}>
                    {language === 'he' ? prize.label_he : prize.label}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
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
                   <Button onClick={() => window.location.href='/login'} className="w-full bg-black text-white rounded-none py-7 uppercase tracking-[0.4em] font-bold">
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
            <motion.div key="spin">
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
