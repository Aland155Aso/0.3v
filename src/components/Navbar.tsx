import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Globe, ShoppingCart, Moon, Sun, Home, ShoppingBag, Info, Phone, Star, Tag, Leaf, Heart, Package, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import { Language } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { totalItems } = useCart();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const desktopNavItems = [
    { name: 'home', path: '/' },
    { name: 'shop', path: '/products' },
    { name: 'info', path: '/info' },
    { name: 'about', path: '/about' },
    { name: 'contact', path: '/contact' },
  ];

  const mobileNavItems = [
    { name: 'info', path: '/info', icon: BookOpen },
    { name: 'search', path: '/products', icon: Search },
    { name: 'home', path: '/', icon: Home },
    { name: 'cart', path: '/cart', icon: ShoppingCart },
    { name: 'contact', path: '/contact', icon: Phone },
  ];

  const menuItems = [
    { name: 'best_seller', path: '/best-sellers', icon: Star },
    { name: 'our_products', path: '/our-products', icon: ShoppingBag },
    { name: 'on_sale', path: '/on-sale', icon: Tag },
    { name: 'supplements', path: '/supplements', icon: Package },
    { name: 'herbs', path: '/herbs', icon: Leaf },
    { name: 'healthy_lifestyle', path: '/healthy-lifestyle', icon: Heart },
    { name: 'info', path: '/info', icon: BookOpen },
    { name: 'about', path: '/about', icon: Info },
  ];

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'ku', name: 'Kurdish (کوردی)' },
    { code: 'ar', name: 'Arabic (العربية)' },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav hidden md:block">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="bg-primary text-white px-2 py-1 rounded-xl shadow-lg shadow-primary/20">Bio</span>
            <span className="dark:text-white tracking-tight">Supplements</span>
          </Link>

          <div className="flex items-center gap-8">
            {desktopNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.path ? "text-primary" : "text-gray-600 dark:text-gray-400"
                )}
              >
                {t(item.name)}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/products" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <Search size={20} />
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex items-center gap-1"
              >
                <Globe size={20} />
              </button>
              {isLangDropdownOpen && (
                <div className={cn(
                  "absolute top-full mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl py-2 z-50",
                  isRTL ? "left-0" : "right-0"
                )}>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                        language === lang.code ? "text-primary font-bold" : "text-gray-700 dark:text-gray-300",
                        isRTL && "text-right"
                      )}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link to="/cart" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-6 left-4 right-4 z-50 glass rounded-3xl md:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isCart = item.name === 'cart';
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-all relative px-3 py-1 rounded-2xl",
                  location.pathname === item.path ? "text-primary bg-primary/10" : "text-gray-500 dark:text-gray-400 hover:bg-white/5"
                )}
              >
                <Icon size={20} />
                {isCart && totalItems > 0 && (
                  <span className="absolute top-1 right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg shadow-primary/30">
                    {totalItems}
                  </span>
                )}
                <span className="text-[10px] uppercase font-bold tracking-wider">{t(item.name)}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav md:hidden h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-white/10 rounded-2xl transition-all active:scale-95"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 hover:bg-white/10 rounded-2xl transition-all active:scale-95"
          >
            {isSearchOpen ? <X size={24} className="text-primary" /> : <Search size={24} />}
          </button>
        </div>

        <Link to="/" className="text-xl font-bold text-primary flex items-center gap-1">
          <span className="bg-primary text-white px-2 py-0.5 rounded-lg shadow-lg shadow-primary/20">Bio</span>
          <span className="dark:text-white tracking-tight">Supps</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <Globe size={20} />
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Search Pop-down */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-4 right-4 mt-2 glass rounded-[24px] shadow-2xl p-4 z-50 border border-white/20 dark:border-white/10"
            >
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-12 pr-6 py-4 bg-white/50 dark:bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary transition-all outline-none dark:text-white font-bold"
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Sidebar Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-md"
              />
              <motion.div
                initial={{ x: isRTL ? '100%' : '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: isRTL ? '100%' : '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className={cn(
                 "fixed top-0 bottom-0 w-[300px] z-[70] p-8 flex flex-col gap-10 shadow-6xl",
    
                   // ✨ Improved glass effect
                  "bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl backdrop-saturate-150",
    
                    // subtle border for contrast
                 "border-r border-black/10 dark:border-white/10",
        
                  isRTL ? "right-0 border-r-0 border-l" : "left-0"
                )}
              >
                <div className="flex items-center justify-between">
                  <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black text-primary flex items-center gap-1 tracking-tighter">
                    <span className="bg-primary text-white px-2 py-0.5 rounded-xl">Bio</span>
                    <span className="dark:text-white">Supps</span>
                  </Link>
                  <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 flex items-center justify-center glass rounded-xl transition-all active:scale-90">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-5 p-4 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-white/10 hover:bg-primary/10 hover:text-primary transition-all group active:scale-95"
                      >
                        <div className="w-12 h-12 glass rounded-xl flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
                          <Icon size={24} />
                        </div>
                        <span className="font-black text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">
                          {t(item.name)}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-auto pt-8 border-t border-white/10">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-6">{t('contact')}</p>
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-5 p-4 rounded-2xl glass-card border-white/5 hover:bg-primary/10 hover:text-primary transition-all active:scale-95">
                    <div className="w-12 h-12 glass rounded-xl flex items-center justify-center text-primary">
                      <Phone size={24} />
                    </div>
                    <span className="font-black text-lg text-gray-700 dark:text-gray-300">{t('contact')}</span>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Language Menu Overlay */}
        {isLangDropdownOpen && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl py-4 z-50">
            <div className="flex flex-col gap-2 px-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsLangDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg transition-colors",
                    language === lang.code ? "bg-primary/10 text-primary font-bold" : "text-gray-700 dark:text-gray-300",
                    isRTL && "text-right"
                  )}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed top nav */}
      <div className="h-14 md:h-16" />
    </>
  );
};

export default Navbar;
