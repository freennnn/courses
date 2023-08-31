import { Link } from 'react-router-dom';
import './UserProfilePage.scss';
import UserInfo from './UserInfo';
import UserPassword from './UserPassword';
import UserAddress from './UserAddress';

function UserProfilePage() {
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
          <div className='user__flex user__flex--center'>
            <h1>User Profile</h1>
          </div>
          <div className='user__flex'>
            <UserInfo />
            <UserPassword />
          </div>
          <UserAddress />
        </section>
      </div>
    </div>
  );
}

export default UserProfilePage;
