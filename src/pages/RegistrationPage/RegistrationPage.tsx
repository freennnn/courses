import './RegistrationPage.scss';
import RegistrationForm from '../../components/LoginForm/RegistrationForm';
import { Link } from 'react-router-dom';

function RegistrationPage() {
  return (
    <div className='reg'>
      <div className='reg__wrapper'>
        <div className='reg__decor'>
          <Link className='reg__main-link' to={'/'}></Link>
          <p className='reg__logo'></p>
          <h2 className='reg__subtitle'>Nice to meet you :)</h2>
          <p className='reg__text'>Just register to join with us</p>
        </div>
        <section className='reg__inner'>
          <div className='reg__flex'>
            <h1>Registration</h1>
            <Link className='reg__link' to={'/login'}>
              Already have account
            </Link>
          </div>
          <RegistrationForm />
        </section>
      </div>
    </div>
  );
}
export default RegistrationPage;
