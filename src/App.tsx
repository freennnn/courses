import { useState } from 'react';
import Modal from 'react-modal';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import MainOrLoginRoute from '@/features/Navigation/MainOrLoginRoute';
import NavigationLayout from '@/features/Navigation/NavigationLayout';
import BasketPage from '@/pages/BasketPage/BasketPage';
import CatalogProductPage from '@/pages/CatalogProductPage/CatalogProductPage';
import CategoryPage from '@/pages/CategoryPage/CategoryPage';
import ProductDetailPage from '@/pages/DetailedProductPage/DetailedProductPage';
import MainPage from '@/pages/MainPage/MainPage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import RegistrationPage from '@/pages/RegistrationPage/RegistrationPage';
import UserProfilePage from '@/pages/UserProfilePage/UserProfilePage';

import './App.scss';
import { AuthContext, defaultContextValues } from './contexts/AuthContext';

const App = () => {
  const [appContext, setAuthContext] = useState(defaultContextValues);
  Modal.setAppElement('#root');
  return (
    <>
      <ToastContainer />
      <AuthContext.Provider
        value={{
          ...appContext,
          setAuthContext,
        }}
      >
        <Routes>
          <Route path='/' element={<NavigationLayout />}>
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
      </AuthContext.Provider>
    </>
  );
};

export default App;
