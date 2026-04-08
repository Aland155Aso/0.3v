import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingCart, ArrowRight, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const CartBar: React.FC = () => {
  const { totalItems, totalPrice } = useCart();
  const { isRTL, t } = useLanguage();

  const whatsappNumber = "9647500000000"; // Placeholder, should be from config
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-20 md:top-24 left-4 right-4 z-[60]"
        >
          <div className="flex items-center gap-3 max-w-7xl mx-auto">
            {/* WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 active:scale-90 transition-transform"
            >
              <MessageCircle size={28} fill="currentColor" />
            </a>

            {/* Cart Bar */}
              <Link
                to="/cart"
                className="flex-1 bg-primary text-white h-14 rounded-3xl flex items-center justify-between px-6 shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-2">
                  <ArrowRight size={20} className={isRTL ? "rotate-180" : ""} />
                  <span className="font-black text-sm uppercase tracking-tight">{t('buy_items')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-black text-lg">{totalPrice.toLocaleString()}</span>
                  <span className="text-[10px] font-bold uppercase">{t('currency')}</span>
                </div>
              </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartBar;
