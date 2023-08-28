import { Link } from 'react-router-dom';
import './UserProfilePage.scss';

function UserProfilePage() {
  return (
    <div className='user' id='user'>
      <div className='user__wrapper'>
        <div className='user__decor'>
          <Link className='user__main-link' to={'/'}></Link>
          <p className='user__logo'></p>
          <h2 className='user__subtitle'>Nice to meet you :)</h2>
          <p className='user__text'>Check infomation about you</p>
        </div>
        <section className='user__inner'>
          <div className='user__flex'>
            <h1>User Profile</h1>
            <Link className='reg__link' to={'/register'}>
              Create a new account
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default UserProfilePage;
