import React from 'react';

export const LazyArticleListPage = React.lazy(
  () => import('./ArticleListPage')
);
export const LazyArticleDetailPage = React.lazy(
  () => import('./ArticleDetailPage')
);
