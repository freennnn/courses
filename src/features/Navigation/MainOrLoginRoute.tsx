import { useContext } from 'react';

import NavigationLayout from 'features/Navigation/NavigationLayout';
import LoginPage from 'pages/LoginPage/LoginPage';

import { AuthContext } from '../../contexts/AuthContext';

export default function MainOrLoginRoute() {
  const { isSignedIn } = useContext(AuthContext);

  if (isSignedIn) {
    return <NavigationLayout />;
  } else {
    return <LoginPage />;
  }
}
