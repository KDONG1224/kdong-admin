import * as paths from './const';
import * as pages from 'pages';

interface RoutesOption {
  path: string;
  component: React.FunctionComponent;
}

interface Routes {
  common: RoutesOption[];
}

export const routes: Routes = {
  common: [
    {
      path: paths.ROUTE_ROOT,
      component: pages.LazyHomePage
    },
    {
      path: paths.ROUTE_ARTICLE_LIST,
      component: pages.LazyArticleListPage
    },
    {
      path: paths.ROUTE_ARTICLE_CREATE,
      component: pages.LazyArticleDetailPage
    },
    {
      path: paths.ROUTE_ARTICLE_DETAIL_ID,
      component: pages.LazyArticleDetailPage
    },
    {
      path: paths.ROUTE_ARTICLE_CATEGORY,
      component: pages.LazyArticleCategoryPage
    },
    {
      path: paths.ROUTE_USER_MANAGEMENT,
      component: pages.LazyUserMangementPage
    },
    {
      path: paths.ROUTE_USER_EMAIL,
      component: pages.LazyUserEmailPage
    },
    {
      path: paths.ROUTE_PROFILE_KDONG,
      component: pages.LazyProfileKdongPage
    },
    {
      path: paths.ROUTE_PROFILE_BANNER,
      component: pages.LazyProfileBannerPage
    },
    {
      path: paths.ROUTE_PROFILE_FAQ,
      component: pages.LazyProfileFaqPage
    }
  ]
};
