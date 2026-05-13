import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Heart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: {
    _id: string;
    name_en: string;
    name_he: string;
    images: string[];
    price: number;
    countInStock: number;
    featured: boolean;
    materials_en?: string; // Optional, as not all products might have this directly on the model
    materials_he?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t, language, getLocalizedField } = useLanguage();

  return (
    <Card className="group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative w-full h-60 overflow-hidden bg-white flex items-center justify-center">
          <img
            src={product.images[0]}
            alt={getLocalizedField(product, 'name')}
            className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          {product.featured && (
            <span className="absolute top-2 left-2 bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded-full">
              Featured
            </span>
          )}
          {/* Quick actions on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center space-x-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
            <Button variant="outline" size="icon" className="bg-white/80 hover:bg-white transition-all">
              <Heart className="h-4 w-4 text-stone-700" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white/80 hover:bg-white transition-all">
              <Eye className="h-4 w-4 text-stone-700" />
            </Button>
          </div>
        </div>
        <CardContent className="p-4 text-center">
          <h3 className="text-lg font-semibold text-stone-900 truncate">
            {getLocalizedField(product, 'name')}
          </h3>
          <p className="text-stone-600 text-sm mt-1">
            {getLocalizedField(product, 'materials')}
          </p>
          <p className="text-amber-700 font-bold text-xl mt-2">₪{product.price.toLocaleString()}</p>
          <Button variant="default" className="mt-4 w-full">
            {product.countInStock > 0 ? t('productCard.addToBag') : t('productCard.outOfStock')}
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
