import './LoginPage.scss';
import LoginForm from '../../components/LoginForm/LoginForm';

function LoginPage() {
  return (
    <div className='reg'>
      <div className='reg__wrapper'>
        <div className='reg__decor'>
          <a className='reg__main-link' href='/'></a>
          <p>
            <img src='src/assets/images/logo.svg' alt='logo' width='115' height='115' />
          </p>
          <h2 className='reg__subtitle'>Welcome back</h2>
          <p className='reg__text'>Please login to continue</p>
        </div>
        <section className='reg__inner'>
          <div className='reg__flex'>
            <h1>Login</h1>
            <a className='reg__link' href='/register'>
              Create a new account
            </a>
          </div>
          <LoginForm />
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
