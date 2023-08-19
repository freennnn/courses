import { Routes, Route } from 'react-router-dom';

import NavigationLayout from './features/Navigation/NavigationLayout';
import MainPage from '@/pages/MainPage/MainPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import BasketPage from '@/pages/BasketPage/BasketPage';

import './App.scss';

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<NavigationLayout />}>
          <Route path='basket' element={<BasketPage />} />
          <Route index element={<MainPage />} />
        </Route>
        <Route path='login' element={<LoginPage />} />
        <Route path='register' element={<RegistrationPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
