import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import { useContext } from 'react';
import { ButtonType, ButtonBackgroundColor } from '@/components/Button/Button.types';
import Button from '@/components/Button/Button';
import { NavigationState } from '@/features/Navigation/Navigation.types';
import { AuthContext, updateAuthContext } from '../../contexts/AuthContext.ts';

export default function CustomLink({
  state,
  pathTo,
  buttonText,
}: {
  state: NavigationState;
  pathTo: string;
  buttonText: string;
}) {
  let type = ButtonType.text;
  let color = ButtonBackgroundColor.transparent;

  const resolvedPath = useResolvedPath(pathTo);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  if (isActive) {
    type = ButtonType.contained;
    color = ButtonBackgroundColor.accented;
  }

  const authContext = useContext(AuthContext);

  function onClickHandler() {
    if (state === NavigationState.LogOut) {
      updateAuthContext(authContext, { isSignedIn: false });
    }
    /*console.log(`${state} navigation button has been clicked`);*/
  }

  return (
    <Link key={state} to={pathTo}>
      <Button onClick={onClickHandler} key={state} type={type} color={color}>
        {buttonText}
      </Button>
    </Link>
  );
}
