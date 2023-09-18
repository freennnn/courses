import classNames from 'classnames';

import './Button.scss';
import { ButtonBackgroundColor, ButtonPropsType, ButtonSize, ButtonType } from './Button.types';

export default function Button({
  type = ButtonType.text,
  size = ButtonSize.medium,
  color = ButtonBackgroundColor.transparent,
  cssClasses,
  onClick,
  children,
  disabled = false,
}: ButtonPropsType) {
  return (
    <button
      className={classNames(
        'button',
        `button_${type}`,
        `button_${size}`,
        `button_${color}`,
        cssClasses?.join(' '),
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
