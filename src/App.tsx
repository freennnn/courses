import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';

import NavigationLayout from './features/Navigation/NavigationLayout';
import MainPage from '@/pages/MainPage/MainPage';
import MainOrLoginRoute from '@/features/Navigation/MainOrLoginRoute';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import BasketPage from '@/pages/BasketPage/BasketPage';
import ProductDetailPage from '@/pages/ProductDetailPage/ProductDetailPage';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';
import CatalogProductPage from './pages/CatalogProductPage/CatalogProductPage';
import { AuthContext, defaultContextValues } from './contexts/AuthContext';

import './App.scss';

const App = () => {
  const [appContext, setAuthContext] = useState(defaultContextValues);

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
            <Route path='profile' element={<UserProfilePage />} />
            <Route index element={<MainPage />} />
            <Route path='products' element={<CatalogProductPage />} />
            <Route path='products/:productId' element={<ProductDetailPage />} />
          </Route>
          <Route path='login' element={<MainOrLoginRoute />} />
          <Route path='register' element={<RegistrationPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </AuthContext.Provider>
    </>
  );
};

export default App;
