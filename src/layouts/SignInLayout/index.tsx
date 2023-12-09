import React from 'react';
import { StyledSignInLayout } from './style';

interface SignInLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SignInLayout: React.FC<SignInLayoutProps> = ({ children, ...props }) => {
  return (
    <StyledSignInLayout {...props}>
      {children}
    </StyledSignInLayout>
  );
};