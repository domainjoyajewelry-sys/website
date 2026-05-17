import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Login from './pages/Login';
import InfoPage from './pages/InfoPage';
import Admin from './pages/admin/Admin';
import AdminLayout from './layouts/AdminLayout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/products" element={<Layout><Products /></Layout>} />
      <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
      <Route path="/cart" element={<Layout><Cart /></Layout>} />
      <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
      <Route path="/orders" element={<Layout><Orders /></Layout>} />
      <Route path="/profile" element={<Layout><Profile /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      
      {/* Informational Pages */}
      <Route path="/about" element={<Layout><InfoPage /></Layout>} />
      <Route path="/shipping" element={<Layout><InfoPage /></Layout>} />
      <Route path="/faqs" element={<Layout><InfoPage /></Layout>} />
      <Route path="/care" element={<Layout><InfoPage /></Layout>} />
      <Route path="/warranty" element={<Layout><InfoPage /></Layout>} />
      <Route path="/contact" element={<Layout><InfoPage /></Layout>} />

      <Route path="/unauthorized" element={<Layout><div>Unauthorized</div></Layout>} />

      {/* Admin Routes */}
      <Route path="/admin/*" element={<PrivateRoute isAdmin={true} />}>
        <Route path="*" element={<AdminLayout><Admin /></AdminLayout>} />
      </Route>
    </Routes>
  );
}

export default App;