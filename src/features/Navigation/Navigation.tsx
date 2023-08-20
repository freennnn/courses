import { NavigationState, NavigationPropsType } from './Navigation.types';
//import { ButtonType, ButtonBackgroundColor } from '@/components/Button/Button.types';
import CustomLink from '@/components/CustomLink/CustomLink';
//import { useState, useContext } from 'react';
//import { AuthContext, updateAuthContext } from '../../contexts/AuthContext.ts';
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
  states = [
    NavigationState.Featured,
    // NavigationState.TopCategories,
    // NavigationState.Sale,
    NavigationState.SignIn,
    NavigationState.SignUp,
    NavigationState.Basket,
  ],
}: NavigationPropsType) {
  const user = { name: 'Friend' }; // TODO: add basic user information to Auth Context
  // const authContext = useContext(AuthContext);
  // updateAuthContext(authContext, { isSignedIn: true });

  // const { isSignedIn } = useContext(AuthContext); //TODO: when AuthContext code will be pushed

  const { isSignedIn } = { isSignedIn: true };
  states = [];
  if (!isSignedIn) {
    states = [
      NavigationState.Featured,
      // NavigationState.TopCategories,
      // NavigationState.Sale,
      NavigationState.SignIn,
      NavigationState.SignUp,
      NavigationState.Basket,
    ];
  } else {
    states = [
      NavigationState.Featured,
      // NavigationState.TopCategories,
      // NavigationState.Sale,
      NavigationState.UserProfile,
      NavigationState.LogOut,
      NavigationState.Basket,
    ];
  }

  return (
    <nav className='navigation'>
      {states.map((state) => {
        let buttonText: string = state;
        if (state === NavigationState.UserProfile) {
          buttonText += user?.name ?? 'Anonimous';
        }
        return (
          <CustomLink
            key={state}
            state={state}
            pathTo={getPathForState(state)}
            buttonText={buttonText}
          />
        );
      })}
    </nav>
  );
}
