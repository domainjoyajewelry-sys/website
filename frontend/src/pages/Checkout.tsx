import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { CheckCircle2, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

const Checkout: React.FC = () => {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Placeholder cart items
  const cartItems = [
    {
      productId: '1',
      name_en: 'Diamond Solitaire Ring',
      name_he: 'טבעת סוליטר יהלום',
      image: 'https://images.unsplash.com/photo-1563833215286-9b6264d1f2b3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      price: 5400,
      quantity: 1,
    },
    {
      productId: '2',
      name_en: 'Emerald Cut Necklace',
      name_he: 'שרשרת אמרלד קאט',
      image: 'https://images.unsplash.com/photo-1588147171929-c8c36e4f3f4c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      price: 3200,
      quantity: 2,
    },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const shippingCost = subtotal >= 500 ? 0 : 50;
  const estimatedTax = subtotal * 0.17;
  const total = subtotal + shippingCost + estimatedTax;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    // Simulate API call
    setTimeout(() => {
      setIsOrderPlaced(true);
      setOrderNumber('JOY' + Math.floor(Math.random() * 1000000));
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 1000);
  };

  const steps = ['shippingInfo', 'payment', 'review'];

  if (isOrderPlaced) {
    return (
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-5xl font-serif text-stone-900 mb-4">{t('checkout.orderSuccess')}</h1>
        <p className="text-xl text-stone-700 mb-8">
          {t('checkout.orderNumber')}: <span className="font-bold">{orderNumber}</span>
        </p>
        <Link to="/orders">
          <Button size="lg">{t('checkout.viewOrders')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-5xl font-serif text-stone-900 text-center mb-12">
        {t('checkout.checkout')}
      </h1>

      {/* Progress Indicator */}
      <div className="flex justify-between items-center mb-12 relative">
        {steps.map((stepKey, index) => (
          <React.Fragment key={stepKey}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                ${index + 1 <= currentStep ? 'bg-amber-700' : 'bg-stone-300'}`}
              >
                {index + 1}
              </div>
              <p className={`mt-2 text-sm ${index + 1 <= currentStep ? 'text-stone-900' : 'text-stone-500'}`}>
                {t(`checkout.${stepKey}`)}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-grow h-1 mx-2 ${index + 1 < currentStep ? 'bg-amber-700' : 'bg-stone-300'}`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping Info */}
          {currentStep === 1 && (
            <Card className="p-6">
              <h2 className="text-3xl font-serif text-stone-900 mb-6">{t('checkout.shippingInfo')}</h2>
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="fullName">{t('checkout.fullName')}</Label>
                    <Input id="fullName" name="fullName" value={shippingInfo.fullName} onChange={handleShippingChange} required />
                  </div>
                  <div>
                    <Label htmlFor="email">{t('checkout.email')}</Label>
                    <Input id="email" name="email" type="email" value={shippingInfo.email} onChange={handleShippingChange} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="phone">{t('checkout.phone')}</Label>
                    <Input id="phone" name="phone" value={shippingInfo.phone} onChange={handleShippingChange} />
                  </div>
                  <div>
                    <Label htmlFor="address">{t('checkout.address')}</Label>
                    <Input id="address" name="address" value={shippingInfo.address} onChange={handleShippingChange} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="city">{t('checkout.city')}</Label>
                    <Input id="city" name="city" value={shippingInfo.city} onChange={handleShippingChange} required />
                  </div>
                  <div>
                    <Label htmlFor="state">{t('checkout.state')}</Label>
                    <Input id="state" name="state" value={shippingInfo.state} onChange={handleShippingChange} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="postalCode">{t('checkout.postalCode')}</Label>
                    <Input id="postalCode" name="postalCode" value={shippingInfo.postalCode} onChange={handleShippingChange} required />
                  </div>
                  <div>
                    <Label htmlFor="country">{t('checkout.country')}</Label>
                    <Input id="country" name="country" value={shippingInfo.country} onChange={handleShippingChange} required />
                  </div>
                </div>
                <Button className="w-full" onClick={() => setCurrentStep(2)}>
                  {t('checkout.continueToPayment')}
                </Button>
              </form>
            </Card>
          )}

          {/* Step 2: Payment Method */}
          {currentStep === 2 && (
            <Card className="p-6">
              <h2 className="text-3xl font-serif text-stone-900 mb-6">{t('checkout.payment')}</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4 mb-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit_card" id="r1" />
                  <Label htmlFor="r1">{t('checkout.creditCard')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="r2" />
                  <Label htmlFor="r2">{t('checkout.paypal')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank_transfer" id="r3" />
                  <Label htmlFor="r3">{t('checkout.bankTransfer')}</Label>
                </div>
              </RadioGroup>

              {paymentMethod === 'credit_card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">{t('checkout.cardNumber')}</Label>
                    <Input id="cardNumber" type="text" placeholder="XXXX XXXX XXXX XXXX" />
                  </div>
                  <div>
                    <Label htmlFor="cardName">{t('checkout.cardName')}</Label>
                    <Input id="cardName" type="text" placeholder="Name on card" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">{t('checkout.expiry')}</Label>
                      <Input id="expiry" type="text" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">{t('checkout.cvv')}</Label>
                      <Input id="cvv" type="text" placeholder="CVV" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  {t('checkout.back')}
                </Button>
                <Button onClick={() => setCurrentStep(3)}>
                  {t('checkout.continueToReview')}
                </Button>
              </div>
            </Card>
          )}

          {/* Step 3: Review Order */}
          {currentStep === 3 && (
            <Card className="p-6">
              <h2 className="text-3xl font-serif text-stone-900 mb-6">{t('checkout.review')}</h2>
              {/* Shipping Address Display */}
              <div className="mb-6 border-b pb-4">
                <h3 className="text-xl font-semibold text-stone-900 mb-2 flex items-center justify-between">
                  {t('checkout.shippingInfo')}
                  <Button variant="link" onClick={() => setCurrentStep(1)}>
                    {t('admin.edit')}
                  </Button>
                </h3>
                <p>{shippingInfo.fullName}</p>
                <p>{shippingInfo.address}, {shippingInfo.city}</p>
                <p>{shippingInfo.state}, {shippingInfo.postalCode}, {shippingInfo.country}</p>
                <p>{shippingInfo.email}</p>
                <p>{shippingInfo.phone}</p>
              </div>

              {/* List of order items */}
              <div className="space-y-4 mb-6 border-b pb-4">
                <h3 className="text-xl font-semibold text-stone-900 mb-4">{t('checkout.orderItems')}</h3> {/* Add to translations */}
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-4">
                    <img src={item.image} alt={language === 'en' ? item.name_en : item.name_he} className="w-16 h-16 object-cover rounded-md bg-white" />
                    <div>
                      <p className="font-semibold text-stone-900">{language === 'en' ? item.name_en : item.name_he}</p>
                      <p className="text-sm text-stone-600">Qty: {item.quantity} x ₪{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-2 mb-6">
                <h3 className="text-xl font-semibold text-stone-900 mb-4">{t('cart.orderSummary')}</h3>
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
                <div className="flex justify-between font-bold text-xl text-stone-900 border-t pt-2 mt-2">
                  <span>{t('cart.total')}</span>
                  <span>₪{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  {t('checkout.back')}
                </Button>
                <Button onClick={handlePlaceOrder}>
                  {t('checkout.placeOrder')}
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Right Sidebar - Sticky Order Summary (always visible) */}
        <div className="lg:col-span-1 sticky top-24 h-fit">
          <Card className="p-6">
            <h2 className="text-2xl font-serif text-stone-900 mb-6">
              {t('cart.orderSummary')}
            </h2>
            <div className="space-y-4 mb-6 border-b pb-4">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex items-center space-x-4">
                  <img src={item.image} alt={language === 'en' ? item.name_en : item.name_he} className="w-16 h-16 object-cover rounded-md bg-white" />
                  <div>
                    <p className="font-semibold text-stone-900">{language === 'en' ? item.name_en : item.name_he}</p>
                    <p className="text-sm text-stone-600">Qty: {item.quantity} x ₪{item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
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
              <div className="flex justify-between font-bold text-xl text-stone-900 border-t pt-2 mt-2">
                <span>{t('cart.total')}</span>
                <span>₪{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
