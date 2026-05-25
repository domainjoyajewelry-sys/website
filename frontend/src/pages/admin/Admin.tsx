import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import AdminDashboard from './components/AdminDashboard';
import AdminProducts from './components/AdminProducts';
import AdminOrders from './components/AdminOrders';
import AdminBanners from './components/AdminBanners';
import AdminCategories from './components/AdminCategories';
import AdminCustomers from './components/AdminCustomers';
import AdminPrizes from './components/AdminPrizes';

const Admin: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="banners" element={<AdminBanners />} />
      <Route path="customers" element={<AdminCustomers />} />
      <Route path="categories" element={<AdminCategories />} />
      <Route path="prizes" element={<AdminPrizes />} />
      {/* Default redirect to dashboard */}
      <Route path="/" element={<AdminDashboard />} />
    </Routes>
  );
};

export default Admin;