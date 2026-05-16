import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { MessageCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

const PiercingBooking: React.FC<{ trigger?: React.ReactNode }> = ({ trigger }) => {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
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
    toast.success(t('booking.success'));
    setOpen(false);
    setFormData({ name: '', phone: '', service: '', date: '', time: '' });
  };

  const openWhatsApp = () => {
    const phoneNumber = "972512345678"; // Replace with actual business number
    const message = encodeURIComponent(language === 'he' ? "היי, אשמח לתאם תור לפירסינג" : "Hi, I'd like to book a piercing appointment");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="default" className="bg-black text-white hover:bg-zinc-800">{t('home.bookNow')}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border border-zinc-200 shadow-xl">
        <DialogHeader className="border-b pb-4 mb-4">
          <DialogTitle className="text-3xl font-serif text-black italic">
            {t('booking.title')}
          </DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium">
            {language === 'he' ? 'קבעו תור בסטודיו שלנו' : 'Schedule a visit to our studio'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-6">
          {/* Quick Chat Section */}
          <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100 flex flex-col items-center gap-3">
             <p className="text-sm text-zinc-600 font-medium">
               {language === 'he' ? 'מעדיפים לדבר איתנו ישירות?' : 'Prefer to chat directly?'}
             </p>
             <Button 
               onClick={openWhatsApp}
               className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-2 py-6 text-lg rounded-none transition-transform hover:scale-[1.02]"
             >
               <MessageCircle className="w-6 h-6" />
               {language === 'he' ? 'צ׳אט מהיר בוואטסאפ' : 'Quick WhatsApp Chat'}
             </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-zinc-400">{language === 'he' ? 'או מלאו פרטים' : 'Or fill in details'}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-black font-semibold">{t('booking.name')}</Label>
              <Input
                id="name"
                required
                placeholder={language === 'he' ? 'השם שלך' : 'Your name'}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-zinc-300 focus:border-black rounded-none h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-black font-semibold">{t('booking.phone')}</Label>
              <Input
                id="phone"
                type="tel"
                required
                placeholder="050-000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border-zinc-300 focus:border-black rounded-none h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service" className="text-black font-semibold">{t('booking.service')}</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, service: value })}
                required
              >
                <SelectTrigger className="border-zinc-300 rounded-none h-12">
                  <SelectValue placeholder={t('booking.service')} />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-200">
                  <SelectItem value="ear-piercing">
                    {language === 'he' ? 'פירסינג באוזן' : 'Ear Piercing'}
                  </SelectItem>
                  <SelectItem value="nose-piercing">
                    {language === 'he' ? 'פירסינג באף' : 'Nose Piercing'}
                  </SelectItem>
                  <SelectItem value="cartilage-piercing">
                    {language === 'he' ? 'פירסינג סחוס' : 'Cartilage Piercing'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-black font-semibold">{t('booking.date')}</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="border-zinc-300 focus:border-black rounded-none h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-black font-semibold">{t('booking.time')}</Label>
                <Input
                  id="time"
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="border-zinc-300 focus:border-black rounded-none h-12"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-black text-white hover:bg-zinc-800 h-14 text-lg rounded-none mt-4 transition-all uppercase tracking-widest">
              {t('booking.submit')}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PiercingBooking;
