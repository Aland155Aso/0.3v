import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import AdminRoute from './components/AdminRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Products from './pages/Products';
import CategoryPage from './pages/CategoryPage';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import Info from './pages/Info';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProductForm from './pages/admin/ProductForm';
import BlogForm from './pages/admin/BlogForm';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <Router>
                <ScrollToTop />
                <Toaster position="top-center" reverseOrder={false} />
                <Routes>
                  {/* Main Website Routes */}
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="products" element={<Products />} />
                    <Route path="best-sellers" element={<CategoryPage type="best-seller" />} />
                    <Route path="our-products" element={<CategoryPage type="all" />} />
                    <Route path="on-sale" element={<CategoryPage type="on-sale" />} />
                    <Route path="supplements" element={<CategoryPage type="supplements" />} />
                    <Route path="herbs" element={<CategoryPage type="herbs" />} />
                    <Route path="healthy-lifestyle" element={<CategoryPage type="healthy-lifestyle" />} />
                    <Route path="product/:id" element={<ProductDetails />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="info" element={<Info />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/products/new"
                    element={
                      <AdminRoute>
                        <ProductForm />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/products/edit/:id"
                    element={
                      <AdminRoute>
                        <ProductForm />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/blogs/new"
                    element={
                      <AdminRoute>
                        <BlogForm />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/blogs/edit/:id"
                    element={
                      <AdminRoute>
                        <BlogForm />
                      </AdminRoute>
                    }
                  />
                </Routes>
              </Router>
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
