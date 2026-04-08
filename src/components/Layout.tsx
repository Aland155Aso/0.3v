import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartBar from './CartBar';
import { useLanguage } from '../context/LanguageContext';

const Layout: React.FC = () => {
  const { isRTL } = useLanguage();

  return (
    <div className={isRTL ? 'rtl' : 'ltr'}>
      <div className="liquid-bg">
        <div className="liquid-blob" />
        <div className="liquid-blob" />
        <div className="liquid-blob" />
      </div>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <CartBar />
      <Footer />
    </div>
  );
};

export default Layout;
