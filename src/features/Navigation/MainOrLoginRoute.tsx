import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import NavigationLayout from '@/features/Navigation/NavigationLayout';
import LoginPage from '@/pages/LoginPage/LoginPage';

export default function MainOrLoginRoute() {
  const { isSignedIn } = useContext(AuthContext);
  console.log(`isSignedIn: ${isSignedIn}`);
  if (isSignedIn) {
    return <NavigationLayout />;
  } else {
    return <LoginPage />;
  }
}
