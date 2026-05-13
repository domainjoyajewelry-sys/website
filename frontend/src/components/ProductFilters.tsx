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
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-serif text-stone-900 mb-6">{t('products.filters')}</h3>

      {/* Category Filter */}
      <div className="mb-8">
        <Label className="text-lg font-semibold mb-3 block">{t('products.category')}</Label>
        {isLoadingCategories ? (
          <div>Loading categories...</div>
        ) : (
          <RadioGroup value={filters.category} onValueChange={handleCategoryChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="cat-all" />
              <Label htmlFor="cat-all">{t('products.allJewelry')}</Label>
            </div>
            {categories.map((cat: any) => (
              <div key={cat._id} className="flex items-center space-x-2">
                <RadioGroupItem value={cat._id} id={`cat-${cat._id}`} />
                <Label htmlFor={`cat-${cat._id}`}>{getLocalizedField(cat, 'name')}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="mb-8">
        <Label className="text-lg font-semibold mb-4 block">{t('products.priceRange')}</Label>
        <Slider
          defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
          max={10000}
          step={100}
          onValueChange={handlePriceChange}
          className="w-[90%]"
        />
        <div className="flex justify-between text-sm text-stone-600 mt-2">
          <span>₪{filters.priceRange[0]}</span>
          <span>₪{filters.priceRange[1]}</span>
        </div>
      </div>

      {/* Materials Filter */}
      <div className="mb-8">
        <Label className="text-lg font-semibold mb-3 block">{t('products.materials')}</Label>
        <div className="space-y-2">
          {['18K Gold', 'Sterling Silver', 'Rose Gold'].map((material, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`material-${index}`}
                checked={filters.materials.includes(material)}
                onCheckedChange={(checked: boolean) => handleMaterialChange(material, checked)}
              />
              <label htmlFor={`material-${index}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {material}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Gemstones Filter */}
      <div className="mb-8">
        <Label className="text-lg font-semibold mb-3 block">{t('products.gemstones')}</Label>
        <div className="space-y-2">
          {['Diamond', 'Ruby', 'Emerald', 'Sapphire'].map((gemstone, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`gemstone-${index}`}
                checked={filters.gemstones.includes(gemstone)}
                onCheckedChange={(checked: boolean) => handleGemstoneChange(gemstone, checked)}
              />
              <label htmlFor={`gemstone-${index}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {gemstone}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={clearAllFilters}>
        {t('products.clearAll')}
      </Button>
    </div>
  );
};

export default ProductFilters;
