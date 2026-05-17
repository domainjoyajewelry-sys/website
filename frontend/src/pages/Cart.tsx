import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Plus, Minus, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Cart: React.FC = () => {
  const { t, language, getLocalizedField } = useLanguage();
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();

  const shippingCost = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-10">
            <ShoppingBag className="w-10 h-10 text-zinc-300" />
          </div>
          <h1 className="text-4xl font-serif uppercase tracking-widest mb-6">{t('cart.emptyBag')}</h1>
          <p className="text-zinc-400 uppercase tracking-[0.3em] text-[10px] mb-12">Your collection awaits its first piece</p>
          <Link to="/products">
            <Button className="bg-black text-white rounded-none px-12 py-8 uppercase tracking-[0.3em] font-bold hover:bg-zinc-800 transition-all">
              {t('cart.continueShopping')}
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-40 pb-20 px-6">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col items-center mb-24">
          <span className="text-[10px] uppercase tracking-[1em] text-zinc-400 mb-6 font-serif opacity-70">
             Your Selection
          </span>
          <h1 className="text-5xl md:text-7xl font-serif uppercase tracking-[0.1em] font-medium text-black">
            {t('cart.shoppingBag')}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-12">
            {cartItems.map((item) => (
              <motion.div 
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-10 pb-12 border-b border-zinc-100 group"
              >
                <Link to={`/product/${item.productId}`} className="w-full sm:w-48 aspect-[3/4] overflow-hidden bg-zinc-50 border border-zinc-100 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                </Link>

                <div className="flex flex-col flex-grow py-2">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-serif uppercase tracking-widest mb-2">
                        {language === 'he' ? item.name_he : item.name}
                      </h3>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-400">Premium Jewelry</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="text-zinc-300 hover:text-black transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-auto flex justify-between items-end">
                    <div className="flex items-center border border-zinc-100 p-1">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-black transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-12 text-center text-sm font-bold font-serif">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-black transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <p className="text-xl font-body italic font-bold">₪{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-zinc-50 p-12 sticky top-40 border border-zinc-100">
              <h2 className="text-2xl font-serif uppercase tracking-widest mb-12 border-b border-zinc-200 pb-8 text-black">
                {t('cart.orderSummary')}
              </h2>

              <div className="space-y-6 mb-12">
                <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold text-zinc-500">
                  <span>{t('cart.subtotal')}</span>
                  <span className="text-black">₪{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold text-zinc-500">
                  <span>{t('cart.shipping')}</span>
                  <span className="text-black">{shippingCost === 0 ? (language === 'he' ? 'חינם' : 'FREE') : `₪${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-2xl font-serif pt-8 border-t border-zinc-200 text-black tracking-widest mt-8">
                  <span className="uppercase">{t('cart.total')}</span>
                  <span className="font-bold">₪{total.toLocaleString()}</span>
                </div>
              </div>

              <Link to="/checkout">
                <Button className="w-full bg-black text-white hover:bg-zinc-800 transition-all duration-500 rounded-none py-10 text-[11px] uppercase tracking-[0.4em] font-bold flex items-center justify-center gap-4">
                  {t('cart.proceedToCheckout')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <div className="mt-10 pt-10 border-t border-zinc-200 flex flex-col gap-6">
                 <div className="flex items-center gap-4 text-zinc-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-200"></div>
                    <p className="text-[9px] uppercase tracking-widest leading-loose">Complimentary gift wrapping included</p>
                 </div>
                 <div className="flex items-center gap-4 text-zinc-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-200"></div>
                    <p className="text-[9px] uppercase tracking-widest leading-loose">Authenticity certificate provided</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;