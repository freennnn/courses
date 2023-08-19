import React from 'react';
import './Header.scss';

interface HeaderPropsType {
  children: React.ReactNode;
}

export default function Header({ children }: HeaderPropsType) {
  return <div className='header'>{children}</div>;
}
