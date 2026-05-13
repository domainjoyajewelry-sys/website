import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="default">{t('home.bookNow')}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-stone-900">
            {t('booking.title')}
          </DialogTitle>
          <DialogDescription className="text-stone-600">
            {t('home.piercingLocation')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('booking.name')}</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-stone-200 focus:ring-amber-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t('booking.phone')}</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border-stone-200 focus:ring-amber-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="service">{t('booking.service')}</Label>
            <Select
              onValueChange={(value) => setFormData({ ...formData, service: value })}
              required
            >
              <SelectTrigger className="border-stone-200">
                <SelectValue placeholder={t('booking.service')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ear-piercing">
                  {language === 'en' ? 'Ear Piercing' : 'פירסינג באוזן'}
                </SelectItem>
                <SelectItem value="nose-piercing">
                  {language === 'en' ? 'Nose Piercing' : 'פירסינג באף'}
                </SelectItem>
                <SelectItem value="cartilage-piercing">
                  {language === 'en' ? 'Cartilage Piercing' : 'פירסינג סחוס'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">{t('booking.date')}</Label>
              <Input
                id="date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="border-stone-200 focus:ring-amber-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">{t('booking.time')}</Label>
              <Input
                id="time"
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="border-stone-200 focus:ring-amber-500"
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-stone-900 hover:bg-stone-800 text-white mt-4">
            {t('booking.submit')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PiercingBooking;
