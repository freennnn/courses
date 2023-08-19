import { Outlet } from 'react-router-dom';
import Header from '@/components/Header/Header';
import './NavigationLayout.scss';

export default function NavigationLayout() {
  return (
    <div className='navigation-container'>
      <div className='child-overlay'>
        <Outlet></Outlet>
      </div>
      <Header></Header>
    </div>
  );
}
