import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { CheckCircle2, Lock, ArrowLeft, ArrowRight, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const Checkout: React.FC = () => {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const cartItems = [
    { productId: '1', name: 'Diamond Solitaire Ring', name_he: 'טבעת יהלום סוליטר', price: 4500, quantity: 1, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2940' },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const total = subtotal;

  const handlePlaceOrder = () => {
    setIsOrderPlaced(true);
    setOrderNumber('JOYA-' + Math.floor(100000 + Math.random() * 900000));
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  };

  if (isOrderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-32 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <CheckCircle2 className="h-24 w-24 text-black mx-auto mb-10" />
        </motion.div>
        <h1 className="text-6xl font-serif italic mb-6">{t('checkout.orderSuccess')}</h1>
        <p className="text-xl text-zinc-500 mb-12 uppercase tracking-widest font-light">
          {t('checkout.orderNumber')}: <span className="text-black font-bold">{orderNumber}</span>
        </p>
        <Link to="/">
          <Button className="bg-black text-white rounded-none px-12 py-8 uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all">
            {language === 'he' ? 'חזרה לדף הבית' : 'Back to Home'}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
        
        {/* Left: Form Steps */}
        <div className="space-y-16">
          <header className="mb-12">
            <h1 className="text-5xl md:text-7xl font-serif italic mb-4">{t('checkout.checkout')}</h1>
            <div className="flex gap-4">
              {[1, 2].map((s) => (
                <div key={s} className={`h-1 flex-grow transition-colors duration-500 ${s <= currentStep ? 'bg-black' : 'bg-zinc-100'}`} />
              ))}
            </div>
          </header>

          <AnimatePresence mode="wait">
            {currentStep === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] tracking-widest font-bold text-zinc-400">{t('checkout.fullName')}</Label>
                    <Input className="rounded-none border-zinc-200 focus:border-black h-14" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] tracking-widest font-bold text-zinc-400">{t('checkout.email')}</Label>
                    <Input className="rounded-none border-zinc-200 focus:border-black h-14" type="email" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] tracking-widest font-bold text-zinc-400">{t('checkout.address')}</Label>
                  <Input className="rounded-none border-zinc-200 focus:border-black h-14" required />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] tracking-widest font-bold text-zinc-400">{t('checkout.city')}</Label>
                    <Input className="rounded-none border-zinc-200 focus:border-black h-14" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] tracking-widest font-bold text-zinc-400">{t('checkout.postalCode')}</Label>
                    <Input className="rounded-none border-zinc-200 focus:border-black h-14" required />
                  </div>
                </div>
                <Button onClick={() => setCurrentStep(2)} className="w-full bg-black text-white hover:bg-zinc-800 py-8 text-lg rounded-none uppercase tracking-widest">
                  {t('checkout.continueToPayment')} <ArrowRight className="ml-2 w-5 h-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-12"
              >
                <div className="space-y-8">
                   <h3 className="text-2xl font-serif italic mb-6 flex items-center gap-3">
                     <CreditCard className="w-6 h-6" /> {t('checkout.payment')}
                   </h3>
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="uppercase text-[10px] tracking-widest font-bold text-zinc-400">{t('checkout.cardNumber')}</Label>
                        <Input className="rounded-none border-zinc-200 focus:border-black h-14" placeholder="0000 0000 0000 0000" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="uppercase text-[10px] tracking-widest font-bold text-zinc-400">{t('checkout.expiry')}</Label>
                          <Input className="rounded-none border-zinc-200 focus:border-black h-14" placeholder="MM / YY" />
                        </div>
                        <div className="space-y-2">
                          <Label className="uppercase text-[10px] tracking-widest font-bold text-zinc-400">{t('checkout.cvv')}</Label>
                          <Input className="rounded-none border-zinc-200 focus:border-black h-14" placeholder="***" />
                        </div>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button onClick={handlePlaceOrder} className="w-full bg-black text-white hover:bg-zinc-800 py-8 text-xl rounded-none uppercase tracking-[0.2em]">
                    {t('checkout.placeOrder')}
                  </Button>
                  <Button variant="ghost" onClick={() => setCurrentStep(1)} className="uppercase text-[10px] tracking-widest font-bold text-zinc-400">
                    <ArrowLeft className="mr-2 w-4 h-4" /> {t('checkout.back')}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Summary Sidebar */}
        <div className="bg-zinc-50 p-12 h-fit space-y-10 border border-zinc-100">
          <h2 className="text-3xl font-serif italic mb-8">{t('cart.orderSummary')}</h2>
          <div className="space-y-8">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex gap-6 items-center">
                <div className="w-24 h-24 bg-white overflow-hidden flex-shrink-0">
                  <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                </div>
                <div className="flex-grow">
                  <h4 className="text-lg font-serif italic">{language === 'he' ? item.name_he : item.name}</h4>
                  <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Qty: {item.quantity}</p>
                </div>
                <p className="text-lg font-medium">₪{item.price.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-200 pt-8 space-y-4">
             <div className="flex justify-between text-zinc-500 text-sm uppercase tracking-widest">
               <span>{t('cart.subtotal')}</span>
               <span>₪{subtotal.toLocaleString()}</span>
             </div>
             <div className="flex justify-between text-zinc-500 text-sm uppercase tracking-widest">
               <span>{t('cart.shipping')}</span>
               <span className="text-black font-bold">{language === 'he' ? 'חינם' : 'FREE'}</span>
             </div>
             <div className="flex justify-between text-black text-2xl font-serif italic pt-4 border-t border-zinc-200">
               <span>{t('cart.total')}</span>
               <span>₪{total.toLocaleString()}</span>
             </div>
          </div>

          <div className="bg-white p-6 border border-zinc-100 flex items-center gap-4 text-zinc-400">
             <Lock className="w-4 h-4" />
             <p className="text-[10px] uppercase tracking-widest leading-relaxed">
               {language === 'he' ? 'המידע שלך מאובטח ומוצפן בתקן הגבוה ביותר' : 'Your transaction is secure and encrypted to the highest standard'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
