import { Outlet } from 'react-router-dom';

import Header from 'components/Header/Header';

import './NavigationLayout.scss';

export default function NavigationLayout() {
  return (
    <div className='navigation-container'>
      <Header></Header>
      <div className='child-overlay'>
        <Outlet></Outlet>
      </div>
    </div>
  );
}
