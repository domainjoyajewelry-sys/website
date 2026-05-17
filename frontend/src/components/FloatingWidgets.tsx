import React, { useEffect } from 'react';
import { MessageCircle, Accessibility } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FloatingWidgets: React.FC = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // Load Accessibility Script (UserWay)
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

  return (
    <div className={`fixed bottom-8 ${language === 'he' ? 'left-8' : 'right-8'} z-50 flex flex-col gap-4`}>
      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/972512345678" 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#20bd5a] transition-all hover:scale-110 flex items-center justify-center group"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className={`absolute ${language === 'he' ? 'left-14' : 'right-14'} bg-black text-white text-[10px] px-3 py-2 rounded uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-serif`}>
          {language === 'he' ? 'צרו קשר בווצאפ' : 'Chat with us'}
        </span>
      </a>

      {/* Customized Accessibility Trigger */}
      <button 
        id="joya-accessibility-trigger"
        onClick={openAccessibility}
        className="bg-white text-black p-4 rounded-full shadow-2xl hover:bg-zinc-50 transition-all hover:scale-110 flex items-center justify-center border border-zinc-100 group"
        aria-label="Accessibility Menu"
      >
        <Accessibility className="w-6 h-6" />
        <span className={`absolute ${language === 'he' ? 'left-14' : 'right-14'} bg-black text-white text-[10px] px-3 py-2 rounded uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-serif`}>
          {language === 'he' ? 'נגישות' : 'Accessibility'}
        </span>
      </button>
    </div>
  );
};

export default FloatingWidgets;