import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Modal from 'react-modal';

import MainOrLoginRoute from '@/features/Navigation/MainOrLoginRoute';
import BasketPage from '@/pages/BasketPage/BasketPage';
import MainPage from '@/pages/MainPage/MainPage';

import './App.scss';
import { AuthContext, defaultContextValues } from './contexts/AuthContext';
import NavigationLayout from './features/Navigation/NavigationLayout';
import CatalogProductPage from './pages/CatalogProductPage/CatalogProductPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';

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
