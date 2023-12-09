import React from 'react';

export const LazyUserMangementPage = React.lazy(
  () => import('./UserMangementPage')
);
