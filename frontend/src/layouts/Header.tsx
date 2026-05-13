import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Menu, Search, ShoppingCart, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';

const Header: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-100 transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-2 text-xs uppercase tracking-[0.2em]">
        {t('header.topBanner')}
      </div>

      <div className="container mx-auto flex items-center justify-between py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-black" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-white">
              <div className="flex flex-col gap-6 pt-10">
                <Link to="/" className="text-xl font-serif italic text-black border-b pb-2">
                  {t('nav.newArrivals')}
                </Link>
                <Link to="/products" className="text-xl font-serif italic text-black border-b pb-2">
                  {t('nav.collections')}
                </Link>
                <Link to="/" className="text-xl font-serif italic text-black border-b pb-2">
                  {t('nav.more')}
                </Link>
                {/* Language Toggle for Mobile */}
                <Button variant="outline" onClick={toggleLanguage} className="justify-center border-black rounded-none">
                  {language === 'en' ? 'עברית' : 'English'}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link to="/" className="text-3xl font-serif font-bold uppercase tracking-[0.3em] text-black">
          JOYA
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-12 rtl:space-x-reverse">
          <Link to="/" className="text-black hover:text-zinc-500 transition-colors uppercase text-xs tracking-widest font-medium">
            {t('nav.newArrivals')}
          </Link>
          <Link to="/products" className="text-black hover:text-zinc-500 transition-colors uppercase text-xs tracking-widest font-medium">
            {t('nav.collections')}
          </Link>
          <Link to="/" className="text-black hover:text-zinc-500 transition-colors uppercase text-xs tracking-widest font-medium">
            {t('nav.more')}
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          <Button variant="ghost" className="text-xs font-bold hover:bg-transparent p-0" onClick={toggleLanguage}>
            {language === 'en' ? 'HE' : 'EN'}
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-transparent">
            <Search className="h-5 w-5 text-black" />
          </Button>
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="hover:bg-transparent relative">
              <ShoppingCart className="h-5 w-5 text-black" />
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-transparent">
                <User className="h-5 w-5 text-black" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-zinc-200">
              <DropdownMenuItem className="hover:bg-zinc-50">
                <Link to="/profile" className="w-full">{t('profile.personalInfo')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-zinc-50">
                <Link to="/orders" className="w-full">{t('orders.myOrders')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-zinc-50">
                <Link to="/admin" className="w-full text-zinc-400">Admin</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
