import React from 'react';

export const LazyUserMangementPage = React.lazy(
  () => import('./UserMangementPage')
);
export const LazyUserEmailPage = React.lazy(() => import('./UserEmailPage'));
