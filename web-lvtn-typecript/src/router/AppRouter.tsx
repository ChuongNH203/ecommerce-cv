import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import LoginPage from '../pages/login/LoginPage';

import PrivateRoute from './PrivateRoute';
import MainLayout from '../components/Layouts/main-layout';
import AuthLayout from '../components/Layouts/auth-layout';

import ProductPage from '../pages/product/product-page';
import ProductDetailPage from '../pages/product/product-detail-page';
import Navigation from '../components/MasterLayout/Body/home/navigation';

import RegisterVerifyPage from '../pages/login/RegisterPage';
import ResetPasswordPage from '../pages/login/reset-password-page';
import ForgotPasswordPage from '../pages/login/forgot-password-page';
import CartPage from '../pages/cart/cart-page';
import WishlistPage from '../pages/wishlist/wishlist-page';
import ProductIndex from '../components/admin/product';
import ServiceMainLayout from '../components/Layouts/service-main-layout';
import OrderIndex from '../components/admin/order';
import VariantIndex from '../components/admin/variant';
import SpecificationIndex from '../components/admin/specification';
import ImageIndex from '../components/admin/image';
import NoPermission from '../components/Auth/no-permission';
import ProfilePage from '../pages/header/profile-page';
import PaymentPage from '../pages/payment/payment-page';
import UserIndex from '../components/admin/user';
import VoucherIndex from '../components/admin/voucher';
import SalesStatistics from '../components/admin/chart/sales-statistics';
import AdminSendNewsletter from '../components/admin/letter/letter';



const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><RegisterVerifyPage /></AuthLayout>} />
        <Route path="/reset-password" element={<AuthLayout><ResetPasswordPage /></AuthLayout>} />
        <Route path="/forgot-password" element={<AuthLayout><ForgotPasswordPage /></AuthLayout>} />
        <Route path="/home" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/product" element={<MainLayout><Navigation /><ProductPage /></MainLayout>} />
        <Route path="/product/category/:categoryId" element={<MainLayout><Navigation /><ProductPage /></MainLayout>} />
        <Route path="/product/category/:categoryId/brand/:brand" element={<MainLayout><Navigation /><ProductPage /></MainLayout>} />
        <Route path="/product/category/:categoryId/price/:price" element={<MainLayout><Navigation /><ProductPage /></MainLayout>} />
        <Route path="/cart-list" element={<PrivateRoute><MainLayout><Navigation /><CartPage /></MainLayout></PrivateRoute>} />
        <Route path="/wish-list" element={<PrivateRoute><MainLayout><Navigation /><WishlistPage /></MainLayout></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute><MainLayout><Navigation /><PaymentPage /></MainLayout></PrivateRoute>} />
        <Route path="/product/:productId" element={<MainLayout><Navigation /><ProductDetailPage /></MainLayout>} />
        <Route path="/product/:productId/variant/:variantId" element={<MainLayout><Navigation /><ProductDetailPage /></MainLayout>} />
        <Route path="/about" element={<PrivateRoute><MainLayout><About /></MainLayout></PrivateRoute>} />

        {/* Thay đổi Route này để ProfilePage có thể xử lý các đường dẫn con */}
        <Route path="/account/*" element={
          <PrivateRoute>
            <MainLayout>
              <Navigation />
              <ProfilePage />
            </MainLayout>
          </PrivateRoute>
        } />

          <Route path="/no-permission" element={<NoPermission />} />  {/* Nếu không phải admin, hiển thị thông báo không có quyền */}
        {/* Các route yêu cầu quyền admin */}
        <Route path="/service" element={<PrivateRoute roleRequired="admin"><ServiceMainLayout /></PrivateRoute>}>
          <Route path="orders" element={<OrderIndex />} />
          <Route path="product" element={<ProductIndex />} />
          <Route path="variants" element={<VariantIndex />} />
          <Route path="specifications" element={<SpecificationIndex />} />
          <Route path="images" element={<ImageIndex />} />
          <Route path="users" element={<UserIndex />} />
          <Route path="vouchers" element={<VoucherIndex />} />
          <Route path="salesStatistics" element={<SalesStatistics />} />
          <Route path="letters" element={<AdminSendNewsletter />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
