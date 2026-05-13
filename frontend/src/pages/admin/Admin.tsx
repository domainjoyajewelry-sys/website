import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import AdminDashboard from './components/AdminDashboard'; // Import AdminDashboard

// Placeholder Admin Sub-Components (will be moved to separate files later)
const AdminProducts: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-6">
      <h2 className="text-3xl font-serif text-stone-900 mb-6">{t('admin.products')}</h2>
      <p>Products management content goes here.</p>
    </div>
  );
};

const AdminCategories: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-6">
      <h2 className="text-3xl font-serif text-stone-900 mb-6">{t('admin.categories')}</h2>
      <p>Categories management content goes here.</p>
    </div>
  );
};

const AdminOrders: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-6">
      <h2 className="text-3xl font-serif text-stone-900 mb-6">{t('admin.orders')}</h2>
      <p>Orders management content goes here.</p>
    </div>
  );
};

const AdminCustomers: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-6">
      <h2 className="text-3xl font-serif text-stone-900 mb-6">{t('admin.customers')}</h2>
      <p>Customers management content goes here.</p>
    </div>
  );
};

const AdminBanners: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-6">
      <h2 className="text-3xl font-serif text-stone-900 mb-6">{t('admin.banners')}</h2>
      <p>Banners management content goes here.</p>
    </div>
  );
};


const Admin: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="categories" element={<AdminCategories />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="customers" element={<AdminCustomers />} />
      <Route path="banners" element={<AdminBanners />} />
      {/* Default redirect to dashboard */}
      <Route path="/" element={<AdminDashboard />} />
    </Routes>
  );
};

export default Admin;