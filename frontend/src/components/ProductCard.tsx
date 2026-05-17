import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    name_he: string;
    images: string[];
    price: number;
    countInStock: number;
    featured: boolean;
    isNewArrival?: boolean;
    category?: any;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t, language, getLocalizedField } = useLanguage();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product._id,
      name: product.name,
      name_he: product.name_he,
      image: product.images[0],
      price: product.price,
      quantity: 1,
      countInStock: product.countInStock
    });
    toast.success(language === 'he' ? 'התווסף לסל הקניות' : 'Added to bag');
  };

  return (
    <div className="group relative flex flex-col">
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden bg-zinc-50 aspect-[3/4] border border-zinc-100">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          src={product.images[0]}
          alt={getLocalizedField(product, 'name')}
          className="w-full h-full object-cover"
        />
        
        {/* Subtle Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.featured && (
             <span className="text-[8px] uppercase tracking-[0.3em] bg-black text-white px-3 py-1 font-bold">
               {language === 'he' ? 'נבחר' : 'Featured'}
             </span>
          )}
          {product.isNewArrival && (
             <span className="text-[8px] uppercase tracking-[0.3em] bg-zinc-100 text-black px-3 py-1 font-bold border border-zinc-200">
               {language === 'he' ? 'חדש' : 'New'}
             </span>
          )}
        </div>

        {/* Quick Add (Hidden till hover) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end justify-center p-6">
           <button 
             onClick={handleAddToCart}
             disabled={product.countInStock === 0}
             className="w-full bg-white text-black py-5 text-[9px] uppercase tracking-[0.4em] font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 hover:bg-black hover:text-white"
           >
             {product.countInStock > 0 ? t('productCard.addToBag') : t('productDetail.outOfStock')}
           </button>
        </div>
      </Link>

      <div className="mt-8 flex flex-col items-center text-center">
        <span className="text-[9px] uppercase tracking-[0.5em] text-zinc-400 mb-4 font-serif">
          {product.category ? getLocalizedField(product.category, 'name') : 'Premium Selection'}
        </span>
        <h3 className="text-lg font-serif uppercase tracking-[0.1em] text-black mb-3 group-hover:text-zinc-500 transition-colors font-medium">
          {getLocalizedField(product, 'name')}
        </h3>
        <p className="text-base font-body italic text-zinc-600 tracking-widest">
          ₪{product.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;