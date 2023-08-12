import './RegistrationPage.scss';
import RegistrationForm from '../../components/LoginForm/RegistrationForm';

function RegistrationPage() {
  return (
    <div className='reg'>
      <div className='reg__wrapper'>
        <div className='reg__decor'>
          <a className='reg__main-link' href='/'></a>
          <p>
            <img src='src/assets/images/logo.svg' alt='logo' width='115' height='115' />
          </p>
          <h2 className='reg__subtitle'>Nice to meet you :)</h2>
          <p className='reg__text'>Just register to join with us</p>
        </div>
        <section className='reg__inner'>
          <div className='reg__flex'>
            <h1>Registration</h1>
            <a className='reg__link' href='/login'>
              Already have account
            </a>
          </div>
          <RegistrationForm />
        </section>
      </div>
    </div>
  );
}

export default RegistrationPage;
