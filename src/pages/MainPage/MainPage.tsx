import './MainPage.scss';
import Header from '@/components/Header/Header';
import { Outlet } from 'react-router-dom';
// import Navigation from '@/features/Navigation/Navigation';

export default function MainPage() {
  return (
    <>
      <div className='main-feature'>
        <Header>{<Outlet />}</Header>
        <div>
          <h1>Hello fellow wizards!</h1>
          <p>Let&#39; sell some courses and movies and get rich fast</p>
        </div>
      </div>
    </>
  );
}
