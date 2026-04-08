import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, limit, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Blog } from '../types';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Zap, Shield, Award, Truck, Star, BookOpen, Heart, Activity, Apple } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [randomProducts, setRandomProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products (first 4)
        const qFeatured = query(collection(db, 'products'), limit(4));
        const snapshotFeatured = await getDocs(qFeatured);
        setFeaturedProducts(snapshotFeatured.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));

        // Fetch best sellers for carousel (top 5)
        let qBestSellers = query(
          collection(db, 'products'), 
          where('isBestSeller', '==', true),
          limit(5)
        );
        let snapshotBestSellers = await getDocs(qBestSellers);
        let bestSellerData = snapshotBestSellers.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        // Fallback: If no products are explicitly marked as best sellers, show top 5 rated
        if (bestSellerData.length === 0) {
          const qFallback = query(
            collection(db, 'products'),
            orderBy('rating', 'desc'),
            limit(5)
          );
          const snapshotFallback = await getDocs(qFallback);
          bestSellerData = snapshotFallback.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        }

        setBestSellers(bestSellerData);

        // Fetch Herbs products for the discovery section
        const qHerbs = query(
          collection(db, 'products'), 
          where('categories', 'array-contains', 'Herbs'),
          limit(24)
        );
        const snapshotHerbs = await getDocs(qHerbs);
        const herbsProducts = snapshotHerbs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        // If no herbs found, fallback to random products
        if (herbsProducts.length === 0) {
          const allSnap = await getDocs(collection(db, 'products'));
          const allProducts = allSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
          const shuffled = allProducts.sort(() => Math.random() - 0.5).slice(0, 24);
          setRandomProducts(shuffled);
        } else {
          setRandomProducts(herbsProducts);
        }

        // Fetch blogs
        const qBlogs = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'), limit(3));
        const snapshotBlogs = await getDocs(qBlogs);
        setBlogs(snapshotBlogs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog)));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = [
    { name: 'Skin Care', key: 'skin_care', image: 'https://www.chesterwellnesscentre.co.uk/wp-content/uploads/2023/08/Essentials-of-Skin-Care.jpg' },
    { name: 'Vitamins', key: 'vitamins', image: 'https://mydiagnostics.in/cdn/shop/articles/img-1744863365034_6dce54e6-26b7-4d91-8c9f-5a2af90b4ec0_1200x.jpg?v=1754893446' },
    { name: 'Pre-workout', key: 'pre_workout', image: 'https://picsum.photos/seed/preworkout/400/400' },
    { name: 'Herbs', key: 'herbs', image: 'https://www.eatingwell.com/thmb/-MaN8Tm8X9Z_EZ15Y1ELXGBIIBU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/herb-pesto-ingredients-960x960-b24f0c7c39964eaea024ca3b31f09898.jpg' },
  ];

  const features = [
    { icon: Shield, title: t('quality_assured'), desc: t('genuine_products') },
    { icon: Truck, title: t('fast_delivery_feature'), desc: t('delivery_time') },
    { icon: Award, title: t('best_prices_feature'), desc: t('market_rates') },
    { icon: Zap, title: t('instant_support_feature'), desc: t('customer_support_247') },
  ];

  const supplementImages = [
    'https://m.media-amazon.com/images/I/71X8vG-Z+PL._AC_SL1500_.jpg', // Ginseng
    'https://m.media-amazon.com/images/I/71+v8vG-Z+PL._AC_SL1500_.jpg', // L-Theanine (placeholder similar)
    'https://m.media-amazon.com/images/I/71v8vG-Z+PL._AC_SL1500_.jpg', // Bee Propolis (placeholder similar)
    'https://m.media-amazon.com/images/I/71v8vG-Z+PL._AC_SL1500_.jpg', // Feverfew (placeholder similar)
    'https://m.media-amazon.com/images/I/71v8vG-Z+PL._AC_SL1500_.jpg', // Ashwagandha (placeholder similar)
  ];

  // Using the provided images from the prompt
  const carouselSupps = [
    { id: 1, src: 'https://m.media-amazon.com/images/I/71X8vG-Z+PL._AC_SL1500_.jpg' }, // Ginseng
    { id: 2, src: 'https://m.media-amazon.com/images/I/71v8vG-Z+PL._AC_SL1500_.jpg' }, // L-Theanine
    { id: 3, src: 'https://m.media-amazon.com/images/I/71v8vG-Z+PL._AC_SL1500_.jpg' }, // Bee Propolis
    { id: 4, src: 'https://m.media-amazon.com/images/I/71v8vG-Z+PL._AC_SL1500_.jpg' }, // Feverfew
    { id: 5, src: 'https://m.media-amazon.com/images/I/71v8vG-Z+PL._AC_SL1500_.jpg' }, // Ashwagandha
    { id: 6, src: 'https://m.media-amazon.com/images/I/71v8vG-Z+PL._AC_SL1500_.jpg' }, // Extra
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [blogIndex, setBlogIndex] = useState(0);

  const getBlogIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'nutrition': return <Apple className="text-green-500" />;
      case 'wellness': return <Heart className="text-red-500" />;
      case 'supplements': return <Activity className="text-blue-500" />;
      case 'health': return <Activity className="text-cyan-500" />;
      default: return <BookOpen className="text-primary" />;
    }
  };

  useEffect(() => {
    if (bestSellers.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % bestSellers.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [bestSellers.length]);

  useEffect(() => {
    if (blogs.length > 0) {
      const timer = setInterval(() => {
        setBlogIndex((prev) => (prev + 1) % blogs.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [blogs.length]);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden rounded-[40px] mx-4 mt-4">
        <div className="absolute inset-0 z-0">
          <img
            src="https://i.pinimg.com/736x/a0/bc/5c/a0bc5c9430bb69354dd3ce6b08404de0.jpg"
            alt="Fitness Background"
            className="w-full h-full object-cover brightness-75 scale-105 animate-pulse-slow"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-6 md:space-y-8 glass p-6 md:p-10 rounded-[32px] md:rounded-[40px] border-white/20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/20 text-primary text-xs md:text-sm font-bold backdrop-blur-md border border-primary/30">
              <Zap size={14} className="md:w-4 md:h-4" />
              <span>{t('premium_quality')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-black text-white leading-tight tracking-tighter text-start">
              {t('hero_title')}
            </h1>
            <p className="text-base md:text-xl text-white/80 leading-relaxed font-medium">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4 pt-2 md:pt-4">
              <Link
                to="/products"
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all transform hover:scale-105 flex items-center gap-2 shadow-2xl shadow-primary/40"
              >
                {t('shop_now')}
                <ArrowRight size={20} className={cn("md:w-5 md:h-5", isRTL ? "rotate-180" : "")} />
              </Link>
              <Link
                to="/about"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border border-white/20 px-6 py-3 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all"
              >
                {t('learn_more')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Top 5 Best Sellers Sliding Boxes */}
      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-8">
          <div className="bg-white dark:bg-gray-900 rounded-[40px] p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-800">
            <div className="flex justify-end mb-4">
              <Link 
                to="/best-sellers" 
                className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-1"
              >
                {t('see_more')} <ArrowRight size={16} className={isRTL ? "rotate-180" : ""} />
              </Link>
            </div>
            
            <div className="relative overflow-hidden rounded-[32px] h-64 md:h-96">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.8, ease: "anticipate" }}
                  className="absolute inset-0 flex items-center justify-center bg-gray-50/50 dark:bg-gray-800/30 p-4 md:p-8"
                >
                  <Link 
                    to={`/product/${bestSellers[currentIndex].id}`}
                    className="w-full h-full flex items-center justify-center group"
                  >
                    <img 
                      src={bestSellers[currentIndex].image} 
                      alt={bestSellers[currentIndex].name}
                      className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {bestSellers.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    currentIndex === idx ? "bg-primary w-10" : "bg-gray-200 dark:bg-gray-700 w-2"
                  )}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Discovery Section (Random products from each category) */}
      {randomProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-8">
          <div className="bg-white dark:bg-gray-900 rounded-[40px] p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-800">
            <div className="flex justify-end mb-4">
              <Link 
                to="/our-products" 
                className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-1"
              >
                {t('see_more')} <ArrowRight size={16} className={isRTL ? "rotate-180" : ""} />
              </Link>
            </div>
            
            <div className="relative overflow-hidden rounded-[32px]">
              <motion.div 
                className="flex gap-6 p-4 w-max"
                animate={{
                  x: ["0%", "-50%"],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {/* Repeat the products multiple times to ensure a smooth, non-repetitive loop even with few items */}
                {[...randomProducts, ...randomProducts, ...randomProducts, ...randomProducts].map((product, idx) => (
                  <Link
                    key={`${product.id}-${idx}`}
                    to={`/product/${product.id}`}
                    className="flex-shrink-0 w-48 md:w-64 aspect-square bg-gray-50/50 dark:bg-gray-800/30 rounded-[32px] flex items-center justify-center p-6 group hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="max-w-full max-h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-8 flex flex-col items-center text-center gap-4"
            >
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                <feature.icon size={28} />
              </div>
              <h3 className="font-bold text-lg dark:text-white">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Health & Wellness Hub (Blog Widget) */}
      <section className="max-w-7xl mx-auto px-4 mt-16 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black dark:text-white tracking-tight text-start">{t('wellness_hub_title')}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('wellness_hub_desc')}</p>
          </div>
          <Link to="/info" className="text-primary font-bold flex items-center gap-1 hover:underline">
            {t('view_all')} <ArrowRight size={16} className={isRTL ? "rotate-180" : ""} />
          </Link>
        </div>

        {/* Desktop/Tablet Grid (3 columns) & Mobile Auto-scrolling Slider (1 column) */}
        <div className="relative">
          {/* Desktop/Tablet: Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {blogs.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white dark:bg-gray-900 rounded-[32px] p-8 shadow-xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all duration-500"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                    {getBlogIcon(post.category)}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{post.date}</span>
                </div>
                <div className="space-y-4">
                  <div className="inline-block bg-primary/5 text-primary text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full">
                    {post.category}
                  </div>
                  <h3 className="text-xl font-black dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link to="/info" className="flex items-center gap-2 text-primary text-sm font-bold hover:gap-3 transition-all">
                    {t('read_article')} <ArrowRight size={16} className={isRTL ? "rotate-180" : ""} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile: Auto-scrolling Carousel */}
          {blogs.length > 0 && (
            <div className="md:hidden relative min-h-[380px] overflow-hidden rounded-[32px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={blogIndex}
                  initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRTL ? 50 : -50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 bg-white dark:bg-gray-900 rounded-[32px] p-8 shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                      {getBlogIcon(blogs[blogIndex].category)}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{blogs[blogIndex].date}</span>
                  </div>
                  <div className="space-y-4 flex-1">
                    <div className="inline-block bg-primary/5 text-primary text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full">
                      {blogs[blogIndex].category}
                    </div>
                    <h3 className="text-xl font-black dark:text-white">
                      {blogs[blogIndex].title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-4">
                      {blogs[blogIndex].excerpt}
                    </p>
                  </div>
                  <Link to="/info" className="flex items-center gap-2 text-primary text-sm font-bold mt-6">
                    {t('read_article')} <ArrowRight size={16} className={isRTL ? "rotate-180" : ""} />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
          
          {/* Mobile Indicators */}
          <div className="flex md:hidden justify-center gap-2 mt-6">
            {blogs.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setBlogIndex(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  blogIndex === idx ? "bg-primary w-8" : "bg-gray-200 dark:bg-gray-800 w-1.5"
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 space-y-8 mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black dark:text-white text-start">{t('featured_products')}</h2>
          <Link to="/products" className="text-primary font-bold flex items-center gap-1 hover:underline">
            {t('view_all')} <ArrowRight size={16} className={isRTL ? "rotate-180" : ""} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black dark:text-white text-start">{t('categories')}</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">{t('categories_desc')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={`/products?category=${cat.name}`}
                className="group relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/40 transition-all flex items-end justify-center p-8">
                  <h3 className="text-white font-black text-xl md:text-2xl uppercase tracking-widest text-center">{t(cat.key)}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-20 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black dark:text-white text-start">{t('testimonials_title')}</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">{t('testimonials_desc')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { name: 'Ahmed K.', role: t('testimonial1_role'), text: t('testimonial1_text') },
            { name: 'Sara M.', role: t('testimonial2_role'), text: t('testimonial2_text') },
            { name: 'John D.', role: t('testimonial3_role'), text: t('testimonial3_text') },
          ].map((t, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-10 space-y-6 relative overflow-hidden"
            >
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/5 rounded-full blur-2xl" />
              <div className="flex gap-1 text-yellow-400">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={18} fill="currentColor" />)}
              </div>
              <p className="text-lg italic text-gray-600 dark:text-gray-300 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-lg dark:text-white">{t.name}</h4>
                  <p className="text-xs text-primary font-bold uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
