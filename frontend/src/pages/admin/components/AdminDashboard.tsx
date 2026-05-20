import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';

const AdminDashboard: React.FC = () => {
  const { t, language } = useLanguage();

  // Placeholder data for stats (would be fetched from API)
  const stats = [
    { title: t('admin.totalRevenue'), value: '₪45,231.89', change: '+20.1%', icon: DollarSign },
    { title: t('admin.totalOrders'), value: '1,250', change: '+180.1%', icon: ShoppingCart },
    { title: t('admin.totalProducts'), value: '235', change: '+19%', icon: Package },
    { title: t('admin.totalCustomers'), value: '750', change: '+20%', icon: Users },
  ];

  // Placeholder data for recent orders
  const recentOrders = [
    { id: '1', customer: 'John Doe', date: '2026-05-15', status: 'pending', total: '₪5,400' },
    { id: '2', customer: 'Jane Smith', date: '2026-05-14', status: 'processing', total: '₪3,200' },
    { id: '3', customer: 'Peter Jones', date: '2026-05-13', status: 'delivered', total: '₪1,800' },
  ];

  return (
    <div className="space-y-16">
      <div className="border-b border-zinc-100 pb-8">
        <h2 className="text-4xl font-serif uppercase tracking-widest text-black font-medium">
          {t('admin.dashboard')}
        </h2>
        <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 mt-4">
          {t('admin.overview')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="rounded-none border-zinc-100 shadow-none bg-zinc-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 font-serif">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-zinc-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-body italic mb-2">{stat.value}</div>
              <p className="text-[10px] uppercase tracking-widest text-green-600 font-bold">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="space-y-8">
        <h3 className="text-xl font-serif uppercase tracking-widest text-black">
          {t('admin.recentOrders')}
        </h3>
        <div className="bg-white border border-zinc-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-50">
              <TableRow className="border-zinc-100">
                <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 px-8">{t('admin.order')}</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6">{t('admin.customer')}</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6">{t('admin.date')}</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-center">{t('admin.status')}</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-bold py-6 text-right px-8">{t('admin.total')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id} className="border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                  <TableCell className="py-6 px-8 font-mono text-[10px] text-zinc-400">#000{order.id}</TableCell>
                  <TableCell className="font-serif text-sm tracking-widest uppercase">{order.customer}</TableCell>
                  <TableCell className="text-[10px] uppercase tracking-widest text-zinc-500">{order.date}</TableCell>
                  <TableCell className="text-center">
                    <span className={`px-3 py-1 text-[9px] uppercase tracking-widest font-bold
                      ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                        order.status === 'processing' ? 'bg-blue-50 text-blue-700' :
                        order.status === 'delivered' ? 'bg-green-50 text-green-700' : 'bg-zinc-50 text-zinc-500'}`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right px-8 font-body text-lg italic">
                    {order.total}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
