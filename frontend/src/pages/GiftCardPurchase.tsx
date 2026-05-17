import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Gift, Share2, MessageCircle, Copy, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createGiftCard } from '../services/api';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

const GiftCardPurchase: React.FC = () => {
  const { t, language } = useLanguage();
  const [amount, setAmount] = useState<number>(250);
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchasedCard, setPurchasedCard] = useState<any>(null);

  const amounts = [100, 250, 500, 1000];

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // In a real app, this would happen AFTER Stripe payment
      const data = await createGiftCard({ amount, recipientEmail: email });
      setPurchasedCard(data);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      toast.success(language === 'he' ? 'כרטיס המתנה נרכש בהצלחה!' : 'Gift card purchased successfully!');
    } catch (error) {
      toast.error('Failed to purchase gift card');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'JOYA Gift Card',
      text: `Hey! I got you a JOYA Gift Card worth ₪${purchasedCard.amount}. Use code: ${purchasedCard.code} at checkout.`,
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share failed');
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareData.text);
      toast.info(language === 'he' ? 'הקוד הועתק ללוח' : 'Code copied to clipboard');
    }
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`Hey! I got you a JOYA Gift Card worth ₪${purchasedCard.amount}. Use code: ${purchasedCard.code} at checkout. Visit: ${window.location.origin}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (purchasedCard) {
    return (
      <div className="min-h-screen pt-40 pb-20 px-6 bg-white flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-zinc-50 p-12 text-center border border-zinc-100 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>
          
          <CheckCircle2 className="w-20 h-20 text-black mx-auto mb-10" />
          
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest mb-6">
            {language === 'he' ? 'המתנה שלך מוכנה' : 'Your Gift is Ready'}
          </h1>
          
          <div className="my-12 p-10 bg-white border-2 border-dashed border-zinc-200">
             <span className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 mb-4 block">Gift Card Code</span>
             <div className="text-4xl md:text-6xl font-mono font-bold tracking-tighter text-black mb-6 uppercase">
               {purchasedCard.code}
             </div>
             <p className="text-2xl font-serif italic text-black">₪{purchasedCard.amount.toLocaleString()}</p>
          </div>

          <p className="text-sm text-zinc-500 uppercase tracking-widest mb-12 max-w-md mx-auto leading-relaxed">
            {language === 'he' 
              ? 'שתף את הקוד הזה עם מישהו מיוחד. הוא יוכל להשתמש בו בכל רכישה באתר.' 
              : 'Share this code with someone special. They can use it for any purchase on our boutique.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <Button 
               onClick={shareToWhatsApp}
               className="bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-none px-10 py-8 flex items-center gap-4 text-[11px] uppercase tracking-widest font-bold"
             >
               <MessageCircle className="w-5 h-5" /> WhatsApp
             </Button>
             <Button 
               onClick={handleShare}
               variant="outline"
               className="border-black text-black rounded-none px-10 py-8 flex items-center gap-4 text-[11px] uppercase tracking-widest font-bold hover:bg-black hover:text-white transition-all"
             >
               <Share2 className="w-5 h-5" /> {language === 'he' ? 'שתף' : 'Share'}
             </Button>
          </div>

          <button 
            onClick={() => setPurchasedCard(null)}
            className="mt-12 text-[10px] uppercase tracking-widest text-zinc-400 underline hover:text-black"
          >
            {language === 'he' ? 'רכוש כרטיס נוסף' : 'Purchase another card'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-20">
          <Gift className="w-12 h-12 text-black mb-8 opacity-20" />
          <h1 className="text-5xl md:text-7xl font-serif uppercase tracking-[0.1em] mb-8">
            {language === 'he' ? 'כרטיס מתנה של JOYA' : 'JOYA Gift Card'}
          </h1>
          <p className="text-zinc-400 uppercase tracking-[0.4em] text-[10px] max-w-xl leading-loose">
            Give the gift of choice. Perfect for any occasion, our digital gift cards are the ultimate expression of luxury and thoughtfulness.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           {/* Card Preview */}
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="aspect-[1.6/1] bg-black text-white p-12 flex flex-col justify-between relative shadow-2xl overflow-hidden group"
           >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-110 duration-1000"></div>
              <div className="flex justify-between items-start relative z-10">
                 <span className="text-3xl font-serif font-bold tracking-[0.4em]">JOYA</span>
                 <Gift className="w-8 h-8 opacity-40" />
              </div>
              <div className="relative z-10">
                 <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-2 block">Value</span>
                 <div className="text-6xl font-serif italic">₪{amount.toLocaleString()}</div>
              </div>
              <div className="flex justify-between items-end relative z-10 border-t border-white/10 pt-8">
                 <span className="text-[9px] uppercase tracking-[0.5em] text-white/30">Luxury Jewelry House</span>
                 <span className="text-[9px] uppercase tracking-[0.2em] font-mono">DIGITAL EDITION</span>
              </div>
           </motion.div>

           {/* Purchase Form */}
           <form onSubmit={handlePurchase} className="space-y-10">
              <div className="space-y-6">
                <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 font-serif">Select Amount</Label>
                <div className="grid grid-cols-2 gap-4">
                   {amounts.map((a) => (
                     <button
                       key={a}
                       type="button"
                       onClick={() => setAmount(a)}
                       className={`py-5 border text-[12px] font-bold uppercase tracking-widest transition-all ${amount === a ? 'bg-black text-white border-black' : 'border-zinc-200 text-zinc-400 hover:border-black hover:text-black'}`}
                     >
                       ₪{a.toLocaleString()}
                     </button>
                   ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 font-serif">Your Email</Label>
                <Input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="For delivery of your receipt"
                  className="rounded-none border-zinc-300 h-14 text-[12px] uppercase tracking-widest"
                />
              </div>

              <Button disabled={isProcessing} type="submit" className="w-full bg-black text-white hover:bg-zinc-800 h-20 text-xl font-serif uppercase tracking-[0.2em] rounded-none transition-all shadow-xl">
                {isProcessing ? 'Processing...' : (language === 'he' ? 'רכוש עכשיו' : 'Purchase Now')}
              </Button>

              <p className="text-center text-[9px] uppercase tracking-[0.2em] text-zinc-300">
                Secure payment powered by Stripe
              </p>
           </form>
        </div>
      </div>
    </div>
  );
};

export default GiftCardPurchase;