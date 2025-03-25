import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserLayout from './components/Layout/UserLayout';
import Home from './pages/Home';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CollectionPage from './pages/CollectionPage';
import ProductsDetail from './components/Products/ProductsDetail';
import Checkout from './components/Cart/Checkout';
import OrderConfirmation from './pages/OrderConfimationPage';
import OrderDetailedPage from './pages/OrderDetailedPage';
import MyOrderPage from './pages/MyOrderPage';
import AdminLayout from './components/Admin/AdminLayout';
import AdminHomepage from './pages/AdminHomepage';
import UserManagement from './components/Admin/UserManagement';
import ProductManagement from './components/Admin/ProductManagement';
import EditProduct from './components/Admin/EditProduct';
import OrderManagement from './components/Admin/OrderManagement';
import { Provider } from 'react-redux';
import store from './redux/store';
import ProtectedRoute from './components/Common/ProtectedRoute';
import { Navigate } from 'react-router-dom';
const App = () => {
  return (
    <div>
      <Provider store={store}>
        <Toaster position="top-right" />
        <Routes>
          {/* User Layout Routes */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route path="collections/:collection" element={<CollectionPage />} />
            <Route path="products/:id" element={<ProductsDetail />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-confirmation" element={<OrderConfirmation />} />
            <Route path="order/:id" element={<OrderDetailedPage />} />
            <Route path="my-orders" element={<MyOrderPage />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHomepage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
            <Route path="orders" element={<OrderManagement />} />
          </Route>

          {/* Redirect unknown routes to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Provider>
    </div>
  );
};

export default App;
