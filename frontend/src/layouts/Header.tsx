import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
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
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    // Use a tiny timeout to ensure the Sheet component registers the state change before navigation
    setTimeout(() => {
      navigate(path);
    }, 100);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        !isHomePage || isScrolled ? 'bg-white/95 backdrop-blur-md py-4 md:py-6 shadow-sm border-b border-zinc-100' : 'bg-transparent py-8 md:py-10'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-12 max-w-screen-2xl relative h-10 md:h-12">
        
        {/* Left Side: Mobile Menu OR Desktop Nav */}
        <div className="flex-1 flex items-center">
          {/* Mobile Menu Trigger */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={`${!isHomePage || isScrolled ? 'text-black' : 'text-white'} hover:bg-transparent`}>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={language === 'he' ? 'right' : 'left'} className="bg-white border-none w-[80vw] sm:w-[400px] flex flex-col p-0">
                 <div className="flex items-center justify-center h-28 border-b border-zinc-50">
                    <span className="text-2xl font-serif font-bold tracking-[0.4em] text-black">JOYA</span>
                 </div>
                 <nav className="flex flex-col p-10 gap-8">
                    <button 
                      onClick={() => handleMobileNav('/products')}
                      className="text-3xl font-serif hover:text-zinc-400 transition-colors uppercase tracking-tight text-left rtl:text-right"
                    >
                      {t('nav.collections')}
                    </button>
                    <button 
                      onClick={() => handleMobileNav('/products?new=true')}
                      className="text-3xl font-serif hover:text-zinc-400 transition-colors uppercase tracking-tight text-left rtl:text-right"
                    >
                      {t('nav.newArrivals')}
                    </button>
                    <button 
                      onClick={() => handleMobileNav('/products')}
                      className="text-3xl font-serif hover:text-zinc-400 transition-colors uppercase tracking-tight text-left rtl:text-right"
                    >
                      {t('nav.more')}
                    </button>
                    <button 
                      onClick={() => handleMobileNav('/gift-card')}
                      className="text-3xl font-serif hover:text-zinc-400 transition-colors uppercase tracking-tight text-left rtl:text-right"
                    >
                      {t('nav.giftCard')}
                    </button>
                    
                    <div className="pt-10 border-t border-zinc-50 flex flex-col gap-6">
                      <Button variant="outline" onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }} className="border-black text-black rounded-none py-6 text-[12px] sm:text-[14px] uppercase tracking-[0.5em] font-bold">
                        {language === 'en' ? 'עברית' : 'ENGLISH'}
                      </Button>
                      
                      {!user && (
                         <Button onClick={() => handleMobileNav('/login')} className="bg-black text-white rounded-none py-6 text-[12px] sm:text-[14px] uppercase tracking-[0.5em] font-bold">
                           {t('nav.loginRegister')}
                         </Button>
                      )}
                    </div>
                 </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Left Nav (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-10">
            <Link to="/products" className={`text-[11px] xl:text-[13px] uppercase tracking-[0.2em] xl:tracking-[0.4em] font-bold transition-all duration-500 font-serif ${!isHomePage || isScrolled ? 'text-black hover:text-zinc-400' : 'text-white hover:text-white/60'}`}>
              {t('nav.collections')}
            </Link>
            <Link to="/products?new=true" className={`text-[11px] xl:text-[13px] uppercase tracking-[0.2em] xl:tracking-[0.4em] font-bold transition-all duration-500 font-serif ${!isHomePage || isScrolled ? 'text-black hover:text-zinc-400' : 'text-white hover:text-white/60'}`}>
              {t('nav.newArrivals')}
            </Link>
            <Link to="/gift-card" className={`text-[11px] xl:text-[13px] uppercase tracking-[0.2em] xl:tracking-[0.4em] font-bold transition-all duration-500 font-serif ${!isHomePage || isScrolled ? 'text-black hover:text-zinc-400' : 'text-white hover:text-white/60'}`}>
              {t('nav.giftCard')}
            </Link>
          </nav>
        </div>

        {/* Centered Logo */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <Link to="/" className="pointer-events-auto block">
             <motion.span 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className={`text-xl sm:text-2xl md:text-3xl xl:text-5xl font-serif font-bold uppercase tracking-[0.3em] sm:tracking-[0.5em] xl:tracking-[0.8em] transition-all duration-700 block whitespace-nowrap ${!isHomePage || isScrolled ? 'text-black' : 'text-white'}`}
             >
               JOYA
             </motion.span>
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4 xl:gap-8">
           <Button 
             variant="ghost" 
             size="sm" 
             onClick={toggleLanguage}
             className={`hidden sm:flex items-center gap-2 text-[11px] xl:text-[13px] font-bold tracking-[0.2em] xl:tracking-[0.3em] transition-all duration-500 font-serif ${!isHomePage || isScrolled ? 'text-black hover:text-zinc-400' : 'text-white hover:text-white/60'}`}
           >
             <Globe className="h-4 w-4" />
             {language === 'en' ? 'HE' : 'EN'}
           </Button>
           
           <Link to="/cart" className="relative group p-2">
              <ShoppingCart className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-500 ${!isHomePage || isScrolled ? 'text-black group-hover:text-zinc-400' : 'text-white group-hover:text-white/60'}`} />
           </Link>

           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hover:bg-transparent group p-2 focus:outline-none">
                  <User className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-500 ${!isHomePage || isScrolled ? 'text-black group-hover:text-zinc-400' : 'text-white group-hover:text-white/60'}`} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border-zinc-100 mt-6 min-w-[200px] sm:min-w-[240px] rounded-none shadow-2xl p-4">
                 {user ? (
                   <>
                     <DropdownMenuItem className="focus:bg-zinc-50 rounded-none py-4 cursor-pointer">
                        <Link to="/profile" className="w-full text-[12px] sm:text-[14px] uppercase tracking-[0.3em] font-bold font-serif">{t('profile.personalInfo')}</Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem className="focus:bg-zinc-50 rounded-none py-4 cursor-pointer">
                        <Link to="/orders" className="w-full text-[12px] sm:text-[14px] uppercase tracking-[0.3em] font-bold font-serif">{t('orders.myOrders')}</Link>
                     </DropdownMenuItem>
                     {user.role === 'admin' && (
                       <DropdownMenuItem className="focus:bg-zinc-50 rounded-none py-4 cursor-pointer border-t">
                          <Link to="/admin" className="w-full text-[12px] sm:text-[14px] uppercase tracking-[0.3em] font-bold font-serif text-zinc-400">Dashboard</Link>
                       </DropdownMenuItem>
                     )}
                     <DropdownMenuItem className="focus:bg-zinc-50 rounded-none py-4 cursor-pointer border-t" onClick={() => { logout(); navigate('/'); }}>
                        <span className="w-full text-[12px] sm:text-[14px] uppercase tracking-[0.3em] font-bold font-serif text-red-500">{t('nav.logout')}</span>
                     </DropdownMenuItem>
                   </>
                 ) : (
                   <DropdownMenuItem className="focus:bg-zinc-50 rounded-none py-4 cursor-pointer">
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