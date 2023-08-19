import React from 'react';
import Navigation from '@/features/Navigation/Navigation';
import './Header.scss';

interface HeaderPropsType {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderPropsType) {
  return (
    <div className='header'>
      <Navigation />
      {children}
    </div>
  );
}
