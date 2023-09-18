import classNames from 'classnames';

import './Button.scss';
import { ButtonBackgroundColor, ButtonPropsType, ButtonSize, ButtonType } from './Button.types';

export default function Button({
  type = ButtonType.text,
  size = ButtonSize.medium,
  color = ButtonBackgroundColor.transparent,
  location,
  onClick,
  children,
}: ButtonPropsType) {
  const buttonClasses = classNames(
    'button',
    `button_${type}`,
    `button_${size}`,
    `button_${color}`,
    { 'about-button': location === '/about' },
  );

  return (
    <button className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
}
