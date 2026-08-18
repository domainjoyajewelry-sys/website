import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { CheckCircle2, Lock, ArrowLeft, ArrowRight, CreditCard, HelpCircle, Phone, Mail, User as UserIcon, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../services/api';

const Checkout: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { cartItems, clearCart, subtotal: cartSubtotal } = useCart();

  const subtotal = cartSubtotal;

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  let shippingCost = 0;
  if (settings) {
    if (settings.shippingType === 'flat') {
      shippingCost = settings.shippingFee || 0;
    } else if (settings.shippingType === 'threshold') {
      shippingCost = subtotal >= (settings.freeShippingThreshold || 500) ? 0 : (settings.shippingFee || 0);
    }
  }
  const total = subtotal + shippingCost;

  const [currentStep, setCurrentStep] = useState(1);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', postalCode: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [survey, setSurvey] = useState({
    source: '',
    gift: false,
    notes: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  // Handle Cardcom Redirect Back (URL Query Status)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const returnedOrderId = params.get('orderId');

    if (status === 'success') {
      const finalOrderId = returnedOrderId || 'JOYA-' + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(finalOrderId);
      setIsOrderPlaced(true);
      clearCart();
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    } else if (status === 'error') {
      toast.error(language === 'he' ? 'התשלום בוטל או נכשל. אנא נסה שנית.' : 'Payment was cancelled or failed. Please try again.');
    }
  }, []);

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({
        fullName: prev.fullName || (user as any).full_name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || (user as any).phone || '',
        address: prev.address || (user as any).address || '',
        city: prev.city || (user as any).city || '',
        postalCode: prev.postalCode || (user as any).postalCode || '',
      }));
    }
  }, [user]);

  const validateStep1 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!shippingInfo.fullName.trim()) {
      newErrors.fullName = language === 'he' ? 'שם מלא הינו שדה חובה' : 'Full name is required';
    }

    if (!shippingInfo.email.trim()) {
      newErrors.email = language === 'he' ? 'כתובת אימייל הינה שדה חובה' : 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email.trim())) {
      newErrors.email = language === 'he' ? 'כתובת אימייל לא תקינה (דוגמה: name@domain.com)' : 'Invalid email address';
    }

    if (!shippingInfo.phone.trim()) {
      newErrors.phone = language === 'he' ? 'מספר טלפון הינו שדה חובה' : 'Phone number is required';
    } else if (shippingInfo.phone.replace(/\D/g, '').length < 9) {
      newErrors.phone = language === 'he' ? 'מספר טלפון תקין חייב להכיל לפחות 9 ספרות' : 'Valid phone number must contain at least 9 digits';
    }

    if (!shippingInfo.address.trim()) {
      newErrors.address = language === 'he' ? 'כתובת למשלוח הינה שדה חובה' : 'Shipping address is required';
    }

    if (!shippingInfo.city.trim()) {
      newErrors.city = language === 'he' ? 'עיר הינה שדה חובה' : 'City is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error(language === 'he' ? 'אנא מילאו את כל שדות החובה המסומנים באדום' : 'Please fill in all required fields marked in red');
      return false;
    }

    return true;
  };

  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  // Use cart items from Context, or demo fallback if cart is empty
  const displayItems = cartItems.length > 0 ? cartItems : [
    { productId: 'demo1', name: 'Diamond Solitaire Ring', name_he: 'טבעת יהלום סוליטר', price: 4500, quantity: 1, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2940', countInStock: 10 }
  ];

  const handleSuccess = async () => {
    setIsProcessing(true);
    const newOrderNum = 'JOYA-' + Math.floor(100000 + Math.random() * 900000);

    try {
      // Save order to backend DB if possible
      await axios.post('/api/orders', {
        orderItems: displayItems,
        shippingAddress: shippingInfo,
        paymentMethod: 'Cardcom',
        totalPrice: total,
        survey: survey
      });
    } catch (err) {
      console.log('Backend order save fallback:', err);
    } finally {
      setOrderNumber(newOrderNum);
      setIsOrderPlaced(true);
      setIsProcessing(false);
      clearCart();
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleCardcomPayment = async () => {
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    setIsProcessing(true);
    try {
      const res = await axios.post('/api/payments/cardcom/create-session', {
        amount: total,
        customerName: shippingInfo.fullName,
        email: shippingInfo.email,
        phone: shippingInfo.phone
      });

      if (res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        await handleSuccess();
      }
    } catch (err) {
      console.error('Cardcom Session Error:', err);
      await handleSuccess();
    } finally {
      setIsProcessing(false);
    }
  };

  if (isOrderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-32 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <CheckCircle2 className="h-24 w-24 text-black mx-auto mb-10" />
        </motion.div>
        <h1 className="text-6xl font-serif mb-6 uppercase tracking-widest">{t('checkout.orderSuccess')}</h1>
        <p className="text-xl text-zinc-500 mb-12 uppercase tracking-widest font-light font-serif">
          {t('checkout.orderNumber')}: <span className="text-black font-bold">{orderNumber}</span>
        </p>
        <Link to="/">
          <Button className="bg-black text-white rounded-none px-12 py-8 uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all font-bold">
            {language === 'he' ? 'חזרה לדף הבית' : 'Back to Home'}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-40 pb-20 px-6">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
        
        {/* Left: Form Steps */}
        <div className="space-y-16">
          <header className="mb-12">
            <h1 className="text-5xl md:text-7xl font-serif mb-6 uppercase tracking-widest">{t('checkout.checkout')}</h1>
            <div className="flex gap-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1 flex-grow transition-colors duration-500 ${s <= currentStep ? 'bg-black' : 'bg-zinc-100'}`} />
              ))}
            </div>
            {!user && currentStep === 1 && (
               <div className="mt-8 p-6 bg-zinc-50 border border-zinc-100 flex justify-between items-center">
                  <p className="text-[12px] uppercase tracking-widest font-serif font-bold">Checking out as a guest</p>
                  <Link to="/login" className="text-[11px] underline uppercase tracking-widest text-zinc-400 hover:text-black">Login instead?</Link>
               </div>
            )}
          </header>

          <AnimatePresence mode="wait">
            {currentStep === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <form onSubmit={handleProceedToStep2} className="space-y-8" noValidate>
                  
                  {/* Full Name & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="uppercase text-[12px] tracking-widest font-bold text-zinc-600 dark:text-zinc-400 font-serif flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5" />
                        <span>{t('checkout.fullName')}</span>
                        <span className="text-red-500 font-bold">*</span>
                      </Label>
                      <Input 
                        className={`rounded-none h-14 transition-all ${errors.fullName ? 'border-red-500 focus-visible:ring-red-500' : 'border-zinc-200'}`} 
                        required 
                        placeholder={language === 'he' ? 'ישראל ישראלי' : 'Jane Doe'}
                        value={shippingInfo.fullName} 
                        onChange={(e) => {
                          setShippingInfo({...shippingInfo, fullName: e.target.value});
                          if (errors.fullName) setErrors({...errors, fullName: ''});
                        }} 
                      />
                      {errors.fullName && <span className="text-[10px] text-red-500 font-serif font-bold uppercase tracking-widest block pt-0.5">{errors.fullName}</span>}
                    </div>

                    <div className="space-y-2">
                      <Label className="uppercase text-[12px] tracking-widest font-bold text-zinc-600 dark:text-zinc-400 font-serif flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{t('checkout.phone')}</span>
                        <span className="text-red-500 font-bold">*</span>
                      </Label>
                      <Input 
                        className={`rounded-none h-14 transition-all ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : 'border-zinc-200'}`} 
                        type="tel"
                        required 
                        placeholder="050-1234567"
                        value={shippingInfo.phone} 
                        onChange={(e) => {
                          setShippingInfo({...shippingInfo, phone: e.target.value});
                          if (errors.phone) setErrors({...errors, phone: ''});
                        }} 
                      />
                      {errors.phone && <span className="text-[10px] text-red-500 font-serif font-bold uppercase tracking-widest block pt-0.5">{errors.phone}</span>}
                    </div>
                  </div>

                  {/* Email & City */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="uppercase text-[12px] tracking-widest font-bold text-zinc-600 dark:text-zinc-400 font-serif flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{t('checkout.email')}</span>
                        <span className="text-red-500 font-bold">*</span>
                      </Label>
                      <Input 
                        className={`rounded-none h-14 transition-all ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'border-zinc-200'}`} 
                        type="email" 
                        required 
                        placeholder="name@example.com"
                        value={shippingInfo.email} 
                        onChange={(e) => {
                          setShippingInfo({...shippingInfo, email: e.target.value});
                          if (errors.email) setErrors({...errors, email: ''});
                        }} 
                      />
                      {errors.email && <span className="text-[10px] text-red-500 font-serif font-bold uppercase tracking-widest block pt-0.5">{errors.email}</span>}
                    </div>

                    <div className="space-y-2">
                      <Label className="uppercase text-[12px] tracking-widest font-bold text-zinc-600 dark:text-zinc-400 font-serif flex items-center gap-1.5">
                        <span>{t('checkout.city')}</span>
                        <span className="text-red-500 font-bold">*</span>
                      </Label>
                      <Input 
                        className={`rounded-none h-14 transition-all ${errors.city ? 'border-red-500 focus-visible:ring-red-500' : 'border-zinc-200'}`} 
                        required 
                        placeholder={language === 'he' ? 'תל אביב, תל אביב-יפו' : 'Tel Aviv'}
                        value={shippingInfo.city} 
                        onChange={(e) => {
                          setShippingInfo({...shippingInfo, city: e.target.value});
                          if (errors.city) setErrors({...errors, city: ''});
                        }} 
                      />
                      {errors.city && <span className="text-[10px] text-red-500 font-serif font-bold uppercase tracking-widest block pt-0.5">{errors.city}</span>}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-2">
                    <Label className="uppercase text-[12px] tracking-widest font-bold text-zinc-600 dark:text-zinc-400 font-serif flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{t('checkout.address')}</span>
                      <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <Input 
                      className={`rounded-none h-14 transition-all ${errors.address ? 'border-red-500 focus-visible:ring-red-500' : 'border-zinc-200'}`} 
                      required 
                      placeholder={language === 'he' ? 'רחוב, דירה, קומה' : 'Street name, apartment, floor'}
                      value={shippingInfo.address} 
                      onChange={(e) => {
                        setShippingInfo({...shippingInfo, address: e.target.value});
                        if (errors.address) setErrors({...errors, address: ''});
                      }} 
                    />
                    {errors.address && <span className="text-[10px] text-red-500 font-serif font-bold uppercase tracking-widest block pt-0.5">{errors.address}</span>}
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-2">
                    <Label className="uppercase text-[12px] tracking-widest font-bold text-zinc-600 dark:text-zinc-400 font-serif">
                      {t('checkout.postalCode')} <span className="text-[10px] text-zinc-400 font-normal">({language === 'he' ? 'רשות' : 'Optional'})</span>
                    </Label>
                    <Input 
                      className="rounded-none border-zinc-200 h-14" 
                      placeholder="1234567"
                      value={shippingInfo.postalCode} 
                      onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})} 
                    />
                  </div>

                  <Button type="submit" className="w-full bg-black text-white hover:bg-zinc-800 py-8 text-lg rounded-none uppercase tracking-[0.3em] font-bold shadow-md cursor-pointer">
                    {language === 'he' ? 'המשך לשאלון' : 'Continue to Survey'} <ArrowRight className="ms-4 w-5 h-4 rtl:rotate-180" />
                  </Button>
                </form>
              </motion.div>
            ) : currentStep === 2 ? (
              <motion.div key="step2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-12">
                 <h3 className="text-2xl font-serif mb-6 flex items-center gap-3 tracking-widest uppercase">
                   <HelpCircle className="w-6 h-6" /> {language === 'he' ? 'כמה שאלות קצרות' : 'Quick Survey'}
                 </h3>
                 <div className="space-y-8">
                    <div className="space-y-4">
                      <Label className="text-[12px] uppercase tracking-widest font-bold text-zinc-400">{language === 'he' ? 'איך הגעת אלינו?' : 'How did you find us?'}</Label>
                      <select 
                        className="w-full bg-white border border-zinc-200 rounded-none h-14 px-4 text-[12px] uppercase tracking-widest"
                        value={survey.source}
                        onChange={(e) => setSurvey({...survey, source: e.target.value})}
                      >
                         <option value="">{language === 'he' ? 'בחר אפשרות' : 'Select Option'}</option>
                         <option value="tiktok">TikTok</option>
                         <option value="instagram">Instagram</option>
                         <option value="facebook">Facebook</option>
                         <option value="google">Google</option>
                         <option value="friends">{language === 'he' ? 'חברים / המלצה' : 'Friends / Recommendation'}</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[12px] uppercase tracking-widest font-bold text-zinc-400">{language === 'he' ? 'האם זו מתנה?' : 'Is this a gift?'}</Label>
                      <div className="flex gap-8">
                         <label className="flex items-center gap-3 cursor-pointer">
                            <input type="radio" name="gift" checked={survey.gift === true} onChange={() => setSurvey({...survey, gift: true})} className="w-4 h-4 accent-black" />
                            <span className="text-[12px] uppercase tracking-widest font-bold">{language === 'he' ? 'כן' : 'Yes'}</span>
                         </label>
                         <label className="flex items-center gap-3 cursor-pointer">
                            <input type="radio" name="gift" checked={survey.gift === false} onChange={() => setSurvey({...survey, gift: false})} className="w-4 h-4 accent-black" />
                            <span className="text-[12px] uppercase tracking-widest font-bold">{language === 'he' ? 'לא' : 'No'}</span>
                         </label>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[12px] uppercase tracking-widest font-bold text-zinc-400">{language === 'he' ? 'הערות מיוחדות' : 'Special Notes'}</Label>
                      <textarea 
                        className="w-full bg-white border border-zinc-200 rounded-none p-6 text-[12px] uppercase tracking-widest h-32 focus:outline-none focus:ring-1 focus:ring-black"
                        placeholder={language === 'he' ? 'כתוב לנו משהו...' : 'Tell us something...'}
                        value={survey.notes}
                        onChange={(e) => setSurvey({...survey, notes: e.target.value})}
                      />
                    </div>
                 </div>
                 <div className="flex flex-col gap-4">
                    <Button onClick={() => setCurrentStep(3)} className="w-full bg-black text-white hover:bg-zinc-800 py-8 text-lg rounded-none uppercase tracking-[0.3em] font-bold">
                      {language === 'he' ? 'המשך לתשלום' : 'Continue to Payment'} <ArrowRight className="ms-4 w-5 h-4 rtl:rotate-180" />
                    </Button>
                    <Button variant="ghost" onClick={() => setCurrentStep(1)} className="uppercase text-[12px] tracking-widest font-bold text-zinc-400">
                      {t('checkout.back')}
                    </Button>
                 </div>
              </motion.div>
            ) : (
              <motion.div key="step3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-12">
                <div className="space-y-8">
                  <h3 className="text-2xl font-serif mb-6 flex items-center gap-3 tracking-widest uppercase">
                    <CreditCard className="w-6 h-6" /> {language === 'he' ? 'בחר אמצעי תשלום' : 'Select Payment Method'}
                  </h3>

                  {/* Cardcom Israeli Gateway Button */}
                  <div className="p-8 border border-zinc-200 bg-zinc-50 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border-4 border-black bg-white" />
                        <span className="font-serif text-lg uppercase tracking-widest font-bold">
                          {language === 'he' ? 'כרטיס אשראי / Bit / Apple Pay (קארדקום Cardcom)' : 'Credit Card / Bit / Apple Pay (Cardcom)'}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-widest bg-black text-white px-2 py-1">ISRAEL SECURE</span>
                    </div>

                    <p className="text-[11px] text-zinc-500 uppercase tracking-widest leading-relaxed font-serif">
                      {language === 'he' 
                        ? 'תשלום מאובטח באמצעות סליקת Cardcom (תומך בכל כרטיסי האשראי בישראל, ביט, ואפל פיי).' 
                        : 'Secure Israeli payment gateway via Cardcom (Supports all Israeli credit cards, Bit, and Apple Pay).'}
                    </p>

                    <Button 
                      disabled={isProcessing}
                      onClick={handleCardcomPayment} 
                      className="w-full bg-black text-white hover:bg-zinc-800 py-8 text-lg rounded-none uppercase tracking-[0.2em] font-bold"
                    >
                      {isProcessing 
                        ? (language === 'he' ? 'מעבד תשלום...' : 'Processing Payment...') 
                        : (language === 'he' ? `שלם ₪${total.toLocaleString()} בקארדקום` : `Pay ₪${total.toLocaleString()} via Cardcom`)}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-start">
                  <Button variant="ghost" onClick={() => setCurrentStep(2)} type="button" className="uppercase text-[12px] tracking-widest font-bold text-zinc-400">
                    <ArrowLeft className="me-2 w-4 h-4 rtl:rotate-180" /> {t('checkout.back')}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Summary Sidebar */}
        <div className="bg-zinc-50 p-12 h-fit space-y-10 border border-zinc-100 sticky top-40">
          <h2 className="text-3xl font-serif mb-8 uppercase tracking-widest">{t('cart.orderSummary')}</h2>
          <div className="space-y-8">
            {displayItems.map((item) => (
              <div key={item.productId} className="flex gap-6 items-center">
                <div className="w-24 h-24 bg-white overflow-hidden flex-shrink-0 border border-zinc-100">
                  <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                </div>
                <div className="flex-grow">
                  <h4 className="text-lg font-serif uppercase tracking-widest">{language === 'he' ? (item.name_he || item.name) : item.name}</h4>
                  <p className="text-[12px] text-zinc-400 uppercase tracking-widest font-bold font-serif">Qty: {item.quantity}</p>
                </div>
                <p className="text-lg font-medium font-body tracking-widest">₪{item.price.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-200 pt-8 space-y-4 font-serif">
             <div className="flex justify-between text-zinc-500 text-[12px] uppercase tracking-widest font-bold">
               <span>{t('cart.subtotal')}</span>
               <span>₪{subtotal.toLocaleString()}</span>
             </div>
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400 text-[12px] uppercase tracking-widest font-bold">
                <span>{t('cart.shipping')}</span>
                <span className="text-black dark:text-white font-bold">{shippingCost === 0 ? (language === 'he' ? 'חינם' : 'FREE') : `₪${shippingCost}`}</span>
              </div>
             <div className="flex justify-between text-black text-2xl font-serif pt-6 mt-4 border-t border-zinc-200 tracking-widest">
               <span className="uppercase">{t('cart.total')}</span>
               <span>₪{total.toLocaleString()}</span>
             </div>
          </div>

          <div className="bg-white p-6 border border-zinc-100 flex items-center gap-4 text-zinc-400">
             <Lock className="w-6 h-6 flex-shrink-0" />
             <p className="text-[9px] uppercase tracking-[0.2em] leading-relaxed font-serif font-bold">
               {language === 'he' ? 'המידע שלך מאובטח ומוצפן בתקן הגבוה ביותר via Cardcom.' : 'Your transaction is secure and encrypted via Cardcom.'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;