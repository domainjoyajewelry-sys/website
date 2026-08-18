import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Menu, ShoppingCart, User, Globe, Sun, Moon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';

const Header: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { cartItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileNav = (path: string) => {
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      navigate(path);
    }, 100);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isHomePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        !isHomePage || isScrolled 
          ? 'bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md py-4 md:py-6 shadow-sm border-b border-zinc-100 dark:border-zinc-800/80 opacity-100 translate-y-0' 
          : 'bg-transparent py-8 md:py-10 opacity-0 -translate-y-full pointer-events-none'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-12 max-w-screen-2xl relative h-10 md:h-12">
        
        <div className="flex-1 flex items-center">
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={`${!isHomePage || isScrolled ? 'text-black dark:text-white' : 'text-white'} hover:bg-transparent`}>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={language === 'he' ? 'right' : 'left'} className="bg-white dark:bg-zinc-950 border-none w-[80vw] sm:w-[400px] flex flex-col p-0 text-black dark:text-white">
                 <div className="flex items-center justify-center h-28 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-2xl font-serif font-bold tracking-[0.4em] text-black dark:text-white">JOYA</span>
                 </div>
                 <nav className="flex flex-col p-10 gap-8">
                    <button onClick={() => handleMobileNav('/products')} className="text-3xl font-serif hover:text-zinc-400 transition-colors uppercase tracking-tight text-left rtl:text-right">{t('nav.collections')}</button>
                    <button onClick={() => handleMobileNav('/products?new=true')} className="text-3xl font-serif hover:text-zinc-400 transition-colors uppercase tracking-tight text-left rtl:text-right">{t('nav.newArrivals')}</button>
                    <button onClick={() => handleMobileNav('/gift-card')} className="text-3xl font-serif hover:text-zinc-400 transition-colors uppercase tracking-tight text-left rtl:text-right">{t('nav.giftCard')}</button>
                    
                    <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-4">
                      <Button variant="outline" onClick={toggleTheme} className="border-zinc-300 dark:border-zinc-700 text-black dark:text-white rounded-none py-6 text-[12px] uppercase tracking-[0.4em] font-bold flex items-center justify-center gap-3">
                        {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                        <span>{isDarkMode ? (language === 'he' ? 'מצב בהיר' : 'Light Mode') : (language === 'he' ? 'מצב כהה' : 'Dark Mode')}</span>
                      </Button>

                      <Button variant="outline" onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }} className="border-black dark:border-white text-black dark:text-white rounded-none py-6 text-[12px] uppercase tracking-[0.4em] font-bold">
                        {language === 'en' ? 'עברית (HE)' : 'English (EN)'}
                      </Button>
                    </div>
                 </nav>
              </SheetContent>
            </Sheet>
          </div>

          <nav className="hidden lg:flex items-center gap-8 xl:gap-12">
            <Link to="/products" className={`text-[11px] xl:text-[13px] uppercase tracking-[0.2em] xl:tracking-[0.4em] font-bold transition-all duration-500 font-serif ${!isHomePage || isScrolled ? 'text-black dark:text-white hover:text-zinc-400' : 'text-white hover:text-white/60'}`}>{t('nav.collections')}</Link>
            <Link to="/products?new=true" className={`text-[11px] xl:text-[13px] uppercase tracking-[0.2em] xl:tracking-[0.4em] font-bold transition-all duration-500 font-serif ${!isHomePage || isScrolled ? 'text-black dark:text-white hover:text-zinc-400' : 'text-white hover:text-white/60'}`}>{t('nav.newArrivals')}</Link>
            <Link to="/gift-card" className={`text-[11px] xl:text-[13px] uppercase tracking-[0.2em] xl:tracking-[0.4em] font-bold transition-all duration-500 font-serif ${!isHomePage || isScrolled ? 'text-black dark:text-white hover:text-zinc-400' : 'text-white hover:text-white/60'}`}>{t('nav.giftCard')}</Link>
          </nav>
        </div>

        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <Link to="/" onClick={handleLogoClick} className="pointer-events-auto block">
             <img src="/logo.png" alt="JOYA" className={`h-12 sm:h-16 md:h-20 lg:h-24 w-auto transition-all duration-700 ${isDarkMode ? 'invert brightness-200' : 'brightness-0'}`} />
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4 xl:gap-6">
           <Button variant="ghost" size="sm" onClick={toggleTheme} className={`flex items-center gap-2 text-[11px] xl:text-[13px] font-bold tracking-[0.2em] transition-all duration-500 font-serif ${!isHomePage || isScrolled ? 'text-black dark:text-white hover:text-zinc-400' : 'text-white hover:text-white/60'}`} title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
             {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
             <span className="hidden xl:inline">{isDarkMode ? (language === 'he' ? 'בהיר' : 'Light') : (language === 'he' ? 'כהה' : 'Dark')}</span>
           </Button>

           <Button variant="ghost" size="sm" onClick={toggleLanguage} className={`hidden sm:flex items-center gap-2 text-[11px] xl:text-[13px] font-bold tracking-[0.2em] transition-all duration-500 font-serif ${!isHomePage || isScrolled ? 'text-black dark:text-white hover:text-zinc-400' : 'text-white hover:text-white/60'}`}>
             <Globe className="h-4 w-4" />
             {language === 'en' ? 'HE' : 'EN'}
           </Button>
           
           <Link to="/cart" className="relative group p-2">
              <ShoppingCart className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-500 ${!isHomePage || isScrolled ? 'text-black dark:text-white group-hover:text-zinc-400' : 'text-white hover:opacity-60'}`} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -end-1 bg-amber-500 text-black text-[9px] font-bold font-mono w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                  {cartItemCount}
                </span>
              )}
           </Link>

           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hover:bg-transparent group p-2 focus:outline-none cursor-pointer">
                  <User className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-500 ${!isHomePage || isScrolled ? 'text-black dark:text-white group-hover:text-zinc-400' : 'text-white group-hover:text-white/60'}`} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-black dark:text-white mt-6 min-w-[200px] sm:min-w-[240px] rounded-none shadow-2xl p-4">
                 {user ? (
                   <>
                     <DropdownMenuItem className="focus:bg-zinc-50 dark:focus:bg-zinc-800 rounded-none py-4 cursor-pointer">
                        <Link to="/profile" className="w-full text-[12px] sm:text-[14px] uppercase tracking-[0.3em] font-bold font-serif">{t('profile.personalInfo')}</Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem className="focus:bg-zinc-50 dark:focus:bg-zinc-800 rounded-none py-4 cursor-pointer">
                        <Link to="/orders" className="w-full text-[12px] sm:text-[14px] uppercase tracking-[0.3em] font-bold font-serif">{t('orders.myOrders')}</Link>
                     </DropdownMenuItem>
                     {user.role?.toLowerCase() === 'admin' && (
                       <DropdownMenuItem className="focus:bg-zinc-50 dark:focus:bg-zinc-800 rounded-none py-4 cursor-pointer border-t border-zinc-100 dark:border-zinc-800">
                          <Link to="/admin" className="w-full text-[12px] sm:text-[14px] uppercase tracking-[0.3em] font-bold font-serif text-zinc-400">Dashboard</Link>
                       </DropdownMenuItem>
                     )}
                     <DropdownMenuItem className="focus:bg-zinc-50 dark:focus:bg-zinc-800 rounded-none py-4 cursor-pointer border-t border-zinc-100 dark:border-zinc-800" onClick={() => { logout(); navigate('/'); }}>
                        <span className="w-full text-[12px] sm:text-[14px] uppercase tracking-[0.3em] font-bold font-serif text-red-500">{t('nav.logout')}</span>
                     </DropdownMenuItem>
                   </>
                 ) : (
                   <DropdownMenuItem className="focus:bg-zinc-50 dark:focus:bg-zinc-800 rounded-none py-4 cursor-pointer">
                      <Link to="/login" className="w-full text-[12px] sm:text-[14px] uppercase tracking-[0.3em] font-bold font-serif">{t('nav.loginRegister')}</Link>
                   </DropdownMenuItem>
                 )}
              </DropdownMenuContent>
           </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
