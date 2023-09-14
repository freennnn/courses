import { useState } from 'react';
import Modal from 'react-modal';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import MainOrLoginRoute from '@/features/Navigation/MainOrLoginRoute';
import NavigationLayout from '@/features/Navigation/NavigationLayout';
import BasketPage from '@/pages/BasketPage/BasketPage';
import CatalogProductPage from '@/pages/CatalogProductPage/CatalogProductPage';
import CategoryPage from '@/pages/CategoryPage/CategoryPage';
import MainPage from '@/pages/MainPage/MainPage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import ProductDetailPage from '@/pages/ProductDetailPage/ProductDetailPage';
import RegistrationPage from '@/pages/RegistrationPage/RegistrationPage';
import UserProfilePage from '@/pages/UserProfilePage/UserProfilePage';

import './App.scss';
import { AuthContext, defaultAuthContextValues } from './contexts/AuthContext';
import { CartContext, defaultCartContextValues } from './contexts/CartContext';
import AboutUsPage from './pages/AboutUsPage/AboutUsPage';

const App = () => {
  const [authData, setAuthData] = useState(defaultAuthContextValues);
  const [cartData, setCartData] = useState(defaultCartContextValues);

  Modal.setAppElement('#root');

  return (
    <>
      <ToastContainer />
      <AuthContext.Provider
        value={{
          ...authData,
          setAuthData,
        }}
      >
        <CartContext.Provider
          value={{
            ...cartData,
            setCartData,
          }}
        >
          <Routes>
            <Route path='/' element={<NavigationLayout />}>
              <Route path='about' element={<AboutUsPage />} />
              <Route path='basket' element={<BasketPage />} />
              <Route index element={<MainPage />} />
              <Route path='products' element={<CatalogProductPage />} />
              <Route path='products/:id' element={<ProductDetailPage />} />
              <Route path='products/category/:url' element={<CategoryPage />} />
            </Route>
            <Route path='profile' element={<UserProfilePage />} />
            <Route path='login' element={<MainOrLoginRoute />} />
            <Route path='register' element={<RegistrationPage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </CartContext.Provider>
      </AuthContext.Provider>
    </>
  );
};

export default App;
