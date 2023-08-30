import { ButtonType, ButtonSize, ButtonBackgroundColor, ButtonPropsType } from './Button.types';
import './Button.scss';

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
