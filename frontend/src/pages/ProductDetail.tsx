import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Heart, Share2, Plus, Minus, ShieldCheck, Truck, RotateCcw, Camera, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProductById, getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import VirtualTryOn from '../components/VirtualTryOn';
import { motion, AnimatePresence } from 'framer-motion';

interface Variant {
  color: string;
  color_he: string;
  hex: string;
  image: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language, getLocalizedField } = useLanguage();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState('');
  const [showTryOn, setShowTryOn] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id as string),
    enabled: !!id,
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  useEffect(() => {
    if (product) {
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
        setCurrentImage(product.variants[0].image);
      } else {
        setCurrentImage(product.images[0]);
      }
    }
  }, [product]);

  useEffect(() => {
    if (selectedVariant) {
      setCurrentImage(selectedVariant.image);
    }
  }, [selectedVariant]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-serif uppercase tracking-widest text-zinc-400">{t('global.loading')}</div>;
  if (isError || !product) return <div className="min-h-screen flex items-center justify-center font-serif text-2xl uppercase tracking-widest">Product not found</div>;

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      name: product.name,
      name_he: product.name_he,
      price: product.price,
      image: currentImage,
      quantity,
    });
  };

  const relatedProducts = allProducts
    .filter((p: any) => p.category?._id === product.category?._id && p._id !== product._id)
    .slice(0, 4);

  return (
    <div className="bg-white min-h-screen pt-40 pb-20 px-6">
      <div className="max-w-screen-2xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-16 flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-serif">
          <Link to="/" className="hover:text-black transition-colors">{t('home.home')}</Link>
          <span className="opacity-30">/</span>
          <Link to="/products" className="hover:text-black transition-colors">{t('products.allJewelry')}</Link>
          <span className="opacity-30">/</span>
          <span className="text-black font-bold">{getLocalizedField(product, 'name')}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32 items-start">
          
          {/* Column - Product Info (Order-2 on desktop, first for RTL alignment to right) */}
          <div className="flex flex-col lg:order-2 rtl:lg:order-1 rtl:text-right">
            <div className="mb-12">
               <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-400 mb-6 block font-serif">
                 {getLocalizedField(product.category, 'name')}
               </span>
               <h1 className="text-4xl md:text-6xl font-serif text-black mb-8 uppercase tracking-[0.1em] font-medium leading-tight">
                 {getLocalizedField(product, 'name')}
               </h1>
               <p className="text-3xl font-body italic text-black mb-12 tracking-widest">
                 ₪{product.price.toLocaleString()}
               </p>
               <div className="text-[11px] text-zinc-500 leading-relaxed uppercase tracking-widest font-body max-w-xl">
                 {getLocalizedField(product, 'description')}
               </div>
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 1 && (
              <div className="mb-12">
                <span className="text-[10px] uppercase tracking-widest font-bold text-black font-serif block mb-6">
                  {t('productDetail.selectColor')}: <span className="text-zinc-400 font-normal ms-2">{language === 'he' ? selectedVariant?.color_he : selectedVariant?.color}</span>
                </span>
                <div className="flex gap-4">
                  {product.variants.map((v: Variant, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(v)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                        selectedVariant?.color === v.color ? 'border-black scale-110 shadow-lg' : 'border-zinc-100 hover:border-zinc-300'
                      }`}
                      style={{ backgroundColor: v.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-12 mb-16 border-y border-zinc-100 py-12">
               <div className="flex items-center gap-10">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-black font-serif">{t('productDetail.quantity')}</span>
                  <div className="flex items-center border border-zinc-200">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-zinc-400 hover:text-black transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold font-serif">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center text-zinc-400 hover:text-black transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-6">
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-grow bg-black text-white hover:bg-zinc-800 transition-all duration-700 rounded-none py-10 text-[11px] uppercase tracking-[0.5em] font-bold shadow-2xl"
                  >
                    {t('productCard.addToBag')}
                  </Button>
                  <Button variant="outline" className="border-zinc-200 rounded-none p-8 hover:bg-zinc-50 transition-colors">
                    <Heart className="w-5 h-5 text-zinc-300" />
                  </Button>
                  <Button variant="outline" className="border-zinc-200 rounded-none p-8 hover:bg-zinc-50 transition-colors">
                    <Share2 className="w-5 h-5 text-zinc-300" />
                  </Button>
               </div>
            </div>

            {/* Service Badges */}
            <div className="grid grid-cols-3 gap-8 mb-16">
               <div className="flex flex-col items-center text-center">
                  <Truck className="w-5 h-5 text-zinc-300 mb-4" />
                  <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">{t('productDetail.freeShipping')}</span>
               </div>
               <div className="flex flex-col items-center text-center">
                  <RotateCcw className="w-5 h-5 text-zinc-300 mb-4" />
                  <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">{t('productDetail.30DayReturns')}</span>
               </div>
               <div className="flex flex-col items-center text-center">
                  <ShieldCheck className="w-5 h-5 text-zinc-300 mb-4" />
                  <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">{t('productDetail.lifetimeWarranty')}</span>
               </div>
            </div>

            {/* Static Product Info Sections */}
            <div className="w-full space-y-12">
              <div className="border-t border-zinc-100 pt-10">
                <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold font-serif mb-8 text-black">
                  {t('productDetail.details')}
                </h3>
                <div className="text-[10px] uppercase tracking-widest text-zinc-400 leading-loose font-serif">
                   <ul className="space-y-4">
                      <li className="flex justify-between"><span>{t('products.materials')}</span> <span className="text-black">{getLocalizedField(product, 'materials')}</span></li>
                      {product.gemstones && <li className="flex justify-between"><span>{t('products.gemstones')}</span> <span className="text-black">{getLocalizedField(product, 'gemstones')}</span></li>}
                      <li className="flex justify-between"><span>{t('productDetail.color')}</span> <span className="text-black uppercase">{getLocalizedField(product, 'colors')}</span></li>
                      <li className="flex justify-between"><span>{t('productDetail.sku')}</span> <span className="text-black uppercase">JY-{product._id.slice(-6).toUpperCase()}</span></li>
                   </ul>
                </div>
              </div>

              {(product.piercingSide !== 'none' || product.unitType !== 'none' || product.pipeLength) && (
                <div className="border-t border-zinc-100 pt-10">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold font-serif mb-8 text-black">
                    {t('specs.title')}
                  </h3>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-400 leading-loose font-serif">
                    <ul className="space-y-4">
                        {product.piercingSide !== 'none' && (
                          <li className="flex justify-between">
                            <span>{t('specs.piercingSide')}</span> 
                            <span className="text-black uppercase">{t(`specs.${product.piercingSide}`)}</span>
                          </li>
                        )}
                        {product.unitType !== 'none' && (
                          <li className="flex justify-between">
                            <span>{t('specs.unitType')}</span> 
                            <span className="text-black uppercase">{t(`specs.${product.unitType}`)}</span>
                          </li>
                        )}
                        {product.pipeLength && (
                          <li className="flex justify-between">
                            <span>{t('specs.pipeLength')}</span> 
                            <span className="text-black uppercase">{product.pipeLength}</span>
                          </li>
                        )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column - Image Gallery (Order-1 on desktop, second for RTL alignment to left) */}
          <div className="space-y-8 lg:order-1 rtl:lg:order-2">
            <motion.div 
              key={currentImage}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="aspect-[3/4] overflow-hidden bg-zinc-50 border border-zinc-100 relative group"
            >
              <img
                src={currentImage}
                alt={getLocalizedField(product, 'name')}
                className="w-full h-full object-cover"
                style={{ mixBlendMode: 'multiply' }}
              />

              {/* Try On Trigger */}
              <Button 
                onClick={() => setShowTryOn(true)}
                className="absolute bottom-8 start-8 end-8 bg-white/90 backdrop-blur-md text-black hover:bg-black hover:text-white rounded-none h-16 uppercase tracking-[0.4em] text-[10px] font-bold transition-all duration-700 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0"
              >
                <Camera className="me-4 w-4 h-4" />
                {t('tryOn.title')}
              </Button>
            </motion.div>
            
            {product.variants && product.variants.length > 0 ? (
              <div className="grid grid-cols-4 gap-4">
                {product.variants.map((v: Variant, index: number) => (
                  <div 
                    key={index} 
                    onClick={() => setSelectedVariant(v)}
                    className={`aspect-square bg-zinc-50 border cursor-pointer overflow-hidden group transition-all duration-300 ${selectedVariant?.color === v.color ? 'border-black' : 'border-zinc-100'}`}
                  >
                    <img
                      src={v.image}
                      alt=""
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      style={{ mixBlendMode: 'multiply' }}
                    />
                  </div>
                ))}
              </div>
            ) : product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: string, index: number) => (
                  <div key={index} 
                    onClick={() => setCurrentImage(img)}
                    className={`aspect-square bg-zinc-50 border cursor-pointer overflow-hidden group transition-all duration-300 ${currentImage === img ? 'border-black' : 'border-zinc-100'}`}>
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        <section className="mt-60">
          <div className="flex flex-col items-center mb-24">
             <span className="text-[10px] uppercase tracking-[0.8em] text-zinc-400 mb-6 font-serif opacity-70">{t('productDetail.completeTheLook')}</span>
             <h2 className="text-4xl md:text-5xl font-serif text-black uppercase tracking-[0.1em] font-medium text-center">
               {t('productDetail.youMayAlsoLike')}
             </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {relatedProducts.map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
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

export default ProductDetail;
