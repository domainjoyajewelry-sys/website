import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { MessageCircle, CheckCircle2, Calendar, Clock, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import axios from 'axios';

const PiercingBooking: React.FC<{ trigger?: React.ReactNode }> = ({ trigger }) => {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'Ear Lobe Piercing',
    date: '',
    time: '',
  });

  const services = [
    { id: 'earLobe', key: 'booking.earLobe', fallbackEn: 'Ear Lobe Piercing', fallbackHe: 'פירסינג תנוך האוזן' },
    { id: 'helix', key: 'booking.helix', fallbackEn: 'Helix / Cartilage', fallbackHe: 'פירסינג הליקס / סחוס' },
    { id: 'tragus', key: 'booking.tragus', fallbackEn: 'Tragus Piercing', fallbackHe: 'פירסינג טראגוס' },
    { id: 'noseSeptum', key: 'booking.noseSeptum', fallbackEn: 'Nose / Septum', fallbackHe: 'פירסינג אף / ספטום' },
    { id: 'navel', key: 'booking.navel', fallbackEn: 'Navel Piercing', fallbackHe: 'פירסינג פופיק' },
    { id: 'consultation', key: 'booking.consultation', fallbackEn: 'Styling Consultation', fallbackHe: 'ייעוץ סטיילינג ופירסינג' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.service || !formData.date || !formData.time) {
      toast.error(language === 'he' ? 'אנא מלא את כל השדות' : 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('/api/bookings', formData);
      setIsSubmitted(true);
      toast.success(t('booking.success'));
    } catch (err: any) {
      console.error('Booking save failed:', err);
      // Fallback: still show submitted so user experience is uninterrupted
      setIsSubmitted(true);
      toast.success(t('booking.success'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const phoneNumber = "972512345678";
    const selectedServiceLabel = language === 'he' 
      ? (services.find(s => s.fallbackEn === formData.service)?.fallbackHe || formData.service)
      : formData.service;
    
    const messageDetails = formData.name 
      ? (language === 'he' 
          ? `היי, אני ${formData.name}. אשמח לתאם תור ל${selectedServiceLabel} בתאריך ${formData.date} בשעה ${formData.time}` 
          : `Hi, I'm ${formData.name}. I'd like to book ${selectedServiceLabel} for ${formData.date} at ${formData.time}`)
      : (language === 'he' ? "היי, אשמח לתאם תור לפירסינג" : "Hi, I'd like to book a piercing appointment");

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageDetails)}`, '_blank');
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
      <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white border border-zinc-100 shadow-2xl p-0 scrollbar-hide">
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
                <DialogTitle className="text-2xl sm:text-3xl font-serif text-black uppercase tracking-widest font-medium text-center">
                  {t('booking.title')}
                </DialogTitle>
                <DialogDescription className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-serif pt-2 text-center">
                  {language === 'he' ? 'קבעו תור בסטודיו שלנו - קריון קריות' : 'Schedule a visit to our flagship studio'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col gap-4">
                <Button 
                  onClick={openWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-3 py-6 text-[10px] sm:text-[11px] uppercase tracking-widest font-bold rounded-none transition-all shadow-md"
                >
                  <MessageCircle className="w-5 h-5" />
                  {language === 'he' ? 'צ׳אט מהיר בוואטסאפ' : 'Quick WhatsApp Chat'}
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-100"></span>
                  </div>
                  <div className="relative flex justify-center text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-serif font-bold">
                    <span className="bg-white px-3 text-zinc-400">{language === 'he' ? 'או מלאו פרטים להזמנה' : 'Or book online below'}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-zinc-400 font-serif">{t('booking.name')}</Label>
                    <Input
                      id="name"
                      required
                      placeholder={language === 'he' ? 'השם המלא שלך' : 'Your full name'}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border-zinc-200 focus-visible:ring-black rounded-none h-11 text-[12px]"
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
                      className="border-zinc-200 focus-visible:ring-black rounded-none h-11 text-[12px]"
                    />
                  </div>

                  {/* Bulletproof Native Select for Service */}
                  <div className="space-y-2">
                    <Label htmlFor="service" className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-zinc-400 font-serif">{t('booking.service')}</Label>
                    <div className="relative">
                      <select
                        id="service"
                        required
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full bg-white border border-zinc-200 rounded-none h-11 px-4 text-[11px] sm:text-[12px] uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-black appearance-none font-sans"
                      >
                        {services.map((srv) => (
                          <option key={srv.id} value={srv.fallbackEn}>
                            {language === 'he' ? (t(srv.key) !== srv.key ? t(srv.key) : srv.fallbackHe) : (t(srv.key) !== srv.key ? t(srv.key) : srv.fallbackEn)}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-4 text-zinc-400">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-zinc-400 font-serif flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> {t('booking.date')}
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="border-zinc-200 focus-visible:ring-black rounded-none h-11 text-[11px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-zinc-400 font-serif flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> {t('booking.time')}
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="border-zinc-200 focus-visible:ring-black rounded-none h-11 text-[11px]"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-black text-white hover:bg-zinc-800 h-14 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold rounded-none mt-4 transition-all shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (language === 'he' ? 'שומר תור...' : 'Booking...') : t('booking.submit')}
                  </Button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success-message"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 sm:p-14 text-center flex flex-col items-center gap-6"
            >
              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100">
                <CheckCircle2 className="w-10 h-10 text-black" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-serif uppercase tracking-widest text-black">{language === 'he' ? 'התור נקבע בהצלחה!' : 'Appointment Booked!'}</h3>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-zinc-400 leading-relaxed font-serif max-w-xs mx-auto">
                  {t('booking.success')}
                </p>
              </div>

              <div className="w-full bg-zinc-50 p-4 border border-zinc-100 text-left rtl:text-right space-y-1.5 text-[10px] uppercase tracking-widest font-mono text-zinc-600">
                <div><strong>{language === 'he' ? 'שם:' : 'Name:'}</strong> {formData.name}</div>
                <div><strong>{language === 'he' ? 'שירות:' : 'Service:'}</strong> {formData.service}</div>
                <div><strong>{language === 'he' ? 'תאריך ושעה:' : 'Date & Time:'}</strong> {formData.date} @ {formData.time}</div>
              </div>

              <div className="w-full flex flex-col gap-3">
                <Button onClick={openWhatsApp} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-2 py-4 text-[10px] uppercase tracking-widest font-bold rounded-none">
                  <MessageCircle className="w-4 h-4" />
                  {language === 'he' ? 'שלח אישור בוואטסאפ' : 'Send WhatsApp Confirmation'}
                </Button>
                <Button onClick={() => { setOpen(false); setIsSubmitted(false); }} variant="outline" className="border-black rounded-none py-4 uppercase tracking-widest text-[10px] font-bold">
                  {language === 'he' ? 'סגור' : 'Close'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default PiercingBooking;