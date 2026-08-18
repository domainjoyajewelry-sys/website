import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getPrizes, recordSpin } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Gift, X, Trophy, Mail, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const LuckyWheel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { language, t } = useLanguage();
  const { user, login } = useAuth();
  
  const [prizes, setPrizes] = useState<any[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<any>(null);
  const [couponCode, setCouponCode] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Email Registration form state for guest users
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showRegForm, setShowRegForm] = useState(!user);

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

  const handleStartSpin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!user && showRegForm) {
      if (!guestEmail.trim()) {
        setEmailError(language === 'he' ? 'אימייל הינו שדה חובה לקבלת הפרס' : 'Email is required to receive your prize');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail.trim())) {
        setEmailError(language === 'he' ? 'כתובת אימייל לא תקינה' : 'Invalid email address');
        return;
      }
      setEmailError('');
      setShowRegForm(false);
    }

    spinWheel();
  };

  const spinWheel = async () => {
    if (isSpinning || (user && user.hasSpunWheel) || prizes.length === 0) return;

    setIsSpinning(true);
    
    // Choose a random prize
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const selectedPrize = prizes[randomIndex];
    
    const segmentAngle = 360 / prizes.length;
    const extraSpins = 6 + Math.floor(Math.random() * 4); // 6 to 9 full spins
    
    // Calculate final rotation landing on selected prize slice
    const targetRotation = rotation + (extraSpins * 360) + (360 - (randomIndex * segmentAngle)) - (segmentAngle / 2);
    
    setRotation(targetRotation);

    // Wait for wheel spin animation to complete
    setTimeout(async () => {
      setIsSpinning(false);
      setWonPrize(selectedPrize);
      
      const recipientEmail = user ? user.email : guestEmail;

      try {
        const res = await recordSpin(selectedPrize._id, recipientEmail, guestName);
        if (res?.couponCode) {
          setCouponCode(res.couponCode);
        } else {
          setCouponCode(`JOYA-GIFT-${Math.floor(1000 + Math.random() * 9000)}`);
        }

        if (user) {
          login({ ...user, hasSpunWheel: true, wonPrize: selectedPrize.label });
        } else {
          localStorage.setItem('joya_guest_won', selectedPrize.label);
          localStorage.setItem('joya_guest_email', recipientEmail);
        }
      } catch (err: any) {
        console.error('Failed to record spin:', err);
        setCouponCode(`JOYA-GIFT-${Math.floor(1000 + Math.random() * 9000)}`);
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

  const handleCopyCoupon = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      toast.success(language === 'he' ? 'קוד הקופון הועתק!' : 'Coupon code copied!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (user && user.hasSpunWheel && !wonPrize) {
    return (
      <div className="p-12 text-center space-y-8 bg-white dark:bg-zinc-950 max-w-lg mx-auto border border-zinc-100 dark:border-zinc-800 shadow-2xl text-black dark:text-white">
        <Trophy className="w-16 h-16 mx-auto text-amber-400 mb-4" />
        <h2 className="text-3xl font-serif uppercase tracking-widest">{language === 'he' ? 'כבר השתתפת' : 'You Already Spun!'}</h2>
        <p className="text-zinc-500 dark:text-zinc-400 font-serif tracking-widest leading-loose uppercase text-[10px]">
          {language === 'he' ? 'כל משתמש רשאי לסובב את הגלגל פעם אחת בלבד.' : 'Each member is entitled to one spin of the lucky wheel.'}
        </p>
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 italic">
           {language === 'he' ? 'הפרס שלך:' : 'Your Reward:'} <span className="font-bold text-black dark:text-white uppercase ms-2">{user.wonPrize}</span>
        </div>
        <Button onClick={onClose} variant="outline" className="w-full uppercase tracking-widest text-[10px] font-bold py-6">
           {t('admin.cancel')}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 text-center bg-white dark:bg-zinc-950 text-black dark:text-white max-w-2xl mx-auto border border-zinc-100 dark:border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col min-h-[580px] sm:min-h-[660px] justify-between transition-colors duration-300">
      
      <button 
        onClick={onClose} 
        className="absolute top-6 end-6 sm:top-8 sm:end-8 text-zinc-400 hover:text-black dark:hover:text-white transition-colors z-30 p-2 cursor-pointer"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>
      
      <div className="space-y-3 relative z-10 pt-4 sm:pt-6">
        <h2 className="text-2xl sm:text-4xl font-serif uppercase tracking-widest font-bold text-black dark:text-white">
          {language === 'he' ? 'גלגל המזל של ג׳ויה' : 'The JOYA Lucky Wheel'}
        </h2>
        <p className="text-zinc-400 dark:text-zinc-500 font-serif tracking-widest uppercase text-[9px] sm:text-[10px]">
          {language === 'he' ? 'סובבו, הירשמו וגלו את המתנה הייחודית שלכם למייל' : 'Spin, register your email, and claim your exclusive gift code'}
        </p>
      </div>

      {/* Main Wheel Visual */}
      <div className="relative w-[270px] h-[270px] sm:w-[350px] sm:h-[350px] mx-auto my-6 flex items-center justify-center">
        {/* Top Indicator Arrow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 sm:-translate-y-6 z-20 drop-shadow-xl">
          <div className="w-0 h-0 border-l-[12px] sm:border-l-[18px] border-l-transparent border-r-[12px] sm:border-r-[18px] border-r-transparent border-t-[22px] sm:border-t-[32px] border-t-amber-500"></div>
        </div>

        {/* SVG Wheel (Enforced LTR Direction to Prevent Horizontal Character Flip) */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 5, ease: [0.45, 0.05, 0.55, 0.95] }}
          className="w-full h-full relative"
          style={{ transformOrigin: 'center center' }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 overflow-visible" dir="ltr">
            {prizes.map((prize, i) => {
              const angle = 360 / prizes.length;
              const textRotation = angle * i + angle / 2;
              const isUpsideDown = textRotation > 90 && textRotation < 270;
              const displayText = language === 'he' ? (prize.label_he || prize.label) : prize.label;

              return (
                <g key={prize._id || i}>
                  <path
                    d={getSegmentPath(i, prizes.length)}
                    fill={i % 2 === 0 ? '#111111' : '#f5f5dc'}
                    stroke="rgba(212, 175, 55, 0.3)"
                    strokeWidth="0.3"
                  />
                  {/* Clean SVG Slice Text (Un-mirrored & Legible) */}
                  <text
                    x="74"
                    y="50"
                    fill={i % 2 === 0 ? '#ffffff' : '#000000'}
                    fontSize="2.9"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={
                      isUpsideDown
                        ? `rotate(${textRotation}, 50, 50) rotate(180, 74, 50)`
                        : `rotate(${textRotation}, 50, 50)`
                    }
                    direction="ltr"
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      unicodeBidi: 'plaintext',
                    }}
                  >
                    {displayText}
                  </text>
                </g>
              );
            })}
            {/* Center Gold Cap */}
            <circle cx="50" cy="50" r="7" fill="#D4AF37" stroke="#111" strokeWidth="0.8" />
            <circle cx="50" cy="50" r="2.5" fill="#111" />
          </svg>
        </motion.div>
        
        {/* Outer Frame Border */}
        <div className="absolute inset-0 rounded-full border-[10px] border-zinc-900 dark:border-zinc-800 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"></div>
        <div className="absolute -inset-2 rounded-full border border-amber-500/30 pointer-events-none"></div>
      </div>

      {/* Action / Result State Container */}
      <div className="relative z-10 min-h-[140px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {wonPrize ? (
            /* STATE 3: PRIZE WON & COUPON CODE GENERATED */
            <motion.div 
              key="won"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 bg-zinc-50 dark:bg-zinc-900/80 p-6 border border-zinc-200 dark:border-zinc-800"
            >
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-amber-600 dark:text-amber-400 font-serif">
                  {language === 'he' ? '🎉 מזל טוב! זכית בפרס:' : '🎉 Congratulations! You won:'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold uppercase text-black dark:text-white">
                  {language === 'he' ? wonPrize.label_he : wonPrize.label}
                </h3>
              </div>

              {/* Coupon Code Container */}
              {couponCode && (
                <div className="bg-white dark:bg-zinc-950 p-4 border border-zinc-300 dark:border-zinc-700 flex items-center justify-between gap-4 max-w-md mx-auto">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-serif block">{language === 'he' ? 'קוד קופון למימוש:' : 'Claim Coupon Code:'}</span>
                    <span className="text-xl font-mono font-bold text-black dark:text-amber-400 tracking-wider">{couponCode}</span>
                  </div>
                  <Button 
                    onClick={handleCopyCoupon} 
                    variant="outline"
                    className="border-zinc-300 dark:border-zinc-700 text-xs font-serif uppercase tracking-widest flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? (language === 'he' ? 'הועתק' : 'Copied') : (language === 'he' ? 'העתק' : 'Copy')}</span>
                  </Button>
                </div>
              )}

              {/* Email Sent Confirmation Message */}
              <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-serif text-zinc-500 dark:text-zinc-400">
                <Mail className="w-4 h-4 text-amber-500" />
                <span>
                  {language === 'he' 
                    ? `קוד הפרס נשלח בהצלחה לכתובת האימייל: ${user ? user.email : guestEmail}` 
                    : `Prize details and coupon sent to: ${user ? user.email : guestEmail}`}
                </span>
              </div>

              <Button onClick={onClose} className="w-full bg-black dark:bg-white text-white dark:text-black py-6 text-sm rounded-none uppercase tracking-[0.4em] font-bold cursor-pointer">
                {language === 'he' ? 'סגור ואישור' : 'Close & Claim'}
              </Button>
            </motion.div>
          ) : showRegForm && !user ? (
            /* STATE 1: GUEST REGISTRATION FORM BEFORE SPINNING */
            <motion.form 
              key="reg-form"
              onSubmit={handleStartSpin}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 text-start"
            >
              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-widest font-bold text-zinc-600 dark:text-zinc-400 font-serif flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <span>{language === 'he' ? 'הכנס אימייל לקבלת הפרס למייל:' : 'Enter email to receive your prize:'}</span>
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input 
                    type="text" 
                    placeholder={language === 'he' ? 'שם מלא (רשות)' : 'Full Name (Optional)'}
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="rounded-none h-12 border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 font-serif text-xs"
                  />
                  <Input 
                    type="email" 
                    required
                    placeholder={language === 'he' ? 'כתובת אימייל לקבלת הפרס *' : 'Email Address *'}
                    value={guestEmail}
                    onChange={(e) => {
                      setGuestEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    className={`rounded-none h-12 font-serif text-xs dark:bg-zinc-900 ${emailError ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'}`}
                  />
                </div>
                {emailError && <span className="text-[10px] text-red-500 font-serif font-bold uppercase tracking-widest block">{emailError}</span>}
              </div>

              <Button 
                type="submit" 
                disabled={isSpinning}
                className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 py-7 text-sm rounded-none uppercase tracking-[0.4em] font-bold shadow-lg cursor-pointer"
              >
                {language === 'he' ? 'הירשם וסובב את הגלגל 🎲' : 'Register & Spin The Wheel 🎲'}
              </Button>
            </motion.form>
          ) : (
            /* STATE 2: READY TO SPIN (USER LOGGED IN) */
            <motion.div key="ready-spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button 
                onClick={() => spinWheel()} 
                disabled={isSpinning}
                className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 py-7 text-sm rounded-none uppercase tracking-[0.4em] font-bold shadow-xl cursor-pointer"
              >
                {isSpinning 
                  ? (language === 'he' ? 'הגלגל מסתובב...' : 'Spinning Wheel...') 
                  : (language === 'he' ? 'סובבו את הגלגל עכשיו 🎲' : 'Spin The Wheel Now 🎲')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LuckyWheel;
