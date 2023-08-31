import './Button.scss';
import { ButtonBackgroundColor, ButtonPropsType, ButtonSize, ButtonType } from './Button.types';

export default function Button({
  type = ButtonType.text,
  size = ButtonSize.medium,
  color = ButtonBackgroundColor.transparent,
  onClick,
  children,
}: ButtonPropsType) {
  return (
    <button className={`button button_${type} button_${size} button_${color}`} onClick={onClick}>
      {children}
    </button>
  );
}
