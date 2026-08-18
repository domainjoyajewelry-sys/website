import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders } from '../../../services/api';
import api from '../../../services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  ShoppingBag, Search, Filter, Eye, CheckCircle2, Clock, Truck, 
  XCircle, DollarSign, User, Phone, MapPin, Gift, MessageSquare, 
  Printer, ArrowUpRight, ChevronRight
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { toast } from 'sonner';

const AdminOrders: React.FC = () => {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [trackingInput, setTrackingInput] = useState('');

  // Fetch all orders from database
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: getOrders,
    refetchInterval: 5000, // Auto refresh every 5s
  });

  // Update order to delivered mutation
  const markDeliveredMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await api.put(`/orders/${orderId}/deliver`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success(language === 'he' ? 'סטטוס ההזמנה עודכן לנמסר!' : 'Order marked as delivered!');
      if (selectedOrder) {
        setSelectedOrder((prev: any) => ({ ...prev, isDelivered: true }));
      }
    },
    onError: () => {
      toast.error(language === 'he' ? 'שגיאה בעדכון הסטטוס' : 'Failed to update order status');
    }
  });

  // Calculate Order Statistics
  const totalOrdersCount = orders.length;
  const totalRevenueSum = orders.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);
  const pendingOrdersCount = orders.filter((o: any) => !o.isDelivered).length;
  const averageOrderValue = totalOrdersCount > 0 ? totalRevenueSum / totalOrdersCount : 0;

  // Filter & Search Logic
  const filteredOrders = orders.filter((order: any) => {
    const customerName = (order.user?.full_name || order.shippingAddress?.fullName || '').toLowerCase();
    const customerEmail = (order.user?.email || order.shippingAddress?.email || '').toLowerCase();
    const customerPhone = (order.shippingAddress?.phone || '').toLowerCase();
    const orderId = (order._id || '').toLowerCase();
    const query = searchTerm.toLowerCase();

    const matchesSearch = customerName.includes(query) || customerEmail.includes(query) || customerPhone.includes(query) || orderId.includes(query);

    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'delivered') return matchesSearch && order.isDelivered;
    if (statusFilter === 'paid') return matchesSearch && order.isPaid && !order.isDelivered;
    if (statusFilter === 'pending') return matchesSearch && !order.isPaid;
    return matchesSearch;
  });

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-100 dark:border-zinc-800 pb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-serif uppercase tracking-widest text-black dark:text-white">
            {t('admin.manageOrders')}
          </h2>
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 dark:text-zinc-500 mt-2">
            {language === 'he' ? 'ניהול הזמנות בזמן אמת, משלוחים וחשבוניות' : 'Real-time order fulfillment & customer analytics'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-4">
            <span className="text-[10px] uppercase tracking-widest font-bold font-serif">{language === 'he' ? 'סה"כ הזמנות' : 'Total Orders'}</span>
            <ShoppingBag className="w-4 h-4" />
          </div>
          <p className="text-3xl font-serif font-bold text-black dark:text-white">{totalOrdersCount}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-4">
            <span className="text-[10px] uppercase tracking-widest font-bold font-serif">{language === 'he' ? 'הכנסות כוללות' : 'Total Revenue'}</span>
            <DollarSign className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-3xl font-serif font-bold text-black dark:text-white">₪{totalRevenueSum.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-4">
            <span className="text-[10px] uppercase tracking-widest font-bold font-serif">{language === 'he' ? 'ממתינות למשלוח' : 'Pending Delivery'}</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-serif font-bold text-amber-600 dark:text-amber-400">{pendingOrdersCount}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-4">
            <span className="text-[10px] uppercase tracking-widest font-bold font-serif">{language === 'he' ? 'ממוצע להזמנה' : 'Avg. Order Value'}</span>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-serif font-bold text-black dark:text-white">₪{Math.round(averageOrderValue).toLocaleString()}</p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50 dark:bg-zinc-900/60 p-6 border border-zinc-100 dark:border-zinc-800">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'he' ? 'חפש לפי שם, אימייל, טלפון או מס\' הזמנה...' : 'Search by name, email, phone or order ID...'}
            className="ps-11 h-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-sm rounded-none"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {[
            { id: 'all', label: language === 'he' ? 'כל ההזמנות' : 'All Orders' },
            { id: 'paid', label: language === 'he' ? 'שולם / בטיפול' : 'Paid' },
            { id: 'delivered', label: language === 'he' ? 'נמסר' : 'Delivered' },
            { id: 'pending', label: language === 'he' ? 'בהמתנה' : 'Pending' },
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              variant={statusFilter === tab.id ? 'default' : 'outline'}
              className={`rounded-none text-[10px] uppercase tracking-widest font-bold px-5 h-10 ${
                statusFilter === tab.id 
                  ? 'bg-black text-white dark:bg-white dark:text-black' 
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-zinc-50 dark:bg-zinc-900/80">
            <TableRow className="border-zinc-100 dark:border-zinc-800">
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 px-8 dark:text-zinc-400">{t('admin.orderId')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 dark:text-zinc-400">{t('admin.customer')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 dark:text-zinc-400">{language === 'he' ? 'טלפון' : 'Phone'}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 dark:text-zinc-400">{t('admin.date')}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-center dark:text-zinc-400">{language === 'he' ? 'תשלום' : 'Payment'}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-center dark:text-zinc-400">{language === 'he' ? 'משלוח' : 'Delivery'}</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-right px-8 dark:text-zinc-400">{t('admin.total')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-20 font-serif italic text-zinc-400">טוען הזמנות...</TableCell></TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-20 font-serif italic text-zinc-400">לא נמצאו הזמנות תואמות</TableCell></TableRow>
            ) : (
              filteredOrders.map((order: any) => (
                <TableRow 
                  key={order._id} 
                  onClick={() => { setSelectedOrder(order); setTrackingInput(order.trackingNumber || ''); }}
                  className="border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer group"
                >
                  <TableCell className="py-6 px-8 font-mono text-[11px] font-bold text-black dark:text-white uppercase">
                    #{order._id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-serif text-sm tracking-widest uppercase text-black dark:text-zinc-200">
                        {order.shippingAddress?.fullName || order.user?.full_name || 'אורח'}
                      </span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 lowercase tracking-normal">
                        {order.shippingAddress?.email || order.user?.email || 'N/A'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                    {order.shippingAddress?.phone || 'N/A'}
                  </TableCell>
                  <TableCell className="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    {new Date(order.createdAt || order.date || Date.now()).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                      order.isPaid ? 'bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-400' : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-400'
                    }`}>
                      {order.isPaid ? (language === 'he' ? 'שולם' : 'Paid') : (language === 'he' ? 'בהמתנה' : 'Pending')}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                      order.isDelivered ? 'bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-400' : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                    }`}>
                      {order.isDelivered ? (language === 'he' ? 'נמסר' : 'Delivered') : (language === 'he' ? 'בטיפול' : 'Processing')}
                    </span>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <div className="flex items-center justify-end gap-3">
                      <span className="font-body text-lg italic text-black dark:text-white font-bold">₪{(order.totalPrice || order.total || 0).toLocaleString()}</span>
                      <Eye className="w-4 h-4 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Advanced Order Details Modal */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-3xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-black dark:text-white max-h-[90vh] overflow-y-auto p-8 rounded-none">
            <DialogHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-6">
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle className="text-2xl font-serif uppercase tracking-widest">
                    {language === 'he' ? 'פרטי הזמנה' : 'Order Details'} #{selectedOrder._id.slice(-6).toUpperCase()}
                  </DialogTitle>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-1">
                    {new Date(selectedOrder.createdAt || Date.now()).toLocaleString(language === 'he' ? 'he-IL' : 'en-US')}
                  </p>
                </div>

                <Button onClick={handlePrintInvoice} variant="outline" className="rounded-none text-xs flex items-center gap-2 border-zinc-300 dark:border-zinc-700">
                  <Printer className="w-4 h-4" />
                  <span>{language === 'he' ? 'הדפס חשבונית' : 'Print Invoice'}</span>
                </Button>
              </div>
            </DialogHeader>

            <div className="space-y-8 pt-6">
              {/* Customer & Shipping Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-zinc-50 dark:bg-zinc-900 p-6 border border-zinc-100 dark:border-zinc-800">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold font-serif uppercase text-zinc-500">
                    <User className="w-4 h-4 text-amber-500" />
                    <span>{language === 'he' ? 'פרטי לקוח' : 'Customer Details'}</span>
                  </div>
                  <p className="text-sm font-bold font-serif">{selectedOrder.shippingAddress?.fullName || selectedOrder.user?.full_name || 'אורח'}</p>
                  <p className="text-xs font-mono text-zinc-500 flex items-center gap-2"><Phone className="w-3 h-3" /> {selectedOrder.shippingAddress?.phone || 'N/A'}</p>
                  <p className="text-xs font-mono text-zinc-500">{selectedOrder.shippingAddress?.email || selectedOrder.user?.email || 'N/A'}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold font-serif uppercase text-zinc-500">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span>{language === 'he' ? 'כתובת למשלוח' : 'Shipping Address'}</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300">{selectedOrder.shippingAddress?.address || 'N/A'}</p>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300">{selectedOrder.shippingAddress?.city || ''} {selectedOrder.shippingAddress?.postalCode || ''}</p>
                  <p className="text-xs font-mono text-zinc-500">{selectedOrder.shippingAddress?.country || 'Israel'}</p>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="space-y-4">
                <h4 className="font-serif uppercase tracking-widest text-sm font-bold text-zinc-500">
                  {language === 'he' ? 'פריטים בהזמנה' : 'Purchased Items'}
                </h4>
                <div className="border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
                      <TableRow className="border-zinc-100 dark:border-zinc-800 text-[10px] uppercase font-bold text-zinc-400">
                        <TableHead>{language === 'he' ? 'פריט' : 'Item'}</TableHead>
                        <TableHead className="text-center">{language === 'he' ? 'כמות' : 'Qty'}</TableHead>
                        <TableHead className="text-right">{language === 'he' ? 'מחיר יחידה' : 'Price'}</TableHead>
                        <TableHead className="text-right">{language === 'he' ? 'סה"כ' : 'Total'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(selectedOrder.orderItems || []).map((item: any, idx: number) => (
                        <TableRow key={idx} className="border-zinc-50 dark:border-zinc-800/50">
                          <TableCell className="py-4">
                            <div className="flex items-center gap-4">
                              <img src={item.image || '/logo.png'} alt={item.name} className="w-12 h-12 object-cover border border-zinc-200 dark:border-zinc-800" />
                              <span className="font-serif text-sm font-bold">{item.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-mono text-sm">{item.qty || 1}</TableCell>
                          <TableCell className="text-right font-mono text-sm">₪{(item.price || 0).toLocaleString()}</TableCell>
                          <TableCell className="text-right font-mono text-sm font-bold">₪{((item.price || 0) * (item.qty || 1)).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Order Status & Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-50 dark:bg-zinc-900 p-6 border border-zinc-100 dark:border-zinc-800 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">{language === 'he' ? 'סטטוס משלוח נוכחי' : 'Delivery Status'}</p>
                  <p className="text-sm font-serif font-bold mt-1">
                    {selectedOrder.isDelivered ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> {language === 'he' ? 'החבילה נמסרה ללקוח' : 'Package Delivered'}
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-2">
                        <Truck className="w-4 h-4" /> {language === 'he' ? 'בטיפול / מוכן למשלוח' : 'In Fulfillment / Ready for Delivery'}
                      </span>
                    )}
                  </p>
                </div>

                {!selectedOrder.isDelivered && (
                  <Button 
                    onClick={() => markDeliveredMutation.mutate(selectedOrder._id)}
                    disabled={markDeliveredMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-none px-6 py-6 text-xs uppercase tracking-widest font-bold"
                  >
                    {markDeliveredMutation.isPending ? 'מעדכן...' : (language === 'he' ? 'סמן כ"נמסר ללקוח"' : 'Mark as Delivered')}
                  </Button>
                )}
              </div>

              {/* Total Calculation Summary */}
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 text-right space-y-2">
                <p className="text-xs text-zinc-500 font-serif">{language === 'he' ? 'שיטת תשלום:' : 'Payment Method:'} <span className="font-bold text-black dark:text-white">Cardcom SSL Secure</span></p>
                <p className="text-2xl font-serif font-bold italic text-black dark:text-white">
                  {language === 'he' ? 'סה"כ שולם:' : 'Total Paid:'} ₪{(selectedOrder.totalPrice || selectedOrder.total || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminOrders;