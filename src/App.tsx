import { Routes, Route } from 'react-router-dom';

import Navigation from './features/Navigation/Navigation';
import MainPage from './pages/MainPage/MainPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import { signUp, signIn } from './api/api';

import './App.scss';

//temporary user for testing
const customer = {
  email: 'user12',
  password: 'password',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '2000-10-12',
  addresses: [{ country: 'US' }],
};

const App = () => {
  //temporary function for testing
  const handleSignUp = () => {
    signUp(customer)
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log('Sign Up Response:', response);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Sign Up Error:', error);
      });
  };

  const handleSignIn = () => {
    signIn({
      email: 'example@example.com',
      password: 'your-password',
    })
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log('Sign Ip Response:', response);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Sign Up Error:', error);
      });
  };

  return (
    <>
      <Routes>
        <Route path='/' element={<Navigation />}>
          <Route index element={<MainPage />} />
        </Route>
        <Route path='login' element={<LoginPage />} />
        <Route path='register' element={<RegistrationPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      <button onClick={handleSignUp}>Sign up</button>
      <button onClick={handleSignIn}>Sign in</button>
    </>
  );
};

export default App;
