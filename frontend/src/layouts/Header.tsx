import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Menu, Search, ShoppingCart, User, Globe } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 lg:px-12 max-w-screen-2xl">
        
        {/* Mobile Menu Trigger */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={isScrolled ? 'text-black' : 'text-white'}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white border-none w-full sm:w-[400px] flex flex-col justify-center items-center gap-8">
               <nav className="flex flex-col items-center gap-8">
                  <Link to="/" className="text-4xl font-serif italic hover:text-zinc-500 transition-colors">{t('nav.newArrivals')}</Link>
                  <Link to="/products" className="text-4xl font-serif italic hover:text-zinc-500 transition-colors">{t('nav.collections')}</Link>
                  <Link to="/products" className="text-4xl font-serif italic hover:text-zinc-500 transition-colors">{t('nav.more')}</Link>
                  <Button variant="outline" onClick={toggleLanguage} className="mt-8 border-black text-black rounded-none px-8 py-4">
                    {language === 'en' ? 'עברית' : 'ENGLISH'}
                  </Button>
               </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Left Nav (Desktop) */}
        <nav className="hidden lg:flex items-center gap-10">
          <Link to="/products" className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors ${isScrolled ? 'text-black hover:text-zinc-400' : 'text-white hover:text-white/60'}`}>
            {t('nav.collections')}
          </Link>
          <Link to="/" className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors ${isScrolled ? 'text-black hover:text-zinc-400' : 'text-white hover:text-white/60'}`}>
            {t('nav.newArrivals')}
          </Link>
        </nav>

        {/* Centered Logo */}
        <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
           <motion.span 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             className={`text-3xl md:text-5xl font-serif font-bold uppercase tracking-[0.4em] transition-colors ${isScrolled ? 'text-black' : 'text-white'}`}
           >
             JOYA
           </motion.span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
           <Button 
             variant="ghost" 
             size="sm" 
             onClick={toggleLanguage}
             className={`hidden md:flex items-center gap-2 text-xs font-bold tracking-widest ${isScrolled ? 'text-black' : 'text-white'}`}
           >
             <Globe className="h-4 w-4" />
             {language === 'en' ? 'HE' : 'EN'}
           </Button>
           
           <Link to="/cart" className="relative">
              <ShoppingCart className={`h-5 w-5 transition-colors ${isScrolled ? 'text-black' : 'text-white'}`} />
           </Link>

           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-transparent">
                  <User className={`h-5 w-5 transition-colors ${isScrolled ? 'text-black' : 'text-white'}`} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border-zinc-100 mt-4 min-w-[200px] rounded-none shadow-2xl p-2">
                 <DropdownMenuItem className="focus:bg-zinc-50 rounded-none py-3">
                    <Link to="/profile" className="w-full text-xs uppercase tracking-widest">{t('profile.personalInfo')}</Link>
                 </DropdownMenuItem>
                 <DropdownMenuItem className="focus:bg-zinc-50 rounded-none py-3">
                    <Link to="/orders" className="w-full text-xs uppercase tracking-widest">{t('orders.myOrders')}</Link>
                 </DropdownMenuItem>
                 <DropdownMenuItem className="focus:bg-zinc-50 rounded-none py-3 border-t">
                    <Link to="/admin" className="w-full text-xs uppercase tracking-widest text-zinc-400">Dashboard</Link>
                 </DropdownMenuItem>
              </DropdownMenuContent>
           </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
