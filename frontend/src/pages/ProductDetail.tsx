import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Heart, Share2, Plus, Minus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProductById, getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language, getLocalizedField } = useLanguage();
  const [quantity, setQuantity] = useState(1);

  // Fetch product by ID
  const { data: product, isLoading: isLoadingProduct, isError: isErrorProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id as string),
    enabled: !!id, // Only run query if ID is available
  });

  // Fetch all products to find related ones
  const { data: allProducts = [], isLoading: isLoadingAllProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const relatedProducts = allProducts.filter(
    (p: any) => p.category === product?.category && p._id !== product?._id
  ).slice(0, 4);

  const handleQuantityChange = (change: number) => {
    if (product) {
      setQuantity((prev) => Math.max(1, Math.min(prev + change, product.countInStock)));
    }
  };

  if (isLoadingProduct || isLoadingAllProducts) {
    return <div>Loading product details...</div>;
  }

  if (isErrorProduct || !product) {
    return <div>Error loading product or product not found.</div>;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-stone-600">
        <Link to="/" className="hover:underline">{t('home.home')}</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:underline">{t('products.allJewelry')}</Link>
        <span className="mx-2">/</span>
        <span>{getLocalizedField(product, 'name')}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Image Gallery */}
        <div>
          <img
            src={product.images[0]}
            alt={getLocalizedField(product, 'name')}
            className="w-full aspect-square object-contain bg-white rounded-lg shadow-md"
          />
          {product.images.length > 1 && (
            <div className="flex space-x-2 mt-4 overflow-x-auto">
              {product.images.map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  alt={`${getLocalizedField(product, 'name')} thumbnail ${index + 1}`}
                  className="w-20 h-20 object-contain bg-white rounded-md cursor-pointer border border-stone-200 hover:border-amber-400 transition-colors"
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Info */}
        <div>
          <p className="text-sm uppercase text-stone-500 mb-2">{getLocalizedField(product, 'materials')}</p>
          <h1 className="text-4xl font-serif text-stone-900 mb-4">{getLocalizedField(product, 'name')}</h1>
          <div className="flex items-center mb-4">
            {/* 5-star rating with review count would go here */}
            <span className="text-amber-400">★★★★★</span>
            <span className="text-stone-600 ml-2">(120 {t('productDetail.reviews')})</span>
          </div>
          <p className="text-5xl font-bold text-amber-700 mb-6">₪{product.price.toLocaleString()}</p>
          <p className="text-stone-700 leading-relaxed mb-6">{getLocalizedField(product, 'description')}</p>

          <div className="flex items-center space-x-4 mb-6">
            <span className="text-lg font-semibold text-stone-900">{t('productDetail.quantity')}:</span>
            <div className="flex items-center border border-stone-300 rounded-md">
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 text-lg">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} disabled={quantity >= product.countInStock}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {product.countInStock > 0 ? (
              <span className="text-green-600">{t('productDetail.stockStatus')} ({product.countInStock})</span>
            ) : (
              <span className="text-red-600">{t('productDetail.outOfStock')}</span>
            )}
          </div>

          <Button variant="default" size="lg" className="w-full mb-4">
            {t('productCard.addToBag')}
          </Button>

          <div className="flex space-x-4 mb-6">
            <Button variant="outline" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-stone-100 text-stone-700 text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <img src="/path/to/shipping-icon.png" alt="" className="h-4 w-4" /> {/* Placeholder icon */}
              {t('productDetail.freeShipping')}
            </span>
            <span className="bg-stone-100 text-stone-700 text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <img src="/path/to/returns-icon.png" alt="" className="h-4 w-4" /> {/* Placeholder icon */}
              {t('service.30DayReturns')}
            </span>
            <span className="bg-stone-100 text-stone-700 text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <img src="/path/to/warranty-icon.png" alt="" className="h-4 w-4" /> {/* Placeholder icon */}
              {t('productDetail.lifetimeWarranty')}
            </span>
          </div>

          {/* Accordion Sections */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>{t('productDetail.details')}</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 text-stone-700">
                  <li>{t('products.materials')}: {getLocalizedField(product, 'materials')}</li>
                  <li>{t('products.gemstones')}: {getLocalizedField(product, 'gemstones') || 'N/A'}</li>
                  <li>SKU: {product.sku}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>{t('productDetail.shippingReturns')}</AccordionTrigger>
              <AccordionContent>
                <p className="text-stone-700">{t('productDetail.shippingReturnsDescription')}</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>{t('productDetail.careInstructions')}</AccordionTrigger>
              <AccordionContent>
                <p className="text-stone-700">{t('productDetail.careInstructionsDescription')}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Related Products Section */}
      <section className="mt-20">
        <h2 className="text-4xl font-serif text-stone-900 text-center mb-12">
          {t('productDetail.youMayAlsoLike')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((p: any) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;