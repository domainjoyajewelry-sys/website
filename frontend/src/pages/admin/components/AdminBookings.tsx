import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useLanguage } from '../../../context/LanguageContext';
import { Calendar, Trash2, CheckCircle2, Clock, Phone, MessageCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { toast } from 'sonner';

const fetchBookings = async () => {
  const { data } = await axios.get('/api/bookings');
  return data;
};

const AdminBookings: React.FC = () => {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: fetchBookings,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await axios.put(`/api/bookings/${id}`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success(language === 'he' ? 'סטטוס תור עודכן' : 'Booking status updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/bookings/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success(language === 'he' ? 'התור נמחק' : 'Booking deleted');
    },
  });

  const openWhatsApp = (phone: string, name: string, date: string, time: string, service: string) => {
    const formattedPhone = phone.replace(/\D/g, '');
    const fullNumber = formattedPhone.startsWith('0') ? '972' + formattedPhone.slice(1) : formattedPhone;
    const text = language === 'he' 
      ? `שלום ${name}, מבית JOYA! לגבי תור הפירסינג שלך (${service}) בתאריך ${date} בשעה ${time}:` 
      : `Hello ${name}, from JOYA! Regarding your piercing appointment (${service}) on ${date} at ${time}:`;
    window.open(`https://wa.me/${fullNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-8">
        <div>
          <h2 className="text-2xl sm:text-4xl font-serif uppercase tracking-widest text-black dark:text-white font-medium">
            {language === 'he' ? 'ניהול תורי פירסינג' : 'Piercing Appointments'}
          </h2>
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 dark:text-zinc-500 mt-4">
            {bookings.length} {language === 'he' ? 'תורים רשומים במערכת' : 'scheduled appointments'}
          </p>
        </div>
        <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
           <Calendar className="w-6 h-6 text-zinc-300 dark:text-zinc-600" />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50 dark:bg-zinc-900/80">
            <TableRow className="border-zinc-100 dark:border-zinc-800">
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 px-8 dark:text-zinc-400">{t('admin.customer')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 dark:text-zinc-400">{t('admin.service') || (language === 'he' ? 'שירות' : 'Service')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 dark:text-zinc-400">{t('admin.date')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-center dark:text-zinc-400">{t('admin.status')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-right px-8 dark:text-zinc-400">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 font-serif italic text-xl text-zinc-300 dark:text-zinc-600">{t('admin.synchronizing')}</TableCell></TableRow>
            ) : bookings.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 font-serif italic text-xl text-zinc-300 dark:text-zinc-600 uppercase tracking-widest">{language === 'he' ? 'אין תורים מוזמנים כרגע' : 'No booked appointments yet'}</TableCell></TableRow>
            ) : bookings.map((booking: any) => (
              <TableRow key={booking._id} className="border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                <TableCell className="py-6 px-8">
                   <div className="font-serif text-sm tracking-widest uppercase text-black dark:text-zinc-200 font-medium">{booking.name}</div>
                   <div className="flex items-center gap-2 mt-1">
                     <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">{booking.phone}</span>
                     <button 
                       onClick={() => openWhatsApp(booking.phone, booking.name, booking.date, booking.time, booking.service)}
                       className="text-green-600 hover:text-green-700 transition-colors" 
                       title="WhatsApp"
                     >
                       <MessageCircle className="w-3.5 h-3.5" />
                     </button>
                   </div>
                </TableCell>
                <TableCell className="text-[11px] font-serif uppercase tracking-widest dark:text-zinc-300">
                  {booking.service}
                </TableCell>
                <TableCell className="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-mono">
                  {booking.date} @ {booking.time}
                </TableCell>
                <TableCell className="text-center">
                   <select
                     value={booking.status}
                     onChange={(e) => updateStatusMutation.mutate({ id: booking._id, status: e.target.value })}
                     className={`text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border-none cursor-pointer focus:outline-none ${
                       booking.status === 'Confirmed' ? 'bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-400' :
                       booking.status === 'Completed' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400' :
                       booking.status === 'Cancelled' ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400' :
                       'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-400'
                     }`}
                   >
                     <option value="Pending">{language === 'he' ? 'ממתין' : 'Pending'}</option>
                     <option value="Confirmed">{language === 'he' ? 'מאושר' : 'Confirmed'}</option>
                     <option value="Completed">{language === 'he' ? 'הושלם' : 'Completed'}</option>
                     <option value="Cancelled">{language === 'he' ? 'בוטל' : 'Cancelled'}</option>
                   </select>
                </TableCell>
                <TableCell className="text-right px-8">
                  <div className="flex justify-end gap-6">
                    <button 
                      onClick={() => { if(window.confirm(language === 'he' ? 'האם למחוק תור זה?' : 'Delete this booking?')) deleteMutation.mutate(booking._id) }} 
                      className="text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminBookings;
