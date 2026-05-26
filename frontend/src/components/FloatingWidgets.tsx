import React, { useEffect, useState } from 'react';
import { MessageCircle, Accessibility } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';

const FloatingWidgets: React.FC = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Load Accessibility Script...
    const userwayId = import.meta.env.VITE_USERWAY_ID;
    
    if (userwayId && userwayId !== 'YOUR_USERWAY_ID') {
      if (!document.querySelector('script[src="https://cdn.userway.org/widget.js"]')) {
        const script = document.createElement('script');
        script.setAttribute('data-account', userwayId); 
        script.setAttribute('data-trigger', 'joya-accessibility-trigger');
        script.src = 'https://cdn.userway.org/widget.js';
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, []);

  const openAccessibility = () => {
    // Try to trigger via UserWay API if script is loaded
    if ((window as any).UserWay && (window as any).UserWay.openMenu) {
      (window as any).UserWay.openMenu();
    }
  };

  const isHomePage = location.pathname === '/';

  return (
    <div className={`fixed bottom-8 left-8 z-40 flex flex-col gap-6 transition-all duration-700 ${isHomePage && !isScrolled ? 'opacity-0 -translate-x-20 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
      {/* Accessibility Trigger */}
      <button 
        id="joya-accessibility-trigger"
        onClick={openAccessibility}
        className="w-14 h-14 bg-white text-black rounded-full shadow-2xl hover:bg-zinc-50 transition-all hover:scale-110 flex items-center justify-center border border-zinc-200 group active:scale-95"
        aria-label="Accessibility Menu"
      >
        <Accessibility className="w-6 h-6" />
        <span className="absolute left-full ml-4 bg-black text-white text-[10px] px-3 py-2 rounded uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-serif shadow-xl">
          {language === 'he' ? 'נגישות' : 'Accessibility'}
        </span>
      </button>

      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/972512345678" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#20bd5a] transition-all hover:scale-110 flex items-center justify-center group active:scale-95"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute left-full ml-4 bg-black text-white text-[10px] px-3 py-2 rounded uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-serif shadow-xl">
          {language === 'he' ? 'צרו קשר בווצאפ' : 'WhatsApp'}
        </span>
      </a>
    </div>
  );
};

export default FloatingWidgets;