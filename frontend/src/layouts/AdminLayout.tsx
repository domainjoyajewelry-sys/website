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
  const { t } = useLanguage();

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
    <div className="flex min-h-screen bg-stone-50">
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden fixed top-4 left-4 z-40">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-stone-900 text-white">
          <div className="flex h-full flex-col justify-between">
            <div className="flex-1">
              <Link to="/admin" className="flex items-center justify-center h-16 border-b border-stone-800 text-2xl font-serif font-bold uppercase tracking-widest text-white">
                {t('app.Joya')}
              </Link>
              <nav className="flex-1 space-y-2 px-2 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.link}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-stone-300 transition-all hover:text-white hover:bg-stone-800"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-2 border-t border-stone-800">
              <Link
                to="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-stone-300 transition-all hover:text-white hover:bg-stone-800"
              >
                <LogOut className="h-5 w-5" />
                {t('global.backToStore')}
              </Link>
              <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-500 hover:bg-stone-800 mt-2">
                <LogOut className="h-5 w-5 mr-3" />
                {t('admin.signOut')}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 bg-stone-900 text-white">
        <div className="flex h-full flex-col justify-between">
          <div className="flex-1">
            <Link to="/admin" className="flex items-center justify-center h-16 border-b border-stone-800 text-2xl font-serif font-bold uppercase tracking-widest text-white">
              {t('app.Joya')}
            </Link>
            <nav className="flex-1 space-y-2 px-2 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.link}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-stone-300 transition-all hover:text-white hover:bg-stone-800"
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-2 border-t border-stone-800">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-stone-300 transition-all hover:text-white hover:bg-stone-800"
            >
              <LogOut className="h-5 w-5" />
              {t('global.backToStore')}
            </Link>
            <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-500 hover:bg-stone-800 mt-2">
              <LogOut className="h-5 w-5 mr-3" />
              {t('admin.signOut')}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 lg:ml-64">
        {/* Admin Header (if needed, e.g., for user/notifications in admin) */}
        {/* <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6"></header> */}

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
