import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Slider } from '../components/ui/slider';
import { Checkbox } from '../components/ui/checkbox';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../services/api';

interface ProductFiltersProps {
  filters: {
    category: string;
    priceRange: [number, number];
    materials: string[];
    gemstones: string[];
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    category: string;
    priceRange: [number, number];
    materials: string[];
    gemstones: string[];
  }>>;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, setFilters }) => {
  const { t, language, getLocalizedField } = useLanguage();

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const materials = [
    { id: 'metal.gold', value: '18K Gold' },
    { id: 'metal.silver', value: 'Sterling Silver' },
    { id: 'metal.roseGold', value: 'Rose Gold' }
  ];

  const gemstones = [
    { id: 'gemstone.diamond', value: 'Diamond' },
    { id: 'gemstone.ruby', value: 'Ruby' },
    { id: 'gemstone.emerald', value: 'Emerald' },
    { id: 'gemstone.sapphire', value: 'Sapphire' }
  ];

  const handlePriceChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, priceRange: [value[0], value[1]] }));
  };

  const handleMaterialChange = (material: string, checked: boolean) => {
    setFilters((prev) => {
      const newMaterials = checked
        ? [...prev.materials, material]
        : prev.materials.filter((m) => m !== material);
      return { ...prev, materials: newMaterials };
    });
  };

  const handleGemstoneChange = (gemstone: string, checked: boolean) => {
    setFilters((prev) => {
      const newGemstones = checked
        ? [...prev.gemstones, gemstone]
        : prev.gemstones.filter((g) => g !== gemstone);
      return { ...prev, gemstones: newGemstones };
    });
  };

  const handleCategoryChange = (catId: string) => {
    setFilters((prev) => ({ ...prev, category: catId }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 10000],
      materials: [],
      gemstones: [],
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <h3 className="text-2xl font-serif italic text-black border-b border-zinc-200 pb-4">{t('products.filters')}</h3>

      {/* Category Filter */}
      <div className="space-y-4">
        <Label className="uppercase text-[10px] tracking-widest font-bold text-zinc-400">{t('products.category')}</Label>
        {isLoadingCategories ? (
          <div className="animate-pulse text-xs uppercase tracking-widest">Loading...</div>
        ) : (
          <RadioGroup value={filters.category} onValueChange={handleCategoryChange} className="space-y-3">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="all" id="cat-all" className="border-zinc-300" />
              <Label htmlFor="cat-all" className="text-xs uppercase tracking-widest font-medium cursor-pointer">{t('products.allJewelry')}</Label>
            </div>
            {categories.map((cat: any) => (
              <div key={cat._id} className="flex items-center gap-3">
                <RadioGroupItem value={cat._id} id={`cat-${cat._id}`} className="border-zinc-300" />
                <Label htmlFor={`cat-${cat._id}`} className="text-xs uppercase tracking-widest font-medium cursor-pointer">{getLocalizedField(cat, 'name')}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="space-y-6">
        <Label className="uppercase text-[10px] tracking-widest font-bold text-zinc-400">{t('products.priceRange')}</Label>
        <Slider
          defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
          max={10000}
          step={100}
          onValueChange={handlePriceChange}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] font-bold tracking-widest text-black">
          <span>₪{filters.priceRange[0]}</span>
          <span>₪{filters.priceRange[1]}</span>
        </div>
      </div>

      {/* Materials Filter */}
      <div className="space-y-4">
        <Label className="uppercase text-[10px] tracking-widest font-bold text-zinc-400">{t('products.materials')}</Label>
        <div className="space-y-3">
          {materials.map((m, index) => (
            <div key={index} className="flex items-center gap-3">
              <Checkbox
                id={`material-${index}`}
                checked={filters.materials.includes(m.value)}
                onCheckedChange={(checked: boolean) => handleMaterialChange(m.value, checked)}
                className="border-zinc-300 rounded-none"
              />
              <label htmlFor={`material-${index}`} className="text-xs uppercase tracking-widest font-medium cursor-pointer">
                {t(m.id)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Gemstones Filter */}
      <div className="space-y-4">
        <Label className="uppercase text-[10px] tracking-widest font-bold text-zinc-400">{t('products.gemstones')}</Label>
        <div className="space-y-3">
          {gemstones.map((g, index) => (
            <div key={index} className="flex items-center gap-3">
              <Checkbox
                id={`gemstone-${index}`}
                checked={filters.gemstones.includes(g.value)}
                onCheckedChange={(checked: boolean) => handleGemstoneChange(g.value, checked)}
                className="border-zinc-300 rounded-none"
              />
              <label htmlFor={`gemstone-${index}`} className="text-xs uppercase tracking-widest font-medium cursor-pointer">
                {t(g.id)}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button variant="ghost" className="w-full text-zinc-400 uppercase text-[10px] tracking-[0.3em] font-bold hover:bg-zinc-100 rounded-none py-6" onClick={clearAllFilters}>
        {t('products.clearAll')}
      </Button>
    </div>
  );
};

export default ProductFilters;
