import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Tag, ShoppingBag, Package, Leaf, Heart, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

interface CategoryPageProps {
  type: 'best-seller' | 'on-sale' | 'supplements' | 'herbs' | 'healthy-lifestyle' | 'all';
}

const CategoryPage: React.FC<CategoryPageProps> = ({ type }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, isRTL } = useLanguage();

  const getPageConfig = () => {
    switch (type) {
      case 'best-seller':
        return {
          title: t('best_seller'),
          description: 'Our most loved and highly-rated products by the community.',
          icon: Star,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
        };
      case 'on-sale':
        return {
          title: t('on_sale'),
          description: 'Premium supplements at unbeatable prices. Limited time offers.',
          icon: Tag,
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
        };
      case 'supplements':
        return {
          title: t('supplements'),
          description: 'Essential nutrients to support your daily health and performance.',
          icon: Package,
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
        };
      case 'herbs':
        return {
          title: t('herbs'),
          description: 'Pure, plant-based extracts for holistic wellness and vitality.',
          icon: Leaf,
          color: 'text-emerald-500',
          bgColor: 'bg-emerald-500/10',
        };
      case 'healthy-lifestyle':
        return {
          title: t('healthy_lifestyle'),
          description: 'Everything you need to maintain a balanced and active life.',
          icon: Heart,
          color: 'text-rose-500',
          bgColor: 'bg-rose-500/10',
        };
      default:
        return {
          title: t('our_products'),
          description: 'Explore our complete range of premium health supplements.',
          icon: ShoppingBag,
          color: 'text-primary',
          bgColor: 'bg-primary/10',
        };
    }
  };

  const config = getPageConfig();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let q = query(collection(db, 'products'));

        if (type === 'best-seller') {
          q = query(q, where('isBestSeller', '==', true), limit(20));
        } else if (type === 'supplements') {
          q = query(q, where('categories', 'array-contains', 'Supplements'));
        } else if (type === 'herbs') {
          q = query(q, where('categories', 'array-contains', 'Herbs'));
        } else if (type === 'healthy-lifestyle') {
          // Combination of Vitamins and Supplements
          q = query(q, where('categories', 'array-contains-any', ['Vitamins', 'Supplements']));
        } else if (type === 'on-sale') {
          // For now, let's just show products under $30 as "on sale" or filter by a field if we add it
          q = query(q, where('price', '<', 30));
        }

        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(results);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-[40px] glass p-12 md:p-20 border-white/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-20 -mb-20" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn("w-20 h-20 rounded-[24px] flex items-center justify-center shadow-2xl", config.bgColor, config.color)}
          >
            <config.icon size={40} strokeWidth={2.5} />
          </motion.div>
          
          <div className="space-y-4 max-w-2xl">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black dark:text-white tracking-tighter leading-tight"
            >
              {config.title}
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed"
            >
              {config.description}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black dark:text-white tracking-tight">
            {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
          </h2>
          <Link to="/products" className="text-primary font-bold flex items-center gap-2 hover:underline">
            {t('view_all')} <ArrowRight size={18} className={isRTL ? "rotate-180" : ""} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-[32px]" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-32 glass rounded-[40px] border-dashed border-2 border-white/20">
            <div className="text-6xl mb-6">📦</div>
            <h3 className="text-2xl font-black dark:text-white mb-2">No products in this category</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8">We're currently updating our stock. Check back soon!</p>
            <Link
              to="/products"
              className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform inline-block"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;
