import React from 'react';

export const LazySignInPage = React.lazy(() => import('./SignInPage'));
export const LazySignUpPage = React.lazy(() => import('./SignUpPage'));