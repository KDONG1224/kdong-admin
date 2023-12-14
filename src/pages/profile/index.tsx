import React from 'react';

export const LazyProfileBannerPage = React.lazy(
  () => import('./ProfileBannerPage')
);
export const LazyProfileKdongPage = React.lazy(
  () => import('./ProfileKdongPage')
);
export const LazyProfileFaqPage = React.lazy(() => import('./ProfileFaqPage'));
