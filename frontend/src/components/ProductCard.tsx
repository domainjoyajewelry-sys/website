import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Camera } from 'lucide-react';
import VirtualTryOn from './VirtualTryOn';

interface Variant {
  color: string;
  color_he: string;
  image: string;
  hex: string;
}

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
    variants?: Variant[];
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t, language, getLocalizedField } = useLanguage();
  const { addToCart } = useCart();
  const [showTryOn, setShowTryOn] = useState(false);
  
  // Track selected variant
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  const currentImage = selectedVariant ? selectedVariant.image : product.images[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      productId: product._id,
      name: `${product.name}${selectedVariant ? ` - ${selectedVariant.color}` : ''}`,
      name_he: `${product.name_he}${selectedVariant ? ` - ${selectedVariant.color_he}` : ''}`,
      image: currentImage,
      price: product.price,
      quantity: 1,
      countInStock: product.countInStock
    });
    toast.success(language === 'he' ? 'התווסף לסל הקניות' : 'Added to bag');
  };

  const handleVariantClick = (e: React.MouseEvent, variant: Variant) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVariant(variant);
  };

  const handleTryOnClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTryOn(true);
  };

  const isEarringOrPiercing = 
    product.category?.slug === 'earrings' || 
    product.category?.slug === 'piercing' || 
    product.category === 'earrings' || 
    product.category === 'piercing' ||
    getLocalizedField(product.category, 'name')?.toLowerCase().includes('ear') ||
    getLocalizedField(product.category, 'name')?.toLowerCase().includes('pierc');

  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-50 border border-zinc-100">
        <Link to={`/product/${product._id}`} className="block w-full h-full">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              src={currentImage}
              alt={getLocalizedField(product, 'name')}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
        </Link>
        
        {/* Subtle Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
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

        {/* Try On Button (Top Right) - Now outside the Link to ensure clickability */}
        {isEarringOrPiercing && (
           <div className="absolute top-4 right-4 z-30">
              <button 
                onClick={handleTryOnClick}
                className="bg-[#f5f5dc] text-black w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-[#e8e8c8] transition-all transform hover:scale-110 group/try"
                title={t('tryOn.title')}
              >
                <Camera className="w-4 h-4" />
                <span className="absolute right-full mr-3 opacity-0 group-hover/try:opacity-100 transition-opacity bg-black text-white text-[7px] uppercase tracking-widest px-2 py-1 whitespace-nowrap pointer-events-none">
                   {t('tryOn.title')}
                </span>
              </button>
           </div>
        )}

        {/* Quick Add (Hidden till hover) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end justify-center p-6 pointer-events-none">
           <button 
             onClick={handleAddToCart}
             disabled={product.countInStock === 0}
             className="w-full bg-white text-black py-5 text-[9px] uppercase tracking-[0.4em] font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 hover:bg-black hover:text-white shadow-xl pointer-events-auto"
           >
             {product.countInStock > 0 ? t('productCard.addToBag') : t('productDetail.outOfStock')}
           </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center text-center">
        {/* Color Selection Circles */}
        {product.variants && product.variants.length > 1 && (
          <div className="flex gap-3 mb-6">
            {product.variants.map((v, i) => (
              <button
                key={i}
                onClick={(e) => handleVariantClick(e, v)}
                className={`w-4 h-4 rounded-full border transition-all duration-300 ${
                  selectedVariant?.color === v.color ? 'border-black scale-125' : 'border-zinc-200 hover:scale-110'
                }`}
                style={{ backgroundColor: v.hex || '#ccc' }}
                title={language === 'he' ? v.color_he : v.color}
              />
            ))}
          </div>
        )}

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

      <AnimatePresence>
        {showTryOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
          >
            <VirtualTryOn 
              productImage={currentImage} 
              onClose={() => setShowTryOn(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductCard;