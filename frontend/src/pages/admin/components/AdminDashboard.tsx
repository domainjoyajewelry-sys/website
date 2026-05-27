import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Package, ShoppingCart, Users, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getSalesData, getOrders } from '../../../services/api';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const { t, language } = useLanguage();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    refetchInterval: 5000, // Refresh every 5 seconds for "real-time" feel
  });

  const { data: salesData = [], isLoading: salesLoading } = useQuery({
    queryKey: ['sales-data'],
    queryFn: getSalesData,
  });

  const { data: allOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: getOrders,
  });

  const recentOrders = allOrders.slice(0, 5);

  const displayStats = [
    { 
      title: t('admin.totalRevenue'), 
      value: stats ? `₪${stats.revenue.toLocaleString()}` : '₪0', 
      icon: DollarSign,
      color: 'text-zinc-900'
    },
    { 
      title: t('admin.totalOrders'), 
      value: stats ? stats.orders : '0', 
      icon: ShoppingCart,
      color: 'text-zinc-900'
    },
    { 
      title: 'Online Visitors', 
      value: stats ? stats.onlineVisitors : '0', 
      icon: Activity,
      color: 'text-green-600'
    },
    { 
      title: t('admin.totalCustomers'), 
      value: stats ? stats.users : '0', 
      icon: Users,
      color: 'text-zinc-900'
    },
  ];

  return (
    <div className="space-y-16">
      <div className="border-b border-zinc-100 pb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl sm:text-4xl font-serif uppercase tracking-widest text-black font-medium">
            {t('admin.dashboard')}
          </h2>
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 mt-4">
            {t('admin.overview')}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-50 px-4 py-2 border border-zinc-100">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-500">Live System Status</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {displayStats.map((stat, index) => (
          <Card key={index} className="rounded-none border-zinc-100 shadow-none bg-zinc-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 font-serif">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color} opacity-20`} />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-body italic mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="flex items-center gap-2">
                 <TrendingUp className="w-3 h-3 text-green-600" />
                 <span className="text-[9px] uppercase tracking-widest text-green-600 font-bold">Updated Live</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Card className="rounded-none border-zinc-100 shadow-none p-8">
           <h3 className="text-sm font-serif uppercase tracking-widest mb-10 border-b border-zinc-50 pb-4">Revenue Performance (Last 30 Days)</h3>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    hide 
                  />
                  <YAxis 
                    hide 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '0px', border: '1px solid #f0f0f0', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#000" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </Card>

        <Card className="rounded-none border-zinc-100 shadow-none p-8">
           <h3 className="text-sm font-serif uppercase tracking-widest mb-10 border-b border-zinc-50 pb-4">Order Volume Trends</h3>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '0px', border: '1px solid #f0f0f0', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  />
                  <Bar dataKey="total" fill="#f5f5dc" />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <div className="space-y-8">
        <h3 className="text-xl font-serif uppercase tracking-widest text-black">
          {t('admin.recentOrders')}
        </h3>
        <div className="bg-white border border-zinc-100 overflow-hidden shadow-sm">
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
              {recentOrders.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-20 font-serif italic text-xl text-zinc-300">No orders found yet.</TableCell></TableRow>
              ) : recentOrders.map((order: any) => (
                <TableRow key={order._id} className="border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                  <TableCell className="py-6 px-8 font-mono text-[10px] text-zinc-400 uppercase">#{order._id.slice(-6)}</TableCell>
                  <TableCell className="font-serif text-sm tracking-widest uppercase">{order.user?.full_name || 'Guest'}</TableCell>
                  <TableCell className="text-[10px] uppercase tracking-widest text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-center">
                    <span className={`px-3 py-1 text-[8px] uppercase tracking-widest font-bold rounded-full
                      ${order.isDelivered ? 'bg-green-50 text-green-700' :
                        order.isPaid ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'}`}>
                      {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right px-8 font-body text-lg italic text-black">
                    ₪{order.totalPrice.toLocaleString()}
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
