import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import { ButtonType, ButtonBackgroundColor } from '@/components/Button/Button.types';
import Button from '@/components/Button/Button';
import { NavigationState } from '@/features/Navigation/Navigation.types';

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
  return (
    <Link key={state} to={pathTo}>
      <Button key={state} type={type} color={color}>
        {buttonText}
      </Button>
    </Link>
  );
}
