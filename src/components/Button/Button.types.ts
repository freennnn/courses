import React from 'react';

export enum ButtonType {
  text = 'text', // less pronounced actions, default value
  contained = 'contained', // high emphasis
  outlined = 'outlined', // medium
}

export enum ButtonSize {
  medium = 'medium', // default value
  large = 'large',
}

export enum ButtonBackgroundColor {
  transparent = 'transparent', // default value
  accented = 'accented',
  tertiary = 'tertiary',
}

export interface ButtonPropsType {
  type?: ButtonType;
  size?: ButtonSize;
  color?: ButtonBackgroundColor;
  children: React.ReactNode;
}
