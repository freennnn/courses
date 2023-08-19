import { Routes, Route } from 'react-router-dom';

import Navigation from './features/Navigation/Navigation';
import MainPage from '@/pages/MainPage/MainPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

import './App.scss';

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<MainPage />}>
          <Route index element={<Navigation />} />
        </Route>
        <Route path='login' element={<LoginPage />} />
        <Route path='register' element={<RegistrationPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
