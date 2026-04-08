import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, limit, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { Star, ShoppingCart, ArrowLeft, ShieldCheck, Truck, RotateCcw, Plus, Minus, Zap, Box, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

const Accordion: React.FC<{ title: string; content: string }> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!content) return null;

  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-sm font-black dark:text-white uppercase tracking-widest group-hover:text-primary transition-colors">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-400 group-hover:text-primary transition-colors"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-8 markdown-body dark:text-gray-400 leading-relaxed">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');
  const { addToCart } = useCart();
  const { t, isRTL } = useLanguage();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(productData);
          setActiveImage(productData.image);
          
          // Fetch reviews
          const reviewsSnap = await getDocs(query(collection(db, 'products', id, 'reviews'), limit(5)));
          setReviews(reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Review)));

          // Fetch related products
          const firstCategory = productData.categories?.[0] || 'All';
          const relatedQuery = query(
            collection(db, 'products'),
            where('categories', 'array-contains', firstCategory),
            limit(5)
          );
          const relatedSnap = await getDocs(relatedQuery);
          setRelatedProducts(
            relatedSnap.docs
              .map(d => ({ id: d.id, ...d.data() } as Product))
              .filter(p => p.id !== id)
              .slice(0, 4)
          );
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
      <h2 className="text-2xl font-bold dark:text-white">{t('no_products')}</h2>
      <button onClick={() => navigate('/products')} className="text-primary font-bold">{t('back')}</button>
    </div>
  );

  const allImages = [product.image, ...(product.images || [])];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-20">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-3 text-gray-500 hover:text-primary transition-all font-black uppercase text-xs tracking-widest glass px-6 py-3 rounded-2xl active:scale-95"
      >
        <ArrowLeft size={18} className={cn("transition-transform", isRTL ? "rotate-180" : "group-hover:-translate-x-1")} />
        {t('back')}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-[48px] overflow-hidden glass p-4 relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full rounded-[40px] overflow-hidden shadow-inner bg-white/50 dark:bg-black/50"
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
              </motion.div>
            </AnimatePresence>
            
            {product.stock === 0 && (
              <div className="absolute inset-8 bg-black/60 backdrop-blur-md rounded-[40px] flex items-center justify-center z-10">
                <span className="bg-red-500 text-white px-8 py-4 rounded-2xl font-black text-xl uppercase tracking-widest shadow-2xl shadow-red-500/50">
                  {t('out_of_stock')}
                </span>
              </div>
            )}
          </motion.div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={cn(
                    "w-24 h-24 rounded-2xl overflow-hidden glass p-1 transition-all shrink-0",
                    activeImage === img ? "ring-2 ring-primary scale-105" : "opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {product.categories?.map(cat => (
                <div key={cat} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
                  <Zap size={14} />
                  <span>{cat}</span>
                </div>
              ))}
            </div>
            <h1 className="text-3xl md:text-6xl font-black dark:text-white leading-tight tracking-tighter">{product.name}</h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 glass px-4 py-2 rounded-2xl font-black text-sm text-yellow-500">
                <Star size={18} fill="currentColor" />
                {product.rating}
              </div>
              <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">{product.reviewsCount} {t('reviews')}</span>
              {product.stock === 0 ? (
                <span className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl border bg-red-500/10 text-red-500 border-red-500/20">
                  {t('out_of_stock')}
                </span>
              ) : isAdmin && (
                <span className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl border bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-2">
                  <Box size={12} />
                  {product.stock} {t('in_stock')}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {product.isOnSale && product.discountPrice ? (
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                  {product.discountPrice.toLocaleString()} {t('currency')}
                </span>
                <span className="text-2xl font-bold text-red-500 line-through opacity-50">
                  {product.price.toLocaleString()} {t('currency')}
                </span>
                <div className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-black uppercase tracking-widest animate-bounce">
                  {t('sale')}
                </div>
              </div>
            ) : (
              <div className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                {product.price.toLocaleString()} {t('currency')}
              </div>
            )}
          </div>

          <div className="glass p-8 rounded-[32px] border-white/10">
            <div className="markdown-body dark:text-gray-300 leading-relaxed text-lg">
              <ReactMarkdown>{product.description}</ReactMarkdown>
            </div>
          </div>

          <div className="glass px-8 rounded-[32px] border-white/10 divide-y divide-white/10">
            <Accordion title={t('suggested_usage')} content={product.suggestedUsage || ''} />
            <Accordion title={t('caution')} content={product.caution || ''} />
            <Accordion title={t('supplement_facts')} content={product.supplementFacts || ''} />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <div className="flex items-center glass rounded-[24px] p-2 border-white/10 shadow-inner">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-14 h-14 flex items-center justify-center hover:bg-primary/10 hover:text-primary rounded-2xl transition-all active:scale-90"
              >
                <Minus size={24} />
              </button>
              <span className="w-16 text-center text-2xl font-black dark:text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-14 h-14 flex items-center justify-center hover:bg-primary/10 hover:text-primary rounded-2xl transition-all active:scale-90"
              >
                <Plus size={24} />
              </button>
            </div>

            <button
              onClick={() => {
                for (let i = 0; i < quantity; i++) addToCart(product);
              }}
              disabled={product.stock === 0}
              className={cn(
                "flex-1 px-10 py-6 rounded-[24px] font-black text-xl flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-95 group",
                product.stock === 0
                  ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dark text-white shadow-primary/40"
              )}
            >
              <ShoppingCart size={28} className="transition-transform group-hover:-translate-y-1" />
              {t('add_to_cart')}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/10">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-primary">
                <ShieldCheck size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest dark:text-gray-400">{t('secure_payment')}</span>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-primary">
                <Truck size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest dark:text-gray-400">{t('fast_shipping')}</span>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-primary">
                <RotateCcw size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest dark:text-gray-400">{t('returns_30_days')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-10 pt-20 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black dark:text-white tracking-tight">{t('related_products')}</h2>
            <Link to={`/products?category=${product.categories?.[0] || 'All'}`} className="text-primary font-black uppercase text-xs tracking-widest hover:underline">{t('view_all')}</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="space-y-10 pt-20 border-t border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black dark:text-white tracking-tight">{t('customer_reviews')}</h2>
          <button className="text-primary font-black uppercase text-xs tracking-widest hover:underline">{t('write_review')}</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {reviews.length > 0 ? reviews.map(review => (
            <motion.div 
              key={review.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-10 space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
              <div className="flex items-center justify-between relative z-10">
                <h4 className="font-black text-lg dark:text-white tracking-tight">{review.userName}</h4>
                <div className="flex gap-1 text-yellow-500">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={16} fill={s <= review.rating ? "currentColor" : "none"} />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic relative z-10">"{review.comment}"</p>
              <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest pt-4 border-t border-white/10 relative z-10">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </motion.div>
          )) : (
            <p className="text-gray-500 italic text-lg">{t('no_reviews')}</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
