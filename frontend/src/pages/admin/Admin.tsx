import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import AdminDashboard from './components/AdminDashboard';
import AdminProducts from './components/AdminProducts';
import AdminOrders from './components/AdminOrders';
import { LayoutDashboard, ShoppingBag, Package, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Admin: React.FC = () => {
  const { t, language } = useLanguage();
  const { logout } = useAuth();
  const location = useLocation();

  const sidebarLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { path: '/admin/customers', label: 'Customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-white flex pt-24">
      {/* Admin Sidebar */}
      <aside className="w-80 border-r border-zinc-100 flex flex-col fixed h-[calc(100vh-6rem)] left-0">
        <div className="p-12 border-b border-zinc-100">
          <h1 className="text-sm font-serif uppercase tracking-[0.4em] font-bold">Admin Panel</h1>
        </div>
        
        <nav className="flex-grow p-8 space-y-4">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path === '/admin/dashboard' && location.pathname === '/admin');
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center gap-6 px-6 py-5 transition-all duration-300 group ${
                  isActive ? 'bg-black text-white' : 'text-zinc-400 hover:text-black hover:bg-zinc-50'
                }`}
              >
                <link.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-300 group-hover:text-black'}`} />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold font-serif">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-zinc-100">
           <button 
             onClick={logout}
             className="w-full flex items-center gap-6 px-6 py-5 text-zinc-400 hover:text-red-500 transition-colors group"
           >
             <LogOut className="w-4 h-4 text-zinc-300 group-hover:text-red-500" />
             <span className="text-[10px] uppercase tracking-[0.3em] font-bold font-serif">Sign Out</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow ml-80 p-20 bg-white min-h-screen overflow-y-auto">
        <Routes>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<div className="p-20 text-center font-serif italic text-2xl text-zinc-300 tracking-widest">Customer database refining...</div>} />
          <Route path="/" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
};

export default Admin;