import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import LoginForm from '../../components/LoginForm/LoginForm';

import 'react-toastify/dist/ReactToastify.css';
import './LoginPage.scss';

function LoginPage() {
  return (
    <>
      <div className='reg'>
        <div className='reg__wrapper'>
          <div className='reg__decor'>
            <Link className='reg__main-link' to={'/'}></Link>
            <p className='reg__logo'></p>
            <h2 className='reg__subtitle'>Welcome back</h2>
            <p className='reg__text'>Please login to continue</p>
          </div>
          <section className='reg__inner'>
            <div className='reg__flex'>
              <h1>Login</h1>
              <Link className='reg__link' to={'/register'}>
                Create a new account
              </Link>
            </div>
            <LoginForm />
          </section>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default LoginPage;
