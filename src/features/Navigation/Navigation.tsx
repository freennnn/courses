import { NavigationState, NavigationPropsType } from './Navigation.types';
import Button from '@/components/Button/Button';
import { ButtonType, ButtonBackgroundColor } from '@/components/Button/Button.types';
import { Link } from 'react-router-dom';

import './Navigation.scss';

function getPathForState(state: NavigationState): string {
  switch (state) {
    case NavigationState.Featured:
      return '/';
    case NavigationState.TopCategories:
      return '/products';
    case NavigationState.Sale:
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
  }
}

export default function Navigation({
  activeState = NavigationState.Featured,
  states = [
    NavigationState.Featured,
    NavigationState.TopCategories,
    NavigationState.Sale,
    NavigationState.SignIn,
    NavigationState.SignUp,
    NavigationState.Basket,
  ],
  user,
}: NavigationPropsType) {
  return (
    <nav className='navigation'>
      {states.map((state) => {
        let type = ButtonType.text;
        let color = ButtonBackgroundColor.transparent;
        if (state === activeState) {
          type = ButtonType.contained;
          color = ButtonBackgroundColor.accented;
        }

        let buttonText: string = state;
        if (state === NavigationState.UserProfile) {
          buttonText += user?.name ?? 'Anonimous';
        }
        return (
          <Link key={state} to={getPathForState(state)}>
            <Button key={state} type={type} color={color}>
              {buttonText}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
