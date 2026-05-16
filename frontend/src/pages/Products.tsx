import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { LayoutGrid, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';

const Products: React.FC = () => {
  const { t, language, getLocalizedField } = useLanguage();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 10000],
    materials: [],
    gemstones: [],
    colors: [],
    bodyParts: [],
  });
  const [sortOrder, setSortOrder] = useState('featured');

  useEffect(() => {
    const colorParam = searchParams.get('color');
    if (colorParam) {
      setFilters(prev => ({
        ...prev,
        colors: [colorParam]
      }));
    }
  }, [searchParams]);

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const filteredProducts = products.filter((product: any) => {
    const priceMatch = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
    const categoryMatch = filters.category === 'all' || product.category?._id === filters.category || product.category === filters.category;
    
    const materialMatch = filters.materials.length === 0 || 
      filters.materials.some(m => product.materials?.includes(m));
    
    const gemstoneMatch = filters.gemstones.length === 0 || 
      filters.gemstones.some(g => product.gemstones?.includes(g));

    const colorMatch = filters.colors.length === 0 || 
      filters.colors.some(c => product.colors?.includes(c) || product.color === c || product.colors_he?.includes(c));

    const bodyPartMatch = filters.bodyParts.length === 0 || 
      filters.bodyParts.some(bp => product.bodyParts?.includes(bp) || product.bodyPart === bp);

    return priceMatch && categoryMatch && materialMatch && gemstoneMatch && colorMatch && bodyPartMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
    if (sortOrder === 'price-low-high') return a.price - b.price;
    if (sortOrder === 'price-high-low') return b.price - a.price;
    return 0;
  });

  if (isLoadingProducts) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse font-serif text-2xl tracking-widest">Refining collection...</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-40 pb-20 px-6">
      <div className="max-w-screen-2xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-serif mb-8 text-black tracking-tight"
          >
            {t('products.allJewelry')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-zinc-400 uppercase tracking-[0.6em] text-[10px]"
          >
            {t('products.allJewelrySubtitle')}
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 relative">
          
          {/* Desktop Sidebar Toggle & Mobile Filter Button */}
          <div className="lg:hidden flex justify-between items-center mb-8">
             <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-3 uppercase text-[10px] tracking-widest font-bold border-black rounded-none"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {language === 'he' ? 'סינון' : 'Filters'}
              </Button>
          </div>

          {/* Sidebar Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="w-full lg:w-72 flex-shrink-0"
              >
                <div className="sticky top-40 space-y-12">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                    <h2 className="text-sm font-serif tracking-[0.2em]">{language === 'he' ? 'סינון' : 'FILTERS'}</h2>
                    <button onClick={() => setShowFilters(false)} className="lg:hidden">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <ProductFilters filters={filters} setFilters={setFilters} />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products Section */}
          <div className="flex-grow">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-8 mb-16">
              <div className="flex items-center gap-8">
                {!showFilters && (
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowFilters(true)}
                    className="hidden lg:flex items-center gap-3 uppercase text-[10px] tracking-widest font-bold hover:bg-zinc-50 rounded-none"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    {language === 'he' ? 'הצג סינון' : 'Show Filters'}
                  </Button>
                )}
                <span className="text-[10px] uppercase tracking-widest text-zinc-400">
                  {sortedProducts.length} {t('products.itemsFound')}
                </span>
              </div>

              <div className="flex items-center gap-8">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-3 uppercase text-[10px] tracking-widest font-bold hover:bg-zinc-50 rounded-none">
                      {language === 'he' ? 'מיון לפי' : 'Sort by'} <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border-zinc-100 rounded-none shadow-2xl min-w-[200px]">
                    {['featured', 'price-low-high', 'price-high-low'].map((option) => (
                      <DropdownMenuItem key={option} onClick={() => setSortOrder(option)} className="uppercase text-[10px] tracking-widest p-4 focus:bg-zinc-50 cursor-pointer font-body">
                        {t(`products.${option}`)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {sortedProducts.length === 0 ? (
              <div className="text-center py-40 bg-zinc-50">
                <h3 className="text-2xl font-serif text-black mb-8 tracking-widest">{t('products.noProductsFound')}</h3>
                <Button variant="outline" className="rounded-none border-black text-black px-12 py-8 uppercase tracking-[0.3em] text-[10px] hover:bg-black hover:text-white transition-all" onClick={() => setFilters({ ...filters, category: 'all', colors: [], materials: [], gemstones: [], bodyParts: [] })}>
                  {t('products.clearAllFilters')}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-24">
                {sortedProducts.map((product: any, i: number) => (
                  <motion.div 
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
