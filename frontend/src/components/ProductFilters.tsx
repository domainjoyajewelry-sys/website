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
    colors: string[];
    bodyParts: string[];
    isNewArrival: boolean;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    category: string;
    priceRange: [number, number];
    materials: string[];
    gemstones: string[];
    colors: string[];
    bodyParts: string[];
    isNewArrival: boolean;
  }>>;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, setFilters }) => {
  const { t, language, getLocalizedField } = useLanguage();

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const materials = [
    { id: 'metal.gold', value: 'Gold' },
    { id: 'metal.silver', value: 'Silver' },
    { id: 'metal.roseGold', value: 'Rose Gold' },
    { id: 'metal.whiteGold', value: 'White Gold' },
    { id: 'metal.platinum', value: 'Platinum' },
    { id: 'metal.titanium', value: 'Titanium' }
  ];

  const colors = [
    { id: 'metal.gold', value: 'Gold' },
    { id: 'metal.silver', value: 'Silver' },
    { id: 'metal.roseGold', value: 'Rose Gold' },
    { id: 'metal.whiteGold', value: 'White Gold' }
  ];

  const bodyParts = [
    { id: 'bodyPart.ear', value: 'Ear' },
    { id: 'bodyPart.nose', value: 'Nose' },
    { id: 'bodyPart.lip', value: 'Lip' },
    { id: 'bodyPart.belly', value: 'Belly' }
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

  const handleColorChange = (color: string, checked: boolean) => {
    setFilters((prev) => {
      const newColors = checked
        ? [...prev.colors, color]
        : prev.colors.filter((c) => c !== color);
      return { ...prev, colors: newColors };
    });
  };

  const handleBodyPartChange = (bodyPart: string, checked: boolean) => {
    setFilters((prev) => {
      const newBodyParts = checked
        ? [...prev.bodyParts, bodyPart]
        : prev.bodyParts.filter((b) => b !== bodyPart);
      return { ...prev, bodyParts: newBodyParts };
    });
  };

  const handleCategoryChange = (catId: string) => {
    setFilters((prev) => ({ ...prev, category: catId }));
  };

  const toggleNewArrival = (checked: boolean) => {
    setFilters((prev) => ({ ...prev, isNewArrival: checked }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 10000],
      materials: [],
      gemstones: [],
      colors: [],
      bodyParts: [],
      isNewArrival: false,
    });
  };

  return (
    <div className="flex flex-col gap-12">
      {/* New Arrivals Toggle */}
      <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
         <Label htmlFor="new-arrivals" className="text-[12px] uppercase tracking-[0.4em] font-bold text-black font-serif">
           {t('products.newCollection')}
         </Label>
         <Checkbox 
           id="new-arrivals" 
           checked={filters.isNewArrival} 
           onCheckedChange={(checked: boolean) => toggleNewArrival(checked)}
           className="border-zinc-300 rounded-none w-4 h-4"
         />
      </div>

      {/* Category Filter */}
      <div className="space-y-6">
        <Label className="uppercase text-[12px] tracking-[0.4em] font-bold text-zinc-400 font-serif">{t('products.category')}</Label>
        {isLoadingCategories ? (
          <div className="animate-pulse text-[12px] uppercase tracking-widest">Loading...</div>
        ) : (
          <RadioGroup value={filters.category} onValueChange={handleCategoryChange} className="space-y-4">
            <div className="flex items-center gap-4 group">
              <RadioGroupItem value="all" id="cat-all" className="border-zinc-300 w-3 h-3" />
              <Label htmlFor="cat-all" className="text-[12px] uppercase tracking-[0.2em] font-medium cursor-pointer group-hover:text-black transition-colors">{t('products.allJewelry')}</Label>
            </div>
            {categories.map((cat: any) => (
              <div key={cat._id} className="flex items-center gap-4 group">
                <RadioGroupItem value={cat._id} id={`cat-${cat._id}`} className="border-zinc-300 w-3 h-3" />
                <Label htmlFor={`cat-${cat._id}`} className="text-[12px] uppercase tracking-[0.2em] font-medium cursor-pointer group-hover:text-black transition-colors">{getLocalizedField(cat, 'name')}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="space-y-8">
        <Label className="uppercase text-[12px] tracking-[0.4em] font-bold text-zinc-400 font-serif">{t('products.priceRange')}</Label>
        <div className="px-2">
          <Slider
            defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
            max={10000}
            step={100}
            onValueChange={handlePriceChange}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-[12px] font-bold tracking-[0.3em] text-black uppercase">
          <span>₪{filters.priceRange[0].toLocaleString()}</span>
          <span>₪{filters.priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-6">
        <Label className="uppercase text-[12px] tracking-[0.4em] font-bold text-zinc-400 font-serif">{t('products.metalColor')}</Label>
        <div className="space-y-4">
          {colors.map((c, index) => (
            <div key={index} className="flex items-center gap-4 group">
              <Checkbox
                id={`color-${index}`}
                checked={filters.colors.includes(c.value)}
                onCheckedChange={(checked: boolean) => handleColorChange(c.value, checked)}
                className="border-zinc-300 rounded-none w-3 h-3"
              />
              <label htmlFor={`color-${index}`} className="text-[12px] uppercase tracking-[0.2em] font-medium cursor-pointer group-hover:text-black transition-colors">
                {t(c.id)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Body Part Filter */}
      <div className="space-y-6">
        <Label className="uppercase text-[12px] tracking-[0.4em] font-bold text-zinc-400 font-serif">{t('products.bodyPart')}</Label>
        <div className="grid grid-cols-1 gap-4">
          {bodyParts.map((b, index) => (
            <div key={index} className="flex items-center gap-4 group">
              <Checkbox
                id={`bodypart-${index}`}
                checked={filters.bodyParts.includes(b.value)}
                onCheckedChange={(checked: boolean) => handleBodyPartChange(b.value, checked)}
                className="border-zinc-300 rounded-none w-3 h-3"
              />
              <label htmlFor={`bodypart-${index}`} className="text-[12px] uppercase tracking-[0.2em] font-medium cursor-pointer group-hover:text-black transition-colors">
                {t(b.id)}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button variant="ghost" className="w-full text-zinc-300 hover:text-black uppercase text-[12px] tracking-[0.5em] font-bold hover:bg-transparent rounded-none py-8 border-t border-zinc-100 transition-all" onClick={clearAllFilters}>
        {t('products.clearAll')}
      </Button>
    </div>
  );
};

export default ProductFilters;