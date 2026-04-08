import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { Filter, Search, SlidersHorizontal, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, isRTL } = useLanguage();

  const categoryFilter = searchParams.get('category') || 'All';
  const sortBy = searchParams.get('sort') || 'newest';
  const searchQuery = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const availability = searchParams.get('availability') || 'all';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let q = query(collection(db, 'products'));
        
        if (categoryFilter !== 'All') {
          q = query(q, where('categories', 'array-contains', categoryFilter));
        }

        const snapshot = await getDocs(q);
        let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

        // Filter by search query
        if (searchQuery) {
          const queryStr = searchQuery.toLowerCase();
          results = results.filter(p => 
            p.name.toLowerCase().includes(queryStr) || 
            p.description.toLowerCase().includes(queryStr) ||
            p.categories.some(c => c.toLowerCase().includes(queryStr))
          );
        }

        // Filter by price range
        if (minPrice) {
          results = results.filter(p => {
            const price = p.isOnSale && p.discountPrice ? p.discountPrice : p.price;
            return price >= parseFloat(minPrice);
          });
        }
        if (maxPrice) {
          results = results.filter(p => {
            const price = p.isOnSale && p.discountPrice ? p.discountPrice : p.price;
            return price <= parseFloat(maxPrice);
          });
        }

        // Filter by availability
        if (availability === 'in-stock') {
          results = results.filter(p => p.stock > 0);
        } else if (availability === 'out-of-stock') {
          results = results.filter(p => p.stock === 0);
        }

        // Sort results
        if (sortBy === 'price-low') results.sort((a, b) => {
          const priceA = a.isOnSale && a.discountPrice ? a.discountPrice : a.price;
          const priceB = b.isOnSale && b.discountPrice ? b.discountPrice : b.price;
          return priceA - priceB;
        });
        if (sortBy === 'price-high') results.sort((a, b) => {
          const priceA = a.isOnSale && a.discountPrice ? a.discountPrice : a.price;
          const priceB = b.isOnSale && b.discountPrice ? b.discountPrice : b.price;
          return priceB - priceA;
        });
        if (sortBy === 'rating') results.sort((a, b) => b.rating - a.rating);

        setProducts(results);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter, sortBy, searchQuery, minPrice, maxPrice, availability]);

  const categories = ['All', 'Skin Care', 'Vitamins', 'Pre-workout', 'Herbs', 'Creatine', 'Accessories'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass p-8 rounded-[32px]">
        <h1 className="text-4xl font-black dark:text-white tracking-tight">{t('shop')}</h1>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  searchParams.set('search', val);
                } else {
                  searchParams.delete('search');
                }
                setSearchParams(searchParams);
              }}
              placeholder={t('search')}
              className="w-full pl-12 pr-6 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-primary transition-all outline-none dark:text-white font-medium"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => {
              searchParams.set('sort', e.target.value);
              setSearchParams(searchParams);
            }}
            className="bg-white/50 dark:bg-black/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl px-6 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary dark:text-white appearance-none cursor-pointer"
          >
            <option value="newest">{t('newest')}</option>
            <option value="price-low">{t('price_low')}</option>
            <option value="price-high">{t('price_high')}</option>
            <option value="rating">{t('top_rated')}</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-72 space-y-8">
          <div className="glass-card p-8 space-y-8">
            {/* Categories */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 font-black text-xl dark:text-white tracking-tight">
                <Filter size={24} className="text-primary" />
                {t('categories')}
              </div>
              <div className="flex flex-wrap md:flex-col gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      searchParams.set('category', cat);
                      setSearchParams(searchParams);
                    }}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left border",
                      categoryFilter === cat
                        ? "bg-primary text-white shadow-lg shadow-primary/30 border-primary"
                        : "bg-white/50 dark:bg-black/50 text-gray-600 dark:text-gray-400 border-white/20 dark:border-white/10 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                    )}
                  >
                    {cat === 'All' ? t('all_categories') : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3 font-black text-xl dark:text-white tracking-tight">
                <SlidersHorizontal size={24} className="text-primary" />
                {t('price_range')}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Min</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) searchParams.set('minPrice', val);
                      else searchParams.delete('minPrice');
                      setSearchParams(searchParams);
                    }}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-white/50 dark:bg-black/50 border border-white/20 dark:border-white/10 rounded-xl text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) searchParams.set('maxPrice', val);
                      else searchParams.delete('maxPrice');
                      setSearchParams(searchParams);
                    }}
                    placeholder="Max"
                    className="w-full px-3 py-2 bg-white/50 dark:bg-black/50 border border-white/20 dark:border-white/10 rounded-xl text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3 font-black text-xl dark:text-white tracking-tight">
                <Box size={24} className="text-primary" />
                {t('availability')}
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'all', label: t('all_items') },
                  { id: 'in-stock', label: t('in_stock') },
                  { id: 'out-of-stock', label: t('out_of_stock') }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      searchParams.set('availability', opt.id);
                      setSearchParams(searchParams);
                    }}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left border",
                      availability === opt.id
                        ? "bg-primary text-white shadow-lg shadow-primary/30 border-primary"
                        : "bg-white/50 dark:bg-black/50 text-gray-600 dark:text-gray-400 border-white/20 dark:border-white/10 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass bg-primary/10 p-8 rounded-[32px] border-primary/20 space-y-3 relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <h3 className="font-black text-xl text-primary tracking-tight">{t('free_shipping')}</h3>
            <p className="text-sm text-primary-dark/80 leading-relaxed">{t('shipping_offer')}</p>
            <div className="pt-2">
              <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-2/3 rounded-full" />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <AnimatePresence mode="popLayout">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 space-y-4">
              <div className="text-6xl">🔍</div>
              <h3 className="text-xl font-bold dark:text-white">{t('no_products')}</h3>
              <p className="text-gray-500">{t('no_products')}</p>
              <button
                onClick={() => setSearchParams({})}
                className="text-primary font-bold hover:underline"
              >
                {t('clear_filters')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
