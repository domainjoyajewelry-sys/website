import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();

  // Placeholder data for stats (would be fetched from API)
  const stats = [
    { title: t('admin.totalRevenue'), value: '₪45,231.89', change: '+20.1% from last month', icon: DollarSign },
    { title: t('admin.totalOrders'), value: '1,250', change: '+180.1% from last month', icon: ShoppingCart },
    { title: t('admin.totalProducts'), value: '235', change: '+19% from last month', icon: Package },
    { title: t('admin.totalCustomers'), value: '750', change: '+20% from last month', icon: Users },
  ];

  // Placeholder data for recent orders
  const recentOrders = [
    { id: '1', customer: 'John Doe', date: '2023-12-15', status: 'pending', total: '₪5400' },
    { id: '2', customer: 'Jane Smith', date: '2023-12-14', status: 'processing', total: '₪3200' },
    { id: '3', customer: 'Peter Jones', date: '2023-12-13', status: 'delivered', total: '₪1800' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-serif text-stone-900">{t('admin.dashboard')}</h2>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.recentOrders')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.order')}</TableHead>
                <TableHead>{t('admin.customer')}</TableHead>
                <TableHead>{t('admin.date')}</TableHead>
                <TableHead>{t('admin.status')}</TableHead>
                <TableHead className="text-right">{t('admin.total')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{order.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pending Actions (Placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.pendingActions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No pending actions for now.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
