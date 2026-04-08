import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Box, Percent, TrendingUp, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const { t, isRTL } = useLanguage();
  const { isAdmin } = useAuth();

  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity === 0) {
      addToCart(product);
    } else {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 0) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card overflow-hidden group flex flex-col h-full"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden m-2 rounded-2xl shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
        />
        <div className="absolute top-3 right-3 glass px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold z-10">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="dark:text-white">{product.rating}</span>
        </div>
        
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.isBestSeller && (
            <div className="bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-yellow-500/30">
              <TrendingUp size={10} />
              {t('best_seller')}
            </div>
          )}
          {product.isOnSale && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/30">
              <Percent size={10} />
              {t('sale')}
            </div>
          )}
        </div>

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest">
              {t('out_of_stock')}
            </span>
          </div>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-wrap gap-1">
            {product.categories?.slice(0, 2).map(cat => (
              <div key={cat} className="bg-primary/5 text-primary text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border border-primary/10">
                {cat}
              </div>
            ))}
            {(product.categories?.length || 0) > 2 && (
              <div className="bg-gray-100 dark:bg-gray-800 text-gray-400 text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full">
                +{product.categories!.length - 2}
              </div>
            )}
          </div>
          {isAdmin && (
            <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <Box size={10} />
              {product.stock}
            </div>
          )}
        </div>
        <Link to={`/product/${product.id}`} className="block mb-2">
          <h3 className="font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 text-base tracking-tight leading-tight min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4">
          {product.description}
        </p>

        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10">
            <div className="flex flex-col">
              {product.isOnSale && product.discountPrice ? (
                <>
                  <span className="text-[10px] text-red-500 line-through font-bold opacity-60">
                    {product.price.toLocaleString()}
                  </span>
                  <span className="text-lg sm:text-xl font-black text-primary leading-tight">
                    {product.discountPrice.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-lg sm:text-xl font-black text-primary leading-tight">
                  {product.price.toLocaleString()}
                </span>
              )}
              <span className="text-xs sm:text-sm font-black text-primary uppercase tracking-wider">{t('currency')}</span>
            </div>

            <div className="flex-shrink-0 flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-0.5 gap-1 border border-gray-200 dark:border-gray-700 shadow-inner">
              <button
                onClick={handleIncrement}
                disabled={product.stock === 0}
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center transition-all active:scale-90",
                  product.stock === 0
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-primary text-white shadow-lg shadow-primary/30"
                )}
              >
                <Plus size={12} />
              </button>
              <span className="font-black text-xs min-w-[14px] text-center dark:text-white">{quantity}</span>
              <button
                onClick={handleDecrement}
                disabled={quantity === 0}
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center transition-all active:scale-90 border",
                  quantity === 0
                    ? "bg-gray-50 dark:bg-gray-900 text-gray-300 dark:text-gray-700 border-gray-100 dark:border-gray-800 cursor-not-allowed"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-white border-gray-200 dark:border-gray-600 shadow-sm"
                )}
              >
                <Minus size={12} />
              </button>
            </div>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="w-full py-3 rounded-2xl border border-primary/20 text-primary font-black text-center hover:bg-primary/5 transition-all block text-sm uppercase tracking-widest active:scale-[0.98]"
          >
            {t('more_info')}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
