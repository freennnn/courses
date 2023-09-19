import classNames from 'classnames';

import './Button.scss';
import {
  ButtonBackgroundColor,
  ButtonPropsType,
  ButtonSize,
  ButtonTheme,
  ButtonType,
} from './Button.types';

export default function Button({
  type = ButtonType.text,
  size = ButtonSize.medium,
  color = ButtonBackgroundColor.transparent,
  cssClasses,
  onClick,
  children,
  disabled = false,
  theme = ButtonTheme.dark,
}: ButtonPropsType) {
  return (
    <button
      className={classNames(
        'button',
        `button_${type}`,
        `button_${size}`,
        `button_${color}`,
        `button_${theme}`,
        cssClasses?.join(' '),
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
