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
    <header className="sticky top-0 z-50 bg-white shadow-sm transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-stone-100 text-center py-2 text-sm text-stone-600">
        {t('header.topBanner')}
      </div>

      <div className="container mx-auto flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col gap-4 pt-6">
                <Link to="/" className="text-lg font-semibold text-stone-900">
                  {t('nav.newArrivals')}
                </Link>
                {/* Collections Dropdown for Mobile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start text-lg font-semibold text-stone-900">
                      {t('nav.collections')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link to="/products?category=rings">{t('nav.rings')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/products?category=necklaces">{t('nav.necklaces')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/products?category=earrings">{t('nav.earrings')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/products?category=bracelets">{t('nav.bracelets')}</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link to="/" className="text-lg font-semibold text-stone-900">
                  {t('nav.more')}
                </Link>
                {/* Language Toggle for Mobile */}
                <Button variant="ghost" onClick={toggleLanguage} className="justify-start">
                  {language === 'en' ? 'עברית' : 'English'}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link to="/" className="text-2xl font-serif font-bold uppercase tracking-widest text-stone-900">
          {t('app.Joya')}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link to="/" className="text-stone-900 hover:text-amber-700 transition-colors">
            {t('nav.newArrivals')}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-stone-900 hover:text-amber-700 transition-colors">
                {t('nav.collections')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link to="/products?category=rings">{t('nav.rings')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/products?category=necklaces">{t('nav.necklaces')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/products?category=earrings">{t('nav.earrings')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/products?category=bracelets">{t('nav.bracelets')}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/" className="text-stone-900 hover:text-amber-700 transition-colors">
            {t('nav.more')}
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            {language === 'en' ? 'HE' : 'EN'}
          </Button>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link to="/profile">{t('profile.personalInfo')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/orders">{t('orders.myOrders')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/admin">{t('admin.dashboard')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t('admin.signOut')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute top-2 right-2 inline-flex items-center justify-center h-4 w-4 rounded-full bg-amber-400 text-xs text-white">
              0
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
