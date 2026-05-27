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
      <div className="flex justify-between items-center border-b border-zinc-100 pb-8">
        <div>
          <h2 className="text-2xl sm:text-4xl font-serif uppercase tracking-widest text-black">
            {t('admin.manageOrders')}
          </h2>
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 mt-4">
            {t('admin.viewingRecent').replace('recent transactions', `${orders.length} ${t('admin.viewingRecent').includes('transactions') ? 'transactions' : ''}`)}
          </p>
        </div>
        <div className="w-16 h-16 bg-zinc-50 flex items-center justify-center border border-zinc-100">
           <ShoppingBag className="w-6 h-6 text-zinc-300" />
        </div>
      </div>

      <div className="bg-white border border-zinc-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow className="border-zinc-100">
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 px-8">{t('admin.orderId')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6">{t('admin.customer')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6">{t('admin.date')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-center">{t('admin.items')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-center">{t('admin.status')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-right px-8">{t('admin.total')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id} className="border-zinc-50 hover:bg-zinc-50/50 transition-colors cursor-pointer group">
                <TableCell className="py-6 px-8 font-mono text-[10px] tracking-tighter text-zinc-400">
                  #{order._id.toUpperCase()}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-serif text-sm tracking-widest uppercase text-black">{order.customer}</span>
                    <span className="text-[10px] text-zinc-400 lowercase tracking-normal">{order.email}</span>
                  </div>
                </TableCell>
                <TableCell className="text-[10px] uppercase tracking-widest text-zinc-500">
                  {new Date(order.date).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}
                </TableCell>
                <TableCell className="text-center text-[10px] font-bold">
                  {order.items}
                </TableCell>
                <TableCell className="text-center">
                   <span className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                     order.status === 'Delivered' ? 'bg-green-50 text-green-600' :
                     order.status === 'Processing' ? 'bg-blue-50 text-blue-600' : 'bg-zinc-100 text-zinc-500'
                   }`}>
                     {order.status}
                   </span>
                </TableCell>
                <TableCell className="text-right px-8">
                  <div className="flex items-center justify-end gap-4">
                    <span className="font-body text-lg italic text-black font-bold">₪{order.total.toLocaleString()}</span>
                    <ExternalLink className="w-3 h-3 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
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