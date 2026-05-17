import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Image,
  LogOut,
  Menu,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { Button } from '../components/ui/button';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { t, language } = useLanguage();

  const navItems = [
    {
      name: t('admin.dashboard'),
      icon: LayoutDashboard,
      link: '/admin/dashboard',
    },
    { name: t('admin.products'), icon: Package, link: '/admin/products' },
    {
      name: t('admin.categories'),
      icon: FolderTree,
      link: '/admin/categories',
    },
    { name: t('admin.orders'), icon: ShoppingCart, link: '/admin/orders' },
    { name: t('admin.customers'), icon: Users, link: '/admin/customers' },
    { name: t('admin.banners'), icon: Image, link: '/admin/banners' },
  ];

  return (
    <div className="flex min-h-screen bg-white" dir={language === 'he' ? 'rtl' : 'ltr'}>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden fixed top-4 start-4 z-40 bg-white border-black text-black">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side={language === 'he' ? 'right' : 'left'} className="w-64 bg-black text-white p-0 border-none">
          <div className="flex h-full flex-col justify-between">
            <div className="flex-1">
              <Link to="/admin" className="flex items-center justify-center h-24 border-b border-zinc-800 text-2xl font-serif font-bold uppercase tracking-widest text-white">
                JOYA
              </Link>
              <nav className="flex-1 space-y-2 px-4 py-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.link}
                    className="flex items-center gap-4 rounded-none px-4 py-3 text-zinc-400 transition-all hover:text-white hover:bg-zinc-900 uppercase text-[10px] tracking-widest font-bold"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-zinc-800 space-y-2">
              <Link
                to="/"
                className="flex items-center gap-4 rounded-none px-4 py-3 text-zinc-400 transition-all hover:text-white hover:bg-zinc-900 uppercase text-[10px] tracking-widest font-bold"
              >
                <LogOut className="h-4 w-4" />
                {t('global.backToStore')}
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 start-0 bg-black text-white border-e border-zinc-800">
        <div className="flex h-full flex-col justify-between">
          <div className="flex-1">
            <Link to="/admin" className="flex items-center justify-center h-28 border-b border-zinc-900 text-3xl font-serif font-bold uppercase tracking-[0.4em] text-white">
              JOYA
            </Link>
            <nav className="flex-1 space-y-4 px-6 py-12">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.link}
                  className="flex items-center gap-6 rounded-none px-6 py-5 text-zinc-500 transition-all duration-300 hover:text-white hover:bg-zinc-900 uppercase text-[10px] tracking-[0.3em] font-bold font-serif"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
            </div>
            <div className="p-6 border-t border-zinc-900 pb-12">
            <Link
              to="/"
              className="flex items-center gap-6 rounded-none px-6 py-5 text-zinc-500 transition-all duration-300 hover:text-red-400 hover:bg-zinc-900 uppercase text-[10px] tracking-[0.3em] font-bold font-serif"
            >
              <LogOut className="h-4 w-4" />
              {t('global.backToStore')}
            </Link>
            </div>        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${language === 'he' ? 'lg:mr-64' : 'lg:ml-64'}`}>
        <main className="flex-1 p-8 lg:p-16 bg-white min-h-screen">
          <div className="max-w-screen-xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
