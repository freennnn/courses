import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import CustomLink from '@/components/CustomLink/CustomLink';
import { MdShoppingCart } from 'react-icons/md';

import { AuthContext } from '../../contexts/AuthContext.ts';
import './Navigation.scss';
import { NavigationState } from './Navigation.types';

function getPathForState(state: NavigationState): string {
  switch (state) {
    case NavigationState.Home:
      return '/';
    case NavigationState.Catalog:
      return '/products';
    case NavigationState.SignIn:
      return '/login';
    case NavigationState.SignUp:
      return '/register';
    case NavigationState.LogOut:
      return '/login';
    case NavigationState.UserProfile:
      return '/profile';
    case NavigationState.Basket:
      return '/basket';
    case NavigationState.About:
      return '/about';
  }
}

export default function Navigation() {
  const user = { name: 'Friend' }; // TODO: add basic user information to Auth Context
  const { isSignedIn } = useContext(AuthContext);

  let states: NavigationState[] = [];
  if (!isSignedIn) {
    states = [
      NavigationState.Home,
      NavigationState.Catalog,
      NavigationState.SignIn,
      NavigationState.SignUp,
      NavigationState.About,
    ];
  } else {
    states = [
      NavigationState.Home,
      NavigationState.Catalog,
      NavigationState.UserProfile,
      NavigationState.LogOut,
      NavigationState.About,
    ];
  }

  function isLayoutGroupOneLink(state: NavigationState) {
    if (
      state === NavigationState.Home ||
      state === NavigationState.Catalog ||
      state === NavigationState.About
    ) {
      return true;
    }
    return false;
  }

  function customLinkForState(state: NavigationState) {
    let buttonText: string = state;
    if (state === NavigationState.UserProfile) {
      buttonText += user.name;
    }
    return (
      <CustomLink
        key={state}
        state={state}
        pathTo={getPathForState(state)}
        buttonText={buttonText}
      />
    );
  }

  const layoutGroupOneStates = states.filter((state) => isLayoutGroupOneLink(state));
  const layoutGroupTwoStates = states.filter((state) => !isLayoutGroupOneLink(state));

  const location = useLocation();

  return (
    <nav className='navigation'>
      <div className='navigation__group-one'>
        <Link className='logo' to='/' />
        {layoutGroupOneStates.map((state) => customLinkForState(state))}
      </div>
      <div className='navigation__group-two'>
        {layoutGroupTwoStates.map((state) => customLinkForState(state))}
        <Link
          className={
            location.pathname === '/about' ? 'basket-icon basket-icon_black' : 'basket-icon'
          }
          to='/basket'
        >
          <MdShoppingCart />
        </Link>
      </div>
    </nav>
  );
}
