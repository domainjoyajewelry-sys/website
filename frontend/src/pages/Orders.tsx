import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { getMyOrders } from '../services/api';

interface OrderItem {
  name_en: string;
  name_he: string;
  image: string;
  price: number;
  qty: number;
}

interface Order {
  _id: string; // Changed from 'id' to '_id' to match MongoDB
  orderNumber: string;
  createdAt: string; // Changed from 'datePlaced' to 'createdAt'
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalPrice: number;
  itemCount: number; // This needs to be calculated or derived
  trackingNumber?: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  orderItems: OrderItem[];
}

const Orders: React.FC = () => {
  const { t, language, getLocalizedField } = useLanguage();

  const { data: orders = [], isLoading: isLoadingOrders, isError: isErrorOrders } = useQuery({
    queryKey: ['myOrders'],
    queryFn: getMyOrders,
  });

  const getStatusBadgeColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoadingOrders) {
    return <div className="min-h-screen flex items-center justify-center font-serif uppercase tracking-widest text-zinc-400">{t('global.loadingOrders')}</div>;
  }

  if (isErrorOrders) {
    return <div>Error loading orders.</div>;
  }

  return (
    <div className="bg-white min-h-screen pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-serif text-black text-center mb-16 uppercase tracking-widest">
          {t('orders.myOrders')}
        </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-stone-700 mb-6">{t('orders.noOrders')}</p>
          <Link to="/products">
            <Button>{t('cart.continueShopping')}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id} className="p-6">
              <div className="flex justify-between items-center mb-4 border-b pb-4">
                <div>
                  <p className="text-sm text-stone-600">{t('orders.orderNumber')}</p>
                  <p className="font-semibold text-xl text-stone-900">{order._id}</p> {/* Using _id as orderNumber for now */}
                </div>
                <div>
                  <p className="text-sm text-stone-600">{t('orders.datePlaced')}</p>
                  <p className="font-semibold text-stone-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-600">{t('orders.total')}</p>
                  <p className="font-semibold text-xl text-amber-700">₪{order.totalPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-600">{t('orders.status')}</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(order.status)}`}>
                    {t(`orders.status.${order.status}`)}
                  </span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">{t('orders.viewDetails')}</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                      <DialogTitle>{t('orders.orderDetails')}</DialogTitle>
                      <DialogDescription>
                        {t('orders.orderNumber')}: {order._id} ({new Date(order.createdAt).toLocaleDateString()})
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="font-semibold">{t('orders.status')}:</p>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(order.status)}`}>
                            {t(`orders.status.${order.status}`)}
                          </span>
                        </div>
                        {order.trackingNumber && (
                          <div>
                            <p className="font-semibold">{t('orders.trackingNumber')}:</p>
                            <p>{order.trackingNumber}</p>
                          </div>
                        )}
                      </div>
                      <div className="mb-4">
                        <p className="font-semibold">{t('orders.shippingAddress')}:</p>
                        <p>{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                        <p>{order.shippingAddress.state}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{t('checkout.orderItems')}:</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t('admin.image')}</TableHead>
                            <TableHead>{t('admin.name')}</TableHead>
                            <TableHead>{t('productDetail.quantity')}</TableHead>
                            <TableHead className="text-right">{t('admin.price')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.orderItems.map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>
                                <img src={item.image} alt={getLocalizedField(item, 'name')} className="w-12 h-12 object-cover rounded-md bg-white" />
                              </TableCell>
                              <TableCell>{getLocalizedField(item, 'name')}</TableCell>
                              <TableCell>{item.qty}</TableCell>
                              <TableCell className="text-right">₪{(item.price * item.qty).toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="flex justify-end mt-4">
                        <div className="text-right">
                          <p className="text-lg font-semibold">{t('cart.total')}: ₪{order.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;