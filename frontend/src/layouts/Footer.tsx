import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-50 text-stone-600 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="text-stone-900 text-lg font-semibold mb-4">{t('footer.newsletterTitle')}</h3>
            <p className="mb-4">
              {t('footer.newsletterDescription')} {/* Add newsletter description to translations */}
            </p>
            <div className="flex space-x-2">
              <Input type="email" placeholder="Your email" className="bg-white border-stone-200" />
              <Button variant="default">{t('footer.subscribe')}</Button> {/* Add subscribe to translations */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-stone-900 text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=rings" className="hover:text-amber-700 transition-colors">
                  {t('nav.rings')}
                </Link>
              </li>
              <li>
                <Link to="/products?category=necklaces" className="hover:text-amber-700 transition-colors">
                  {t('nav.necklaces')}
                </Link>
              </li>
              <li>
                <Link to="/products?category=earrings" className="hover:text-amber-700 transition-colors">
                  {t('nav.earrings')}
                </Link>
              </li>
              <li>
                <Link to="/products?category=bracelets" className="hover:text-amber-700 transition-colors">
                  {t('nav.bracelets')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h3 className="text-stone-900 text-lg font-semibold mb-4">{t('footer.help')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="hover:text-amber-700 transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-amber-700 transition-colors">
                  {t('footer.shipping')}
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-amber-700 transition-colors">
                  {t('footer.faqs')}
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="hover:text-amber-700 transition-colors">
                  {t('footer.sizeGuide')}
                </Link>
              </li>
              <li>
                <Link to="/care" className="hover:text-amber-700 transition-colors">
                  {t('footer.care')}
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="hover:text-amber-700 transition-colors">
                  {t('footer.warranty')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Brand Description & Social */}
          <div>
            <h3 className="text-stone-900 text-lg font-semibold mb-4">{t('app.Joya')}</h3>
            <p className="mb-4">
              {t('footer.brandDescription')} {/* Add brand description to translations */}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-stone-600 hover:text-amber-700 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-stone-600 hover:text-amber-700 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-stone-600 hover:text-amber-700 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-200 mt-8 pt-8 text-center text-sm">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
