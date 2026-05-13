import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard'; // Import ProductCard
import ProductFilters from '../components/ProductFilters'; // Import ProductFilters

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Products: React.FC = () => {
  const { t, language, getLocalizedField } = useLanguage();
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 10000],
    materials: [],
    gemstones: [],
  });
  const [sortOrder, setSortOrder] = useState('featured');
  const [viewMode, setViewMode] = useState('grid-3'); // 'grid-3', 'grid-4'

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const filteredProducts = products.filter((product: any) => {
    const priceMatch = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
    const categoryMatch = filters.category === 'all' || product.category === filters.category;
    const materialMatch = filters.materials.length === 0 || filters.materials.some((m: string) =>
      getLocalizedField(product, 'materials')?.includes(m)
    );
    const gemstoneMatch = filters.gemstones.length === 0 || (product.gemstones && filters.gemstones.some((g: string) =>
      getLocalizedField(product, 'gemstones')?.includes(g)
    ));
    return priceMatch && categoryMatch && materialMatch && gemstoneMatch;
  });

  const sortedProducts = filteredProducts.sort((a: any, b: any) => {
    if (sortOrder === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === 'price-low-high') {
      return a.price - b.price;
    } else if (sortOrder === 'price-high-low') {
      return b.price - a.price;
    }
    return 0; // featured or default (no change in order)
  });

  if (isLoadingProducts) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <h1 className="text-5xl font-serif text-stone-900 text-center mb-4">
        {t('products.allJewelry')}
      </h1>
      <p className="text-stone-600 text-center mb-12">
        {t('products.allJewelrySubtitle')}
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-1/4">
          <ProductFilters filters={filters} setFilters={setFilters} />
        </aside>

        {/* Products Grid */}
        <section className="lg:w-3/4">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <span className="text-stone-600">
                {sortedProducts.length} {t('products.itemsFound')}
              </span>
              {/* Active filters badge would go here */}
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    {t('products.sortBy')}: {t(`products.${sortOrder}`)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {['featured', 'newest', 'price-low-high', 'price-high-low'].map((option) => (
                    <DropdownMenuItem key={option} onClick={() => setSortOrder(option)}>
                      {t(`products.${option}`)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon" onClick={() => setViewMode('grid-3')} className={viewMode === 'grid-3' ? 'bg-stone-200' : ''}>
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setViewMode('grid-4')} className={viewMode === 'grid-4' ? 'bg-stone-200' : ''}>
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-serif text-stone-900 mb-4">{t('products.noProductsFound')}</h3>
              <Button variant="outline" onClick={() => setFilters({ ...filters, category: 'all', priceRange: [0, 10000], materials: [], gemstones: [] })}>{t('products.clearAllFilters')}</Button>
            </div>
          ) : (
            <motion.div
              variants={{
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
              initial="hidden"
              animate="visible"
              className={`grid gap-6 ${viewMode === 'grid-3' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}
            >
              {sortedProducts.map((product: any) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination would go here */}
        </section>
      </div>
    </div>
  );
};

export default Products;