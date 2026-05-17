import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const InfoPage: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const getPageConfig = () => {
    switch (location.pathname) {
      case '/shipping':
        return { title: 'info.shippingTitle', text: 'info.shippingText' };
      case '/faqs':
        return { title: 'info.faqTitle', text: 'info.faqText' };
      case '/care':
        return { title: 'info.careTitle', text: 'info.careText' };
      case '/warranty':
        return { title: 'info.warrantyTitle', text: 'info.warrantyText' };
      case '/contact':
        return { title: 'info.contactTitle', text: 'info.contactText' };
      default:
        return { title: 'info.aboutTitle', text: 'info.aboutText' };
    }
  };

  const config = getPageConfig();

  return (
    <div className="bg-white min-h-screen pt-40 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <span className="text-[10px] uppercase tracking-[0.8em] text-zinc-400 mb-8 block font-serif">The House of JOYA</span>
          <h1 className="text-4xl md:text-6xl font-serif text-black uppercase tracking-[0.1em] font-medium leading-tight">
            {t(config.title)}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1.5 }}
          className="text-lg md:text-xl text-zinc-600 font-body leading-relaxed max-w-2xl mx-auto space-y-8"
        >
           {t(config.text).split('Q:').map((part, i) => (
             <p key={i} className={part.startsWith(' ') ? "mt-4" : ""}>
               {part.startsWith(' ') ? `Q:${part}` : part}
             </p>
           ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pt-20"
        >
          <div className="w-16 h-[1px] bg-zinc-200 mx-auto"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default InfoPage;