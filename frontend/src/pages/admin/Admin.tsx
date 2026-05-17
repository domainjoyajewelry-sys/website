import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import AdminProducts from './components/AdminProducts';
import AdminOrders from './components/AdminOrders';
import AdminBanners from './components/AdminBanners';

const Admin: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="banners" element={<AdminBanners />} />
      <Route path="customers" element={<div className="p-20 text-center font-serif italic text-2xl text-zinc-300 tracking-widest uppercase">Customer database refining...</div>} />
      <Route path="categories" element={<div className="p-20 text-center font-serif italic text-2xl text-zinc-300 tracking-widest uppercase">Categories database refining...</div>} />
      {/* Default redirect to dashboard */}
      <Route path="/" element={<AdminDashboard />} />
    </Routes>
  );
};

export default Admin;