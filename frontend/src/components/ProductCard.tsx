import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: {
    _id: string;
    name_en: string;
    name_he: string;
    images: string[];
    price: number;
    countInStock: number;
    featured: boolean;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t, language, getLocalizedField } = useLanguage();

  return (
    <div className="group relative flex flex-col">
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden bg-zinc-50 aspect-[4/5]">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          src={product.images[0]}
          alt={getLocalizedField(product, 'name')}
          className="w-full h-full object-cover"
        />
        
        {/* Subtle Badge */}
        {product.featured && (
          <div className="absolute top-4 left-4">
             <span className="text-[10px] uppercase tracking-[0.3em] bg-black text-white px-3 py-1">
               {language === 'he' ? 'נבחר' : 'Featured'}
             </span>
          </div>
        )}

        {/* Quick Add (Hidden till hover) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-6">
           <button className="w-full bg-white text-black py-4 text-xs uppercase tracking-widest font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
             {t('productCard.addToBag')}
           </button>
        </div>
      </Link>

      <div className="mt-6 flex flex-col items-center text-center">
        <h3 className="text-xl font-serif italic text-black mb-2 group-hover:text-zinc-500 transition-colors">
          {getLocalizedField(product, 'name')}
        </h3>
        <p className="text-sm font-light tracking-wider text-zinc-400">
          ₪{product.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
