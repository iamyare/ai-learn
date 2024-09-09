import React from 'react';

interface HeaderProps {
  children: React.ReactNode;
}

const Title: React.FC<HeaderProps> = ({ children }) => (
  <h2 className='text-xl font-bold'>{children}</h2>
);

const Description: React.FC<HeaderProps> = ({ children }) => (
  <p className='text-muted-foreground text-sm'>{children}</p>
);

const Container: React.FC<HeaderProps> = ({ children }) => (
  <div className='flex flex-col gap-1'>{children}</div>
);

export const Header = {
  Title,
  Description,
  Container,
};