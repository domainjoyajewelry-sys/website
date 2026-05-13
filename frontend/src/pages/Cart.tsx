import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Plus, Minus, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../services/api'; // Assuming we need product details for cart items

// Placeholder for a simple Progress component if not directly available
// You might need to add this to components/ui/progress.tsx if not using an external library
const ProgressComponent: React.FC<{ value: number }> = ({ value }) => {
  return (
    <div className="relative pt-1">
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-amber-100">
        <div
          style={{ width: `${value}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500 transition-all duration-500"
        ></div>
      </div>
    </div>
  );
};

interface CartItemData {
  productId: string;
  quantity: number;
}

interface ProductData {
  _id: string;
  name_en: string;
  name_he: string;
  images: string[];
  price: number;
  countInStock: number;
}

interface EnrichedCartItem {
  productId: string;
  name_en: string;
  name_he: string;
  image: string;
  price: number;
  quantity: number;
  countInStock: number;
}

// Simulated fetch function for cart items
const fetchCartItems = async (): Promise<CartItemData[]> => {
  return [
    { productId: '60c72b2f9f1b2c001c8e4d2a', quantity: 1 }, // Example product ID
    { productId: '60c72b2f9f1b2c001c8e4d2b', quantity: 2 }, // Example product ID
  ];
};

const Cart: React.FC = () => {
  const { t, language, getLocalizedField } = useLanguage();

  // Fetch initial cart item data (just product IDs and quantities)
  const { data: cartItemData = [], isLoading: isLoadingCartData } = useQuery({
    queryKey: ['cartItemsData'],
    queryFn: fetchCartItems,
  });

  // Fetch product details for each item in the cart
  const productQueries = cartItemData.map((item) => {
    return useQuery({
      queryKey: ['product', item.productId],
      queryFn: () => getProductById(item.productId),
      enabled: !!item.productId,
    });
  });

  const isLoadingProducts = productQueries.some((query) => query.isLoading);
  const products = productQueries.map((query) => query.data).filter(Boolean) as ProductData[];

  const cartItems: EnrichedCartItem[] = cartItemData.map((cartEntry) => {
    const product = products.find((p) => p._id === cartEntry.productId);
    if (product) {
      return {
        productId: product._id,
        name_en: product.name_en,
        name_he: product.name_he,
        image: product.images[0],
        price: product.price,
        quantity: cartEntry.quantity,
        countInStock: product.countInStock,
      };
    }
    return null;
  }).filter(Boolean) as EnrichedCartItem[];

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const shippingCost = subtotal >= 500 ? 0 : 50; // Free shipping over ₪500
  const estimatedTax = subtotal * 0.17; // Assuming 17% tax
  const total = subtotal + shippingCost + estimatedTax;

  const handleQuantityChange = (productId: string, change: number) => {
    // In a real app, this would be a mutation to update the backend cart
    console.log(`Changing quantity for ${productId} by ${change}`);
    // For now, we'll just log and not update the state managed by useQuery directly
  };

  const handleRemoveItem = (productId: string) => {
    // In a real app, this would be a mutation to remove from the backend cart
    console.log(`Removing item ${productId}`);
  };

  const freeShippingThreshold = 500;
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (isLoadingCartData || isLoadingProducts) {
    return <div>Loading cart...</div>;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-5xl font-serif text-stone-900 text-center mb-8">
        {t('cart.shoppingBag')}
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-stone-700 mb-6">{t('cart.emptyBag')}</p>
          <Link to="/products">
            <Button>{t('cart.continueShopping')}</Button>
          </Link>
          {/* Sign-in prompt for authenticated users */}
          <p className="text-stone-500 mt-4">{t('cart.signInPrompt')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <Card key={item.productId} className="flex items-center p-4">
                <img
                  src={item.image}
                  alt={getLocalizedField(item, 'name')}
                  className="w-24 h-24 object-cover rounded-md mr-4 bg-white"
                />
                <div className="flex-grow">
                  <Link to={`/product/${item.productId}`} className="text-xl font-semibold text-stone-900 hover:text-amber-700">
                    {getLocalizedField(item, 'name')}
                  </Link>
                  <p className="text-stone-600">₪{item.price.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.productId, -1)} disabled={item.quantity <= 1}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 text-lg">{item.quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.productId, 1)} disabled={item.quantity >= item.countInStock}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.productId)} className="text-stone-500 hover:text-red-500">
                  <X className="h-5 w-5" />
                </Button>
              </Card>
            ))}
          </div>

          {/* Right Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-2xl font-serif text-stone-900 mb-6">
                {t('cart.orderSummary')}
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-stone-700">
                  <span>{t('cart.subtotal')}</span>
                  <span>₪{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-700">
                  <span>{t('cart.shipping')}</span>
                  <span>{shippingCost === 0 ? t('productDetail.freeShipping') : `₪${shippingCost.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-stone-700">
                  <span>{t('cart.estimatedTax')}</span>
                  <span>₪{estimatedTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between font-bold text-xl text-stone-900 border-t pt-4 mt-4">
                  <span>{t('cart.total')}</span>
                  <span>₪{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {shippingCost !== 0 && (
                <div className="mt-6">
                  <p className="text-sm text-stone-600 mb-2">
                    {t('cart.freeShippingProgress', { amount: freeShippingThreshold - subtotal })}
                  </p>
                  <ProgressComponent value={shippingProgress} />
                </div>
              )}

              <Button className="w-full mt-6" size="lg">
                <Link to="/checkout">{t('cart.proceedToCheckout')}</Link>
              </Button>
              <p className="text-center text-sm text-stone-500 mt-3 flex items-center justify-center">
                {/* Lock icon for secure checkout */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2h2a2 2 0 012 2v5a2 2 0 01-2 2H3a2 2 0 01-2-2v-5a2 2 0 012-2h2zm8-2V7a3 3 0 10-6 0v2h6z" clipRule="evenodd" />
                </svg>
                {t('cart.secureCheckout')}
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;