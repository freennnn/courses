import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Navigation from './features/Navigation/Navigation';
import MainPage from './pages/MainPage/MainPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import { AuthContext, defaultContextValues } from './contexts/AuthContext';

import './App.scss';

const App = () => {
  const [appContext, setAuthContext] = useState(defaultContextValues);

  return (
    <>
      <AuthContext.Provider
        value={{
          ...appContext,
          setAuthContext,
        }}
      >
        <Routes>
          <Route path='/' element={<Navigation />}>
            <Route index element={<MainPage />} />
          </Route>
          <Route path='login' element={<LoginPage />} />
          <Route path='register' element={<RegistrationPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </AuthContext.Provider>
    </>
  );
};

export default App;
