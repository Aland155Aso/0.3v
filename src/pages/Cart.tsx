import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, User, Phone, MapPin, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

const CITIES = [
  { id: 'sulaymaniyah', name: 'Sulaymaniyah', name_ku: 'سلێمانی', fee: 3000 },
  { id: 'hawler', name: 'Hawler', name_ku: 'هەولێر', fee: 5000 },
  { id: 'duhok', name: 'Duhok', name_ku: 'دهۆک', fee: 5000 },
  { id: 'zakho', name: 'Zakho', name_ku: 'زاخۆ', fee: 5000 },
  { id: 'halabja', name: 'Halabja', name_ku: 'هەڵەبجە', fee: 5000 },
  { id: 'qaladzya', name: 'Qaladzya', name_ku: 'قەڵادزیە', fee: 5000 },
  { id: 'darbandikhan', name: 'Darbandikhan', name_ku: 'دەربەندیخان', fee: 5000 },
  { id: 'kalar', name: 'Kalar', name_ku: 'کەلار', fee: 5000 },
  { id: 'chamchamal', name: 'Chamchamal', name_ku: 'چەمچەماڵ', fee: 5000 },
  { id: 'kifri', name: 'Kifri', name_ku: 'کفری', fee: 5000 },
];

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { t, isRTL, language } = useLanguage();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    cityId: ''
  });

  const selectedCity = CITIES.find(c => c.id === customerInfo.cityId);
  const deliveryFee = selectedCity ? selectedCity.fee : 0;
  const finalTotal = totalPrice + deliveryFee;

  const handleOrder = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.cityId) {
      toast.error(language === 'ku' ? 'تکایە هەموو زانیارییەکان پڕ بکەرەوە' : 'Please fill in all information');
      return;
    }

    const cityName = language === 'en' ? selectedCity?.name : selectedCity?.name_ku;
    const productList = cart.map(item => {
      return `${item.name} (x${item.quantity})`;
    }).join(', ');
    
    const message = `Order from ${customerInfo.name} from ${cityName}, ${customerInfo.address}
Price with delivery is ${finalTotal.toLocaleString()} IQD
Phone number: ${customerInfo.phone}
Products ordered: ${productList}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/9647722376747?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 glass rounded-full flex items-center justify-center mx-auto text-primary shadow-2xl shadow-primary/20"
        >
          <ShoppingBag size={56} />
        </motion.div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black dark:text-white tracking-tight">{t('empty_cart')}</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-lg leading-relaxed">
            {t('empty_cart_desc')}
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-primary/30 active:scale-95"
        >
          {t('shop_now')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <h1 className="text-3xl md:text-5xl font-black dark:text-white tracking-tight">{t('cart')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-6 glass-card p-6"
              >
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-white/50 dark:bg-black/50 shrink-0 border border-white/20 dark:border-white/10">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <h3 className="font-black text-xl text-gray-900 dark:text-white truncate tracking-tight">{item.name}</h3>
                  <p className="text-[10px] text-primary uppercase font-black tracking-widest truncate">{item.categories?.join(', ')}</p>
                      <div className="flex flex-col">
                        {item.isOnSale && item.discountPrice ? (
                          <>
                            <span className="text-xs text-red-500 line-through font-bold opacity-60">
                              {item.price.toLocaleString()} {t('currency')}
                            </span>
                            <span className="text-2xl font-black text-primary">
                              {item.discountPrice.toLocaleString()} {t('currency')}
                            </span>
                          </>
                        ) : (
                          <div className="text-2xl font-black text-primary">{item.price.toLocaleString()} {t('currency')}</div>
                        )}
                      </div>
                </div>

                <div className="flex flex-col items-end gap-6">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                  >
                    <Trash2 size={20} />
                  </button>
                  
                  <div className="flex items-center bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-2xl p-1.5 border border-white/20 dark:border-white/10 shadow-inner">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-primary/10 hover:text-primary rounded-xl transition-all active:scale-90"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-10 text-center text-lg font-black dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-primary/10 hover:text-primary rounded-xl transition-all active:scale-90"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="space-y-8">
          <div className="glass-card p-10 space-y-8 sticky top-24">
            <h2 className="text-2xl font-black dark:text-white tracking-tight">{t('customer_info')}</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <User size={14} /> {t('customer_name')}
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all"
                  placeholder={t('customer_name')}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Phone size={14} /> {t('customer_phone')}
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all"
                  placeholder="+964 0770 000 0000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Building2 size={14} /> {t('select_city')}
                </label>
                <select
                  value={customerInfo.cityId}
                  onChange={e => setCustomerInfo({ ...customerInfo, cityId: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all appearance-none"
                >
                  <option value="">{t('select_city')}</option>
                  {CITIES.map(city => (
                    <option key={city.id} value={city.id}>
                      {language === 'en' ? city.name : city.name_ku} ({city.fee.toLocaleString()} {t('currency')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={14} /> {t('customer_address')}
                </label>
                <textarea
                  rows={2}
                  value={customerInfo.address}
                  onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all resize-none"
                  placeholder={t('customer_address')}
                />
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 space-y-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-400 font-medium">
                <span>{t('items_total')}</span>
                <span className="font-bold text-gray-900 dark:text-white">{totalPrice.toLocaleString()} {t('currency')}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400 font-medium">
                <span>{t('delivery_fee')}</span>
                <span className={cn("font-black", deliveryFee === 0 ? "text-green-500" : "text-gray-900 dark:text-white")}>
                  {deliveryFee === 0 ? t('free') : `${deliveryFee.toLocaleString()} ${t('currency')}`}
                </span>
              </div>
              <div className="pt-4 flex justify-between items-center">
                <span className="font-black text-xl dark:text-white">{t('total')}</span>
                <span className="font-black text-3xl text-primary tracking-tighter">{finalTotal.toLocaleString()} {t('currency')}</span>
              </div>
            </div>

            <button
              onClick={handleOrder}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-green-500/40 transition-all active:scale-95 group"
            >
              {t('order')}
              <ArrowRight size={24} className={cn("transition-transform group-hover:translate-x-1", isRTL && "rotate-180 group-hover:-translate-x-1")} />
            </button>
            
            <div className="glass bg-white/5 p-6 rounded-2xl border-white/10">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center uppercase font-bold tracking-widest leading-relaxed">
                {t('cart_footer_badges')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
