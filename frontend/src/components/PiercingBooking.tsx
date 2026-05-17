import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { MessageCircle, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const PiercingBooking: React.FC<{ trigger?: React.ReactNode }> = ({ trigger }) => {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', formData);
    setIsSubmitted(true);
    toast.success(t('booking.success'));
    
    // Auto-close dialog after 3 seconds of showing success message
    setTimeout(() => {
       setOpen(false);
       setTimeout(() => {
         setIsSubmitted(false);
         setFormData({ name: '', phone: '', service: '', date: '', time: '' });
       }, 500);
    }, 3000);
  };

  const openWhatsApp = () => {
    const phoneNumber = "972512345678"; // Replace with actual business number
    const message = encodeURIComponent(language === 'he' ? "היי, אשמח לתאם תור לפירסינג" : "Hi, I'd like to book a piercing appointment");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) {
        setTimeout(() => setIsSubmitted(false), 300);
      }
    }}>
      <DialogTrigger asChild>
        {trigger || <Button variant="default" className="bg-black text-white hover:bg-zinc-800">{t('home.bookNow')}</Button>}
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-[450px] max-h-[90vh] overflow-y-auto bg-white border border-zinc-100 shadow-2xl p-0 scrollbar-hide">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div 
              key="booking-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 sm:p-10 space-y-6 sm:space-y-8"
            >
              <DialogHeader>
                <DialogTitle className="text-3xl sm:text-4xl font-serif text-black uppercase tracking-widest font-medium">
                  {t('booking.title')}
                </DialogTitle>
                <DialogDescription className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-zinc-400 font-serif pt-2">
                  {language === 'he' ? 'קבעו תור בסטודיו שלנו' : 'Schedule a visit to our studio'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col gap-4 sm:gap-6">
                <Button 
                  onClick={openWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-3 py-6 sm:py-8 text-[10px] sm:text-[11px] uppercase tracking-widest font-bold rounded-none transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  {language === 'he' ? 'צ׳אט מהיר בוואטסאפ' : 'Quick WhatsApp Chat'}
                </Button>

                <div className="relative py-2 sm:py-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-100"></span>
                  </div>
                  <div className="relative flex justify-center text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-serif font-bold">
                    <span className="bg-white px-3 sm:px-4 text-zinc-300">{language === 'he' ? 'או מלאו פרטים' : 'Or fill in details'}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-zinc-400 font-serif">{t('booking.name')}</Label>
                    <Input
                      id="name"
                      required
                      placeholder={language === 'he' ? 'השם שלך' : 'Your name'}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border-zinc-200 focus-visible:ring-black rounded-none h-10 sm:h-12 text-[12px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-zinc-400 font-serif">{t('booking.phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="050-000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="border-zinc-200 focus-visible:ring-black rounded-none h-10 sm:h-12 text-[12px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service" className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-zinc-400 font-serif">{t('booking.service')}</Label>
                    <Select
                      onValueChange={(value) => setFormData({ ...formData, service: value })}
                      required
                    >
                      <SelectTrigger className="border-zinc-200 rounded-none h-10 sm:h-12 text-[12px] uppercase tracking-widest">
                        <SelectValue placeholder={t('booking.service')} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-zinc-100 rounded-none shadow-xl">
                        <SelectItem value="ear-piercing" className="text-[10px] uppercase tracking-widest py-3">
                          {language === 'he' ? 'פירסינג באוזן' : 'Ear Piercing'}
                        </SelectItem>
                        <SelectItem value="nose-piercing" className="text-[10px] uppercase tracking-widest py-3">
                          {language === 'he' ? 'פירסינג באף' : 'Nose Piercing'}
                        </SelectItem>
                        <SelectItem value="cartilage-piercing" className="text-[10px] uppercase tracking-widest py-3">
                          {language === 'he' ? 'פירסינג סחוס' : 'Cartilage Piercing'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-zinc-400 font-serif">{t('booking.date')}</Label>
                      <Input
                        id="date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="border-zinc-200 focus-visible:ring-black rounded-none h-10 sm:h-12 text-[12px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-zinc-400 font-serif">{t('booking.time')}</Label>
                      <Input
                        id="time"
                        type="time"
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="border-zinc-200 focus-visible:ring-black rounded-none h-10 sm:h-12 text-[12px]"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-black text-white hover:bg-zinc-800 h-14 sm:h-16 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold rounded-none mt-4 transition-all shadow-lg hover:shadow-xl">
                    {t('booking.submit')}
                  </Button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 sm:p-20 text-center flex flex-col items-center gap-6 sm:gap-10"
            >
              <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100">
                <CheckCircle2 className="w-12 h-12 text-black" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-serif uppercase tracking-widest text-black">{language === 'he' ? 'תודה רבה!' : 'Thank You'}</h3>
                <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 leading-relaxed font-serif">
                  {t('booking.success')}
                </p>
              </div>
              <Button onClick={() => setOpen(false)} variant="outline" className="border-black rounded-none px-10 py-6 uppercase tracking-widest text-[10px] font-bold">
                {language === 'he' ? 'סגור' : 'Close'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default PiercingBooking;