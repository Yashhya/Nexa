import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

import { getMe } from './store/slices/authSlice';
import { fetchCart } from './store/slices/cartSlice';
import { useTheme } from './context/ThemeContext';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import AIAssistant from './components/ai/AIAssistant';
import AdminLayout from './components/layout/AdminLayout';
import SellerLayout from './components/layout/SellerLayout';
import UserLayout from './components/layout/UserLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSellers from './pages/admin/AdminSellers';
import AdminFinance from './pages/admin/AdminFinance';

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import SellerOrders from './pages/seller/SellerOrders';
import SellerFinance from './pages/seller/SellerFinance';
import SellerAITools from './pages/seller/SellerAITools';

// User Account Pages
import UserDashboard from './pages/user/UserDashboard';
import UserOrders from './pages/user/UserOrders';
import UserProfile from './pages/user/UserProfile';
import UserRewards from './pages/user/UserRewards';

// ─── Route Guards ─────────────────────────────────────────
const UserRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(s => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'seller') return <Navigate to="/seller" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(s => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/home" replace />;
  return children;
};

const SellerRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(s => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'seller') return <Navigate to="/home" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(s => s.auth);
  if (!isAuthenticated) return children;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'seller') return <Navigate to="/seller" replace />;
  return <Navigate to="/home" replace />;
};

// ─── Main Shop Layout ─────────────────────────────────────
const ShopLayout = ({ children }) => (
  <>
    <Navbar />
    <CartDrawer />
    <AIAssistant />
    <main>{children}</main>
    <Footer />
  </>
);

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(s => s.auth);
  const { isDark } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('nexaToken');
    if (token) {
      dispatch(getMe());
      dispatch(fetchCart());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [isAuthenticated, dispatch]);

  return (
    <HelmetProvider>
      <Router>
        <div className="mesh-bg min-h-screen">
          <Routes>
            {/* ── Public / Shop Routes ───────────────────── */}
            <Route path="/" element={<ShopLayout><LandingPage /></ShopLayout>} />
            <Route path="/home" element={<ShopLayout><HomePage /></ShopLayout>} />
            <Route path="/shop" element={<ShopLayout><ShopPage /></ShopLayout>} />
            <Route path="/product/:id" element={<ShopLayout><ProductDetailPage /></ShopLayout>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

            {/* ── Protected Shopping Routes ──────────────── */}
            <Route path="/cart" element={<UserRoute><ShopLayout><CartPage /></ShopLayout></UserRoute>} />
            <Route path="/checkout" element={<UserRoute><ShopLayout><CheckoutPage /></ShopLayout></UserRoute>} />
            <Route path="/wishlist" element={<UserRoute><ShopLayout><WishlistPage /></ShopLayout></UserRoute>} />
            <Route path="/orders" element={<UserRoute><ShopLayout><OrdersPage /></ShopLayout></UserRoute>} />
            <Route path="/orders/:id" element={<UserRoute><ShopLayout><OrderDetailPage /></ShopLayout></UserRoute>} />
            <Route path="/order-success/:id" element={<UserRoute><ShopLayout><OrderSuccessPage /></ShopLayout></UserRoute>} />
            
            {/* Any role can access profile */}
            <Route path="/profile" element={
              isAuthenticated ? <ShopLayout><ProfilePage /></ShopLayout> : <Navigate to="/login" />
            } />

            {/* ── User Account Panel (/account) ─────────── */}
            <Route path="/account" element={<UserRoute><UserLayout /></UserRoute>}>
              <Route index element={<UserDashboard />} />
              <Route path="orders" element={<UserOrders />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="rewards" element={<UserRewards />} />
              <Route path="wishlist" element={<WishlistPage />} />
            </Route>

            {/* ── Admin Panel (/admin) ───────────────────── */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="sellers" element={<AdminSellers />} />
              <Route path="finance" element={<AdminFinance />} />
            </Route>

            {/* ── Seller Panel (/seller) ─────────────────── */}
            <Route path="/seller" element={<SellerRoute><SellerLayout /></SellerRoute>}>
              <Route index element={<SellerDashboard />} />
              <Route path="products" element={<SellerProducts />} />
              <Route path="orders" element={<SellerOrders />} />
              <Route path="finance" element={<SellerFinance />} />
              <Route path="ai-tools" element={<SellerAITools />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: isDark ? '#0d0d17' : '#ffffff',
                color: isDark ? '#e2e8f0' : '#1e1b4b',
                border: isDark ? '1px solid rgba(168,85,247,0.3)' : '1px solid rgba(124,58,237,0.2)',
                boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(124,58,237,0.12)',
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
              },
              duration: 3000,
            }}
          />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
