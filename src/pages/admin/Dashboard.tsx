import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Product, Blog } from '../../types';
import { Plus, Edit, Trash2, Search, LogOut, Package, ExternalLink, FileText, Layout } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'products' | 'blogs'>((location.state as any)?.tab || 'products');
  const [products, setProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(results);
      if (activeTab === 'products') setLoading(false);
    });

    const unsubBlogs = onSnapshot(collection(db, 'blogs'), (snapshot) => {
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog));
      setBlogs(results);
      if (activeTab === 'blogs') setLoading(false);
    });

    return () => {
      unsubProducts();
      unsubBlogs();
    };
  }, [activeTab]);

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        toast.success('Product deleted');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteDoc(doc(db, 'blogs', id));
        toast.success('Blog deleted');
      } catch (error) {
        toast.error('Failed to delete blog');
      }
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/admin/login');
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
              <Layout size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black dark:text-white">Admin Dashboard</h1>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Bio Supplements</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-bold text-gray-500 hover:text-primary flex items-center gap-1">
              View Site <ExternalLink size={14} />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Tab Switcher */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('products')}
            className={cn(
              "px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
              activeTab === 'products' 
                ? "bg-white dark:bg-gray-800 text-primary shadow-sm" 
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            )}
          >
            <Package size={18} />
            Products
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={cn(
              "px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
              activeTab === 'blogs' 
                ? "bg-white dark:bg-gray-800 text-primary shadow-sm" 
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            )}
          >
            <FileText size={18} />
            Blogs
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all shadow-sm"
            />
          </div>

          <Link
            to={activeTab === 'products' ? "/admin/products/new" : "/admin/blogs/new"}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/30 transition-all active:scale-95"
          >
            <Plus size={20} />
            Add New {activeTab === 'products' ? 'Product' : 'Blog'}
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {activeTab === 'products' ? (
                filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex gap-4 group"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{product.name}</h3>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest truncate">{product.categories?.join(', ')}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-black text-lg dark:text-white">${product.price.toFixed(2)}</span>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-primary rounded-xl transition-colors"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-red-500 rounded-xl transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                filteredBlogs.map((blog) => (
                  <motion.div
                    key={blog.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex gap-4 group"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                      <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{blog.title}</h3>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest truncate">{blog.category}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{blog.date}</span>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/blogs/edit/${blog.id}`}
                            className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-primary rounded-xl transition-colors"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-red-500 rounded-xl transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        )}

        {!loading && ((activeTab === 'products' && filteredProducts.length === 0) || (activeTab === 'blogs' && filteredBlogs.length === 0)) && (
          <div className="text-center py-20 space-y-4">
            <div className="text-6xl">{activeTab === 'products' ? '📦' : '📝'}</div>
            <h3 className="text-xl font-bold dark:text-white">No {activeTab} found</h3>
            <p className="text-gray-500">Try adjusting your search query.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
