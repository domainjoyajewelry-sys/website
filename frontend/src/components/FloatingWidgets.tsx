import React from 'react';
import { MessageCircle, Accessibility } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FloatingWidgets: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className={`fixed bottom-8 ${language === 'he' ? 'left-8' : 'right-8'} z-50 flex flex-col gap-4`}>
      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/972500000000" // Replace with real WhatsApp number
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all hover:scale-110 flex items-center justify-center group"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-14 bg-black text-white text-[10px] px-3 py-2 rounded uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-serif">
          {language === 'he' ? 'צרו קשר בווצאפ' : 'Chat with us'}
        </span>
      </a>

      {/* Accessibility Button */}
      <button 
        className="bg-white text-black p-4 rounded-full shadow-2xl hover:bg-zinc-100 transition-all hover:scale-110 flex items-center justify-center border border-zinc-200 group"
        aria-label="Accessibility Menu"
        onClick={() => {
           // Basic alert for now, can be replaced with a real accessibility script (e.g. UserWay)
           alert("Accessibility menu opening...");
        }}
      >
        <Accessibility className="w-6 h-6" />
      </button>
    </div>
  );
};

export default FloatingWidgets;