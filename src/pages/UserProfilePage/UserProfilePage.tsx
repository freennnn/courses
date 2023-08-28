import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext.ts';
import './UserProfilePage.scss';
import UserInfo from './UserInfo';
import UserPassword from './UserPassword';
import UserAddress from './UserAddress';
import UserNewAddress from './UserNewAddress';

function UserProfilePage() {
  const { isSignedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  if (!isSignedIn) {
    navigate('/login');
  }
  return (
    <div className='user' id='user'>
      <div className='user__wrapper'>
        <div className='user__decor'>
          <Link className='user__main-link' to={'/'}></Link>
          <p className='user__logo'></p>
          <h2 className='user__subtitle'>Nice to meet you :)</h2>
          <p className='user__text'>Check information about you</p>
        </div>
        <section className='user__inner'>
          <div className='user__flex'>
            <h1>User Profile</h1>
            <Link className='reg__link' to={'/register'}>
              Create a new account
            </Link>
          </div>
          <UserInfo />
          <UserPassword />
          <UserAddress />
          <UserNewAddress />
        </section>
      </div>
    </div>
  );
}

export default UserProfilePage;
