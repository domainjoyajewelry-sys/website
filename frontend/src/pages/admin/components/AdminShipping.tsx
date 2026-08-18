import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettings, updateSettings } from '../../../services/api';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Truck, CheckCircle2, ShieldCheck, DollarSign, Info } from 'lucide-react';
import { toast } from 'sonner';

const AdminShipping: React.FC = () => {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();

  const [shippingType, setShippingType] = useState<'free' | 'flat' | 'threshold'>('free');
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(500);
  const [shippingNoticeHe, setShippingNoticeHe] = useState<string>('משלוח מהיר חינם על כל ההזמנות');
  const [shippingNoticeEn, setShippingNoticeEn] = useState<string>('Complimentary Express Shipping on All Orders');

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  useEffect(() => {
    if (settingsData) {
      setShippingType(settingsData.shippingType || 'free');
      setShippingFee(settingsData.shippingFee || 0);
      setFreeShippingThreshold(settingsData.freeShippingThreshold || 500);
      setShippingNoticeHe(settingsData.shippingNotice_he || 'משלוח מהיר חינם על כל ההזמנות');
      setShippingNoticeEn(settingsData.shippingNotice_en || 'Complimentary Express Shipping on All Orders');
    }
  }, [settingsData]);

  const updateMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success(language === 'he' ? 'הגדרות המשלוח עודכנו בהצלחה!' : 'Shipping settings updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || (language === 'he' ? 'שגיאה בעדכון ההגדרות' : 'Failed to update settings'));
    }
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      shippingType,
      shippingFee,
      freeShippingThreshold,
      shippingNotice_he: shippingNoticeHe,
      shippingNotice_en: shippingNoticeEn,
    });
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center font-serif text-zinc-400 animate-pulse text-lg">
        {language === 'he' ? 'טוען הגדרות משלוח...' : 'Loading shipping settings...'}
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-8">
        <div>
          <h2 className="text-2xl sm:text-4xl font-serif uppercase tracking-widest text-black dark:text-white font-medium flex items-center gap-4">
            <Truck className="w-8 h-8 text-amber-500" />
            {language === 'he' ? 'ניהול משלוחים ומחירים' : 'Shipping & Delivery Settings'}
          </h2>
          <p className="text-[11px] uppercase tracking-[0.4em] text-zinc-400 dark:text-zinc-500 mt-3 font-serif">
            {language === 'he' ? 'הגדרת דמי משלוח, משלוח חינם והתנאות רכישה ללקוחות' : 'Configure delivery prices, free shipping thresholds, and banner notices'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-10">
        
        {/* Shipping Mode Selector Cards */}
        <div className="space-y-4">
          <Label className="text-[12px] uppercase tracking-widest font-bold text-zinc-600 dark:text-zinc-400 font-serif block">
            {language === 'he' ? 'בחר מודל משלוחים:' : 'Select Shipping Mode:'}
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mode 1: Always Free */}
            <div 
              onClick={() => setShippingType('free')}
              className={`p-6 border cursor-pointer transition-all duration-300 relative flex flex-col justify-between ${
                shippingType === 'free' 
                  ? 'border-black dark:border-white bg-zinc-50 dark:bg-zinc-900 shadow-md ring-2 ring-black dark:ring-white/50' 
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-widest font-bold font-serif px-3 py-1 bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">
                    {language === 'he' ? '100% חינם' : '100% Free'}
                  </span>
                  {shippingType === 'free' && <CheckCircle2 className="w-5 h-5 text-black dark:text-white" />}
                </div>
                <h3 className="text-lg font-serif font-bold uppercase tracking-wider text-black dark:text-white mb-2">
                  {language === 'he' ? 'משלוח חינם לכולם' : 'Free Shipping for All'}
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-body">
                  {language === 'he' ? 'משלוח חינם לכל ההזמנות ללא מינימום סכום קנייה' : 'Complimentary shipping on all orders regardless of cart total'}
                </p>
              </div>
            </div>

            {/* Mode 2: Flat Rate Fee */}
            <div 
              onClick={() => setShippingType('flat')}
              className={`p-6 border cursor-pointer transition-all duration-300 relative flex flex-col justify-between ${
                shippingType === 'flat' 
                  ? 'border-black dark:border-white bg-zinc-50 dark:bg-zinc-900 shadow-md ring-2 ring-black dark:ring-white/50' 
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-widest font-bold font-serif px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {language === 'he' ? 'מחיר קבוע' : 'Flat Fee'}
                  </span>
                  {shippingType === 'flat' && <CheckCircle2 className="w-5 h-5 text-black dark:text-white" />}
                </div>
                <h3 className="text-lg font-serif font-bold uppercase tracking-wider text-black dark:text-white mb-2">
                  {language === 'he' ? 'דמי משלוח קבועים' : 'Fixed Shipping Fee'}
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-body">
                  {language === 'he' ? 'גביית מחיר משלוח אחיד על כל הזמנה באתר' : 'Charge a fixed standard shipping fee on every purchase'}
                </p>
              </div>
            </div>

            {/* Mode 3: Free Over Threshold */}
            <div 
              onClick={() => setShippingType('threshold')}
              className={`p-6 border cursor-pointer transition-all duration-300 relative flex flex-col justify-between ${
                shippingType === 'threshold' 
                  ? 'border-black dark:border-white bg-zinc-50 dark:bg-zinc-900 shadow-md ring-2 ring-black dark:ring-white/50' 
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-widest font-bold font-serif px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {language === 'he' ? 'מבוסס סכום' : 'Threshold'}
                  </span>
                  {shippingType === 'threshold' && <CheckCircle2 className="w-5 h-5 text-black dark:text-white" />}
                </div>
                <h3 className="text-lg font-serif font-bold uppercase tracking-wider text-black dark:text-white mb-2">
                  {language === 'he' ? 'חינם מעל סכום מוגדר' : 'Free Over Threshold'}
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-body">
                  {language === 'he' ? 'משלוח בתשלום, והופך לחינם אם סכום ההזמנה עולה על הרף' : 'Free shipping for orders over $X, flat fee for smaller orders'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Inputs Based on Selected Mode */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 space-y-8 shadow-sm">
          <h3 className="text-lg font-serif font-bold uppercase tracking-widest text-black dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-4">
            {language === 'he' ? 'פרטי תמחור והודעות' : 'Pricing & Announcement Parameters'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Standard Shipping Fee */}
            {shippingType !== 'free' && (
              <div className="space-y-3">
                <Label className="text-[12px] uppercase tracking-widest font-bold text-zinc-700 dark:text-zinc-300 font-serif">
                  {language === 'he' ? 'מחיר משלוח רגיל (₪):' : 'Standard Shipping Fee (₪):'}
                </Label>
                <div className="relative">
                  <span className="absolute start-4 top-1/2 -translate-y-1/2 text-zinc-400 font-serif font-bold">₪</span>
                  <Input 
                    type="number"
                    min="0"
                    step="1"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(Number(e.target.value))}
                    className="ps-10 rounded-none h-14 border-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 font-serif text-lg"
                    placeholder="35"
                  />
                </div>
              </div>
            )}

            {/* Threshold Amount */}
            {shippingType === 'threshold' && (
              <div className="space-y-3">
                <Label className="text-[12px] uppercase tracking-widest font-bold text-zinc-700 dark:text-zinc-300 font-serif">
                  {language === 'he' ? 'סכום מינימום למשלוח חינם (₪):' : 'Minimum Amount for Free Shipping (₪):'}
                </Label>
                <div className="relative">
                  <span className="absolute start-4 top-1/2 -translate-y-1/2 text-zinc-400 font-serif font-bold">₪</span>
                  <Input 
                    type="number"
                    min="0"
                    step="10"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                    className="ps-10 rounded-none h-14 border-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 font-serif text-lg"
                    placeholder="500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Banner Notice Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="space-y-3">
              <Label className="text-[12px] uppercase tracking-widest font-bold text-zinc-700 dark:text-zinc-300 font-serif">
                {language === 'he' ? 'טקסט באנר עליון (עברית):' : 'Top Banner Notice (Hebrew):'}
              </Label>
              <Input 
                type="text"
                value={shippingNoticeHe}
                onChange={(e) => setShippingNoticeHe(e.target.value)}
                className="rounded-none h-14 border-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 font-serif"
                placeholder="משלוח מהיר חינם על כל ההזמנות"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[12px] uppercase tracking-widest font-bold text-zinc-700 dark:text-zinc-300 font-serif">
                {language === 'he' ? 'טקסט באנר עליון (אנגלית):' : 'Top Banner Notice (English):'}
              </Label>
              <Input 
                type="text"
                value={shippingNoticeEn}
                onChange={(e) => setShippingNoticeEn(e.target.value)}
                className="rounded-none h-14 border-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 font-serif"
                placeholder="Complimentary Express Shipping on All Orders"
              />
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="bg-zinc-900 text-white p-8 space-y-4 border border-zinc-800">
          <div className="flex items-center gap-3 text-amber-400 font-serif text-xs uppercase tracking-widest font-bold">
            <Info className="w-4 h-4" />
            <span>{language === 'he' ? 'תצוגה מקדימה ללקוחות בחנות:' : 'Live Store Preview for Customers:'}</span>
          </div>
          <div className="text-sm font-serif space-y-2">
            <p>
              <strong className="text-zinc-400">{language === 'he' ? 'באנר ראשי:' : 'Header Banner:'}</strong> "{language === 'he' ? shippingNoticeHe : shippingNoticeEn}"
            </p>
            <p>
              <strong className="text-zinc-400">{language === 'he' ? 'תחשיב בקופה:' : 'Checkout Logic:'}</strong>{' '}
              {shippingType === 'free' 
                ? (language === 'he' ? 'משלוח חינם (₪0) על כל סל קניות' : 'Free Shipping (₪0) on all carts')
                : shippingType === 'flat' 
                ? (language === 'he' ? `משלוח קבוע בעלות ₪${shippingFee}` : `Flat rate shipping fee of ₪${shippingFee}`)
                : (language === 'he' ? `₪${shippingFee} משלוח (חינם מעל ₪${freeShippingThreshold})` : `₪${shippingFee} shipping (Free over ₪${freeShippingThreshold})`)}
            </p>
          </div>
        </div>

        {/* Save Button */}
        <Button 
          type="submit" 
          disabled={updateMutation.isPending}
          className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 py-8 text-lg rounded-none uppercase tracking-[0.3em] font-bold shadow-xl cursor-pointer"
        >
          {updateMutation.isPending 
            ? (language === 'he' ? 'שומר הגדרות...' : 'Saving Settings...') 
            : (language === 'he' ? 'שמור הגדרות משלוח' : 'Save Shipping Settings')}
        </Button>
      </form>
    </div>
  );
};

export default AdminShipping;
