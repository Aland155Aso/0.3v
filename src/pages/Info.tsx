import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Heart, Activity, Apple, Info as InfoIcon, ArrowRight, X, Calendar, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Blog } from '../types';
import Markdown from 'react-markdown';

const Info: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog));
      setBlogs(results);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'nutrition': return <Apple className="text-green-500" />;
      case 'wellness': return <Heart className="text-red-500" />;
      case 'supplements': return <Activity className="text-blue-500" />;
      case 'health': return <Activity className="text-cyan-500" />;
      default: return <BookOpen className="text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold"
          >
            <InfoIcon size={16} />
            {t('wellness_hub_title')}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black dark:text-white tracking-tight"
          >
            {t('knowledge_title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg"
          >
            {t('knowledge_desc')}
          </motion.p>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-[32px]" />
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white dark:bg-gray-900 rounded-[32px] overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all duration-500 flex flex-col"
              >
                <div className="aspect-[2/1] overflow-hidden relative">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2">
                    {getIcon(post.category)}
                    <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">{post.category}</span>
                  </div>
                </div>
                <div className="p-8 space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{post.date}</span>
                  </div>
                  <h3 className="text-2xl font-black dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="pt-4 mt-auto">
                    <button 
                      onClick={() => setSelectedBlog(post)}
                      className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
                    >
                      {t('read_article')} <ArrowRight size={18} className={isRTL ? "rotate-180" : ""} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-4">
            <div className="text-6xl">📝</div>
            <h3 className="text-xl font-bold dark:text-white">{t('no_articles')}</h3>
            <p className="text-gray-500">{t('no_articles')}</p>
          </div>
        )}

        {/* Blog Modal */}
        <AnimatePresence>
          {selectedBlog && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedBlog(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
              >
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="absolute top-6 right-6 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all"
                >
                  <X size={24} />
                </button>

                <div className="overflow-y-auto no-scrollbar">
                  <div className="aspect-[21/9] w-full relative">
                    <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                          <Tag size={14} /> {selectedBlog.category}
                        </div>
                        <div className="text-white/80 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                          <Calendar size={14} /> {selectedBlog.date}
                        </div>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                        {selectedBlog.title}
                      </h2>
                    </div>
                  </div>

                  <div className="p-8 md:p-12">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <div className="markdown-body">
                        <Markdown>{selectedBlog.content}</Markdown>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary rounded-[40px] p-8 md:p-16 text-center text-white space-y-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />
          
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">{t('stay_updated')}</h2>
            <p className="text-white/80 max-w-xl mx-auto text-lg">
              {t('newsletter_desc')}
            </p>
            <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto pt-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-md"
              />
              <button className="bg-white text-primary font-black px-8 py-4 rounded-2xl hover:scale-105 transition-transform">
                {t('subscribe')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Info;
