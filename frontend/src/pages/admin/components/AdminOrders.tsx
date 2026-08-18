import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { ExternalLink, ShoppingBag } from 'lucide-react';

const AdminOrders: React.FC = () => {
  const { t, language } = useLanguage();

  // Mock data for orders
  const orders = [
    { _id: '6a0809b8', customer: 'Michal Cohen', email: 'michal@example.com', date: '2026-05-15', status: 'Delivered', total: 5800, items: 1 },
    { _id: '6a0809c6', customer: 'Roni Levi', email: 'roni@example.com', date: '2026-05-16', status: 'Processing', total: 450, items: 2 },
    { _id: '6a0809d2', customer: 'Shiraz Avraham', email: 'shiraz@example.com', date: '2026-05-16', status: 'Pending', total: 1200, items: 1 },
  ];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-8">
        <div>
          <h2 className="text-2xl sm:text-4xl font-serif uppercase tracking-widest text-black dark:text-white">
            {t('admin.manageOrders')}
          </h2>
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 dark:text-zinc-500 mt-4">
            {t('admin.viewingRecent')}
          </p>
        </div>
        <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
           <ShoppingBag className="w-6 h-6 text-zinc-300 dark:text-zinc-600" />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50 dark:bg-zinc-900/80">
            <TableRow className="border-zinc-100 dark:border-zinc-800">
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 px-8 dark:text-zinc-400">{t('admin.orderId')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 dark:text-zinc-400">{t('admin.customer')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 dark:text-zinc-400">{t('admin.date')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-center dark:text-zinc-400">{t('admin.items')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-center dark:text-zinc-400">{t('admin.status')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-right px-8 dark:text-zinc-400">{t('admin.total')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id} className="border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer group">
                <TableCell className="py-6 px-8 font-mono text-[10px] tracking-tighter text-zinc-400 dark:text-zinc-500">
                  #{order._id.toUpperCase()}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-serif text-sm tracking-widest uppercase text-black dark:text-zinc-200">{order.customer}</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 lowercase tracking-normal">{order.email}</span>
                  </div>
                </TableCell>
                <TableCell className="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  {new Date(order.date).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}
                </TableCell>
                <TableCell className="text-center text-[10px] font-bold dark:text-zinc-300">
                  {order.items}
                </TableCell>
                <TableCell className="text-center">
                   <span className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                     order.status === 'Delivered' ? 'bg-green-50 text-green-600 dark:bg-green-950/60 dark:text-green-400' :
                     order.status === 'Processing' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                   }`}>
                     {order.status === 'Delivered' ? t('admin.delivered') : order.status === 'Processing' ? t('admin.processing') : t('admin.pending')}
                   </span>
                </TableCell>
                <TableCell className="text-right px-8">
                  <div className="flex items-center justify-end gap-4">
                    <span className="font-body text-lg italic text-black dark:text-white font-bold">₪{order.total.toLocaleString()}</span>
                    <ExternalLink className="w-3 h-3 text-zinc-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
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

export default AdminOrders;