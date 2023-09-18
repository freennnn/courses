import { useContext } from 'react';
import { Link, useLocation, useMatch, useResolvedPath } from 'react-router-dom';

import Button from '@/components/Button/Button';
import { ButtonBackgroundColor, ButtonType } from '@/components/Button/Button.types';
import { NavigationState } from '@/features/Navigation/Navigation.types';

import { AuthContext, updateAuthContext } from '../../contexts/AuthContext.ts';
import {
  CartContext,
  defaultCartContextValues,
  updateCartContext,
} from '../../contexts/CartContext.ts';

export default function CustomLink({
  state,
  pathTo,
  buttonText,
  children,
}: {
  state: NavigationState;
  pathTo: string;
  buttonText: string;
  children: React.ReactNode;
}) {
  let type = ButtonType.text;
  let color = ButtonBackgroundColor.transparent;

  const location = useLocation();
  const resolvedPath = useResolvedPath(pathTo);
  //console.log(`location = ${location.pathname} and resolvedPath ${resolvedPath.pathname}`);
  const pathMatch = useMatch({ path: resolvedPath.pathname, end: true });
  // console.log(pathMatch);
  let isActive = false;
  // All product `subroutes` like '/product/catalog' '/product/:id' should show active 'Catalog' Link button
  if (location.pathname.includes('products') && resolvedPath.pathname.includes('products')) {
    isActive = true;
  } else {
    isActive = !!pathMatch;
  }

  if (isActive) {
    type = ButtonType.contained;
    color = ButtonBackgroundColor.accented;
  }

  const authContext = useContext(AuthContext);

  function onClickHandler() {
    if (state === NavigationState.LogOut) {
      updateAuthContext(authContext, { isSignedIn: false, id: '' });
      updateCartContext(cartContext, (prev) => ({
        ...prev,
        ...defaultCartContextValues,
      }));
    }
    /*console.log(`${state} navigation button has been clicked`);*/
  }

  const cartContext = useContext(CartContext);

  return (
    <Link key={state} to={pathTo}>
      <Button onClick={onClickHandler} key={state} type={type} color={color}>
        {buttonText}
        {children}
        {state === NavigationState.Cart && (
          <span className='notification-badge'>{cartContext.quantity}</span>
        )}
      </Button>
    </Link>
  );
}
