import React from 'react';

export const LazyGuestbookListPage = React.lazy(
  () => import('./GuestbookListPage')
);
