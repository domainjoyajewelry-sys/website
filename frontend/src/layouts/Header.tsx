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

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        !isHomePage || isScrolled ? 'bg-white/90 backdrop-blur-md py-6 shadow-sm border-b border-zinc-100' : 'bg-transparent py-10'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 lg:px-12 max-w-screen-2xl">
        
        {/* Mobile Menu Trigger */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={!isHomePage || isScrolled ? 'text-black' : 'text-white'}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white border-none w-full sm:w-[500px] flex flex-col justify-center items-center gap-12">
               <nav className="flex flex-col items-center gap-10">
                  <Link to="/products" className="text-5xl font-serif hover:text-zinc-400 transition-colors uppercase tracking-tight">{t('nav.collections')}</Link>
                  <Link to="/products?new=true" className="text-5xl font-serif hover:text-zinc-400 transition-colors uppercase tracking-tight">{t('nav.newArrivals')}</Link>
                  <Link to="/products" className="text-5xl font-serif hover:text-zinc-400 transition-colors uppercase tracking-tight">{t('nav.more')}</Link>
                  <Button variant="outline" onClick={toggleLanguage} className="mt-12 border-black text-black rounded-none px-12 py-6 text-[10px] uppercase tracking-[0.5em] font-bold">
                    {language === 'en' ? 'עברית' : 'ENGLISH'}
                  </Button>
               </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Left Nav (Desktop) */}
        <nav className="hidden lg:flex items-center gap-12">
          <Link to="/products" className={`text-[10px] uppercase tracking-[0.5em] font-bold transition-all duration-500 font-serif ${!isHomePage || isScrolled ? 'text-black hover:text-zinc-400' : 'text-white hover:text-white/60'}`}>
            {t('nav.collections')}
          </Link>
          <Link to="/products?new=true" className={`text-[10px] uppercase tracking-[0.5em] font-bold transition-all duration-500 font-serif ${!isHomePage || isScrolled ? 'text-black hover:text-zinc-400' : 'text-white hover:text-white/60'}`}>
            {t('nav.newArrivals')}
          </Link>
        </nav>

        {/* Centered Logo */}
        <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
           <motion.span 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className={`text-3xl md:text-5xl font-serif font-bold uppercase tracking-[0.8em] transition-all duration-700 ${!isHomePage || isScrolled ? 'text-black' : 'text-white'}`}
           >
             JOYA
           </motion.span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-8">
           <Button 
             variant="ghost" 
             size="sm" 
             onClick={toggleLanguage}
             className={`hidden md:flex items-center gap-3 text-[10px] font-bold tracking-[0.4em] transition-all duration-500 font-serif ${!isHomePage || isScrolled ? 'text-black hover:text-zinc-400' : 'text-white hover:text-white/60'}`}
           >
             <Globe className="h-4 w-4" />
             {language === 'en' ? 'HE' : 'EN'}
           </Button>
           
           <Link to="/cart" className="relative group">
              <ShoppingCart className={`h-5 w-5 transition-all duration-500 ${!isHomePage || isScrolled ? 'text-black group-hover:text-zinc-400' : 'text-white group-hover:text-white/60'}`} />
           </Link>

           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-transparent group">
                  <User className={`h-5 w-5 transition-all duration-500 ${!isHomePage || isScrolled ? 'text-black group-hover:text-zinc-400' : 'text-white group-hover:text-white/60'}`} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border-zinc-100 mt-6 min-w-[240px] rounded-none shadow-2xl p-4">
                 {user ? (
                   <>
                     <DropdownMenuItem className="focus:bg-zinc-50 rounded-none py-4 cursor-pointer">
                        <Link to="/profile" className="w-full text-[10px] uppercase tracking-[0.3em] font-bold font-serif">{t('profile.personalInfo')}</Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem className="focus:bg-zinc-50 rounded-none py-4 cursor-pointer">
                        <Link to="/orders" className="w-full text-[10px] uppercase tracking-[0.3em] font-bold font-serif">{t('orders.myOrders')}</Link>
                     </DropdownMenuItem>
                     {user.role === 'admin' && (
                       <DropdownMenuItem className="focus:bg-zinc-50 rounded-none py-4 cursor-pointer border-t">
                          <Link to="/admin" className="w-full text-[10px] uppercase tracking-[0.3em] font-bold font-serif text-zinc-400">Dashboard</Link>
                       </DropdownMenuItem>
                     )}
                     <DropdownMenuItem className="focus:bg-zinc-50 rounded-none py-4 cursor-pointer border-t" onClick={() => { logout(); navigate('/'); }}>
                        <span className="w-full text-[10px] uppercase tracking-[0.3em] font-bold font-serif text-red-500">Logout</span>
                     </DropdownMenuItem>
                   </>
                 ) : (
                   <DropdownMenuItem className="focus:bg-zinc-50 rounded-none py-4 cursor-pointer">
                      <Link to="/login" className="w-full text-[10px] uppercase tracking-[0.3em] font-bold font-serif">Login / Register</Link>
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
