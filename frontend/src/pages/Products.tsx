import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { LayoutGrid, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';

const Products: React.FC = () => {
  const { t, language, getLocalizedField } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 10000],
    materials: [],
    gemstones: [],
  });
  const [sortOrder, setSortOrder] = useState('featured');

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const filteredProducts = products.filter((product: any) => {
    const priceMatch = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
    const categoryMatch = filters.category === 'all' || product.category?._id === filters.category || product.category === filters.category;
    return priceMatch && categoryMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
    if (sortOrder === 'price-low-high') return a.price - b.price;
    if (sortOrder === 'price-high-low') return b.price - a.price;
    return 0;
  });

  if (isLoadingProducts) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse font-serif italic text-2xl">Refining collection...</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-screen-2xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-serif italic mb-6 text-black tracking-tighter"
          >
            {t('products.allJewelry')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-zinc-400 uppercase tracking-[0.4em] text-xs"
          >
            {t('products.allJewelrySubtitle')}
          </motion.p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-zinc-100 pb-8 mb-12 gap-6">
          <div className="flex items-center gap-8">
            <Button 
              variant="ghost" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-3 uppercase text-[10px] tracking-widest font-bold hover:bg-transparent"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {language === 'he' ? 'סינון' : 'Filters'}
            </Button>
            <span className="text-[10px] uppercase tracking-widest text-zinc-400">
              {sortedProducts.length} {t('products.itemsFound')}
            </span>
          </div>

          <div className="flex items-center gap-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 uppercase text-[10px] tracking-widest font-bold hover:bg-transparent">
                  {language === 'he' ? 'מיון לפי' : 'Sort by'} <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border-zinc-100 rounded-none shadow-xl min-w-[200px]">
                {['featured', 'price-low-high', 'price-high-low'].map((option) => (
                  <DropdownMenuItem key={option} onClick={() => setSortOrder(option)} className="uppercase text-[10px] tracking-widest p-4 focus:bg-zinc-50 cursor-pointer">
                    {t(`products.${option}`)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Animated Sidebar Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="lg:w-1/4"
              >
                <div className="sticky top-32 bg-zinc-50 p-8">
                  <ProductFilters filters={filters} setFilters={setFilters} />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products Grid with Entrance Animations */}
          <section className="flex-grow">
            {sortedProducts.length === 0 ? (
              <div className="text-center py-32 bg-zinc-50">
                <h3 className="text-3xl font-serif italic text-black mb-6">{t('products.noProductsFound')}</h3>
                <Button variant="outline" className="rounded-none border-black text-black px-10 py-6 uppercase tracking-widest" onClick={() => setFilters({ ...filters, category: 'all' })}>
                  {t('products.clearAllFilters')}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-24">
                {sortedProducts.map((product: any, i: number) => (
                  <motion.div 
                    key={product._id}
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Products;
