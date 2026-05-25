import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Heart, Share2, Plus, Minus, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProductById, getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Variant {
  color: string;
  color_he: string;
  image: string;
  hex: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language, getLocalizedField } = useLanguage();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  // Fetch product by ID
  const { data: product, isLoading: isLoadingProduct, isError: isErrorProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  // Fetch all products for related
  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const relatedProducts = allProducts.filter(
    (p: any) => p.category?._id === product?.category?._id && p._id !== product?._id
  ).slice(0, 4);

  const handleQuantityChange = (change: number) => {
    if (product) {
      setQuantity((prev) => Math.max(1, Math.min(prev + change, product.countInStock)));
    }
  };

  const onAddToCart = () => {
    if (product) {
      const currentImage = selectedVariant ? selectedVariant.image : product.images[0];
      addToCart({
        productId: product._id,
        name: `${product.name}${selectedVariant ? ` - ${selectedVariant.color}` : ''}`,
        name_he: `${product.name_he}${selectedVariant ? ` - ${selectedVariant.color_he}` : ''}`,
        image: currentImage,
        price: product.price,
        quantity: quantity,
        countInStock: product.countInStock
      });
      toast.success(language === 'he' ? 'התווסף לסל הקניות' : 'Added to bag');
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse font-serif text-2xl tracking-[0.2em] text-zinc-300 uppercase">
          Revealing masterpiece...
        </div>
      </div>
    );
  }

  if (isErrorProduct || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <h1 className="text-4xl font-serif mb-8 tracking-widest uppercase">Piece Not Found</h1>
        <Link to="/products">
          <Button variant="outline" className="border-black rounded-none px-10 py-6 uppercase tracking-widest text-[10px] font-bold">Return to Gallery</Button>
        </Link>
      </div>
    );
  }

  const currentImage = selectedVariant ? selectedVariant.image : product.images[0];

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32">
          {/* Left Column - Image Gallery */}
          <div className="space-y-8">
            <motion.div 
              key={currentImage}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="aspect-[3/4] overflow-hidden bg-zinc-50 border border-zinc-100"
            >
              <img
                src={currentImage}
                alt={getLocalizedField(product, 'name')}
                className="w-full h-full object-cover"
              />
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
                    />
                  </div>
                ))}
              </div>
            ) : product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: string, index: number) => (
                  <div key={index} className="aspect-square bg-zinc-50 border border-zinc-100 cursor-pointer overflow-hidden group">
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

          {/* Right Column - Product Info */}
          <div className="flex flex-col">
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
               <p className="text-[11px] text-zinc-500 leading-relaxed uppercase tracking-widest font-body max-w-xl">
                 {getLocalizedField(product, 'description')}
               </p>
            </div>

            {/* Variant Selector in Detail Page */}
            {product.variants && product.variants.length > 1 && (
              <div className="mb-12">
                <span className="text-[10px] uppercase tracking-widest font-bold text-black font-serif block mb-6">
                  {language === 'he' ? 'בחר צבע' : 'Select Color'}: <span className="text-zinc-400 font-normal ml-2">{language === 'he' ? selectedVariant?.color_he : selectedVariant?.color}</span>
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
                  <div className="flex items-center border border-zinc-200 p-1">
                    <button 
                      onClick={() => handleQuantityChange(-1)} 
                      disabled={quantity <= 1}
                      className="w-12 h-12 flex items-center justify-center text-zinc-400 hover:text-black transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold font-serif">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(1)} 
                      disabled={quantity >= product.countInStock}
                      className="w-12 h-12 flex items-center justify-center text-zinc-400 hover:text-black transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-6">
                  <Button 
                    onClick={onAddToCart}
                    disabled={product.countInStock === 0}
                    className="flex-grow bg-black text-white hover:bg-zinc-800 transition-all duration-500 rounded-none py-10 text-[11px] uppercase tracking-[0.4em] font-bold"
                  >
                    {product.countInStock > 0 ? t('productCard.addToBag') : t('productDetail.outOfStock')}
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
                  <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">30-Day Returns</span>
               </div>
               <div className="flex flex-col items-center text-center">
                  <ShieldCheck className="w-5 h-5 text-zinc-300 mb-4" />
                  <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Lifetime Warranty</span>
               </div>
            </div>

            {/* Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details" className="border-zinc-100">
                <AccordionTrigger className="text-[10px] uppercase tracking-[0.4em] font-bold font-serif hover:no-underline">
                  {t('productDetail.details')}
                </AccordionTrigger>
                <AccordionContent className="text-[10px] uppercase tracking-widest text-zinc-400 leading-loose py-6 font-serif">
                   <ul className="space-y-4">
                      <li className="flex justify-between"><span>{t('products.materials')}</span> <span className="text-black">{getLocalizedField(product, 'materials')}</span></li>
                      {product.gemstones && <li className="flex justify-between"><span>{t('products.gemstones')}</span> <span className="text-black">{getLocalizedField(product, 'gemstones')}</span></li>}
                      <li className="flex justify-between"><span>Color</span> <span className="text-black uppercase">{getLocalizedField(product, 'colors')}</span></li>
                      <li className="flex justify-between"><span>SKU</span> <span className="text-black uppercase">JY-{product._id.slice(-6).toUpperCase()}</span></li>
                   </ul>
                </AccordionContent>
              </AccordionItem>

              {(product.piercingSide !== 'none' || product.unitType !== 'none' || product.pipeLength) && (
                <AccordionItem value="specs" className="border-zinc-100">
                  <AccordionTrigger className="text-[10px] uppercase tracking-[0.4em] font-bold font-serif hover:no-underline">
                    {language === 'he' ? 'מפרט טכני' : 'Specifications'}
                  </AccordionTrigger>
                  <AccordionContent className="text-[10px] uppercase tracking-widest text-zinc-400 leading-loose py-6 font-serif">
                    <ul className="space-y-4">
                        {product.piercingSide !== 'none' && (
                          <li className="flex justify-between">
                            <span>{language === 'he' ? 'צד פירסינג' : 'Piercing Side'}</span> 
                            <span className="text-black uppercase">{product.piercingSide}</span>
                          </li>
                        )}
                        {product.unitType !== 'none' && (
                          <li className="flex justify-between">
                            <span>{language === 'he' ? 'סוג יחידה' : 'Unit Type'}</span> 
                            <span className="text-black uppercase">{product.unitType === 'pair' ? (language === 'he' ? 'זוג' : 'Pair') : (language === 'he' ? 'בודד' : 'Single')}</span>
                          </li>
                        )}
                        {product.pipeLength && (
                          <li className="flex justify-between">
                            <span>{language === 'he' ? 'אורך מוט' : 'Pipe Length'}</span> 
                            <span className="text-black uppercase">{product.pipeLength}</span>
                          </li>
                        )}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </div>

        {/* Related Products Section */}
        <section className="mt-60">
          <div className="flex flex-col items-center mb-24">
             <span className="text-[10px] uppercase tracking-[0.8em] text-zinc-400 mb-6 font-serif opacity-70">Complete the Look</span>
             <h2 className="text-4xl md:text-5xl font-serif text-black uppercase tracking-[0.1em] font-medium">
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
    </div>
  );
};

export default ProductDetail;