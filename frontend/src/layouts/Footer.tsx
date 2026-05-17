import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-white border-t border-zinc-100 pt-32 pb-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-screen-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-8 mb-32">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-10">
            <Link to="/" className="text-4xl font-serif font-bold uppercase tracking-[0.6em] text-black">
              JOYA
            </Link>
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 leading-loose max-w-md font-body">
              {t('footer.brandDescription')}
            </p>
            <div className="flex gap-8">
              <a href="#" className="text-zinc-300 hover:text-black transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-zinc-300 hover:text-black transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-zinc-300 hover:text-black transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-10">
            <h3 className="text-[11px] font-serif uppercase tracking-[0.4em] font-bold text-black">{t('nav.collections')}</h3>
            <ul className="space-y-6">
              {['rings', 'necklaces', 'earrings', 'bracelets', 'piercing'].map((slug) => (
                <li key={slug}>
                  <Link 
                    to={`/products?category=${slug}`} 
                    className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-black transition-colors font-bold font-serif"
                  >
                    {t(`nav.${slug}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
{/* Boutique */}
<div className="space-y-10">
  <h3 className="text-[11px] font-serif uppercase tracking-[0.4em] font-bold text-black">{t('footer.help')}</h3>
  <ul className="space-y-6">
    <li>
      <Link 
        to="/gift-card" 
        className="text-[10px] uppercase tracking-[0.3em] text-black hover:text-zinc-600 transition-colors font-bold font-serif flex items-center gap-2"
      >
        <Gift className="w-3 h-3" /> {language === 'he' ? 'כרטיס מתנה' : 'Gift Card'}
      </Link>
    </li>
    {[
      { label: 'info.aboutTitle', path: '/about' },
...
                { label: 'footer.shipping', path: '/shipping' },
                { label: 'footer.faqs', path: '/faqs' },
                { label: 'footer.care', path: '/care' },
                { label: 'footer.warranty', path: '/warranty' },
                { label: 'footer.contact', path: '/contact' }
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-black transition-colors font-bold font-serif"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-10">
            <h3 className="text-[11px] font-serif uppercase tracking-[0.4em] font-bold text-black">{t('footer.newsletterTitle')}</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 leading-relaxed font-body">
              {t('footer.newsletterDescription')}
            </p>
            <div className="space-y-4">
              <Input 
                type="email" 
                placeholder="YOUR EMAIL" 
                className="bg-transparent border-b border-zinc-200 border-t-0 border-l-0 border-r-0 rounded-none px-0 py-6 text-[10px] uppercase tracking-widest focus-visible:ring-0 focus-visible:border-black transition-all" 
              />
              <Button variant="ghost" className="px-0 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-transparent hover:text-black group flex items-center gap-4">
                {t('footer.subscribe')}
                <div className="w-8 h-[1px] bg-zinc-200 transition-all group-hover:w-16 group-hover:bg-black"></div>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-zinc-50 pt-16">
          <p className="text-[9px] uppercase tracking-[0.5em] text-zinc-300 font-serif">
            {t('footer.copyright')}
          </p>
          <div className="flex gap-12 grayscale opacity-40">
             <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="PayPal" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="Mastercard" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
