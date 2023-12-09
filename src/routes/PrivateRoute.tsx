// base
import React, { useEffect } from 'react';
import { RouteProps, Route } from 'react-router';

// modules
import { ResponseUserInfo } from 'modules';

interface PrivateRouteProps extends RouteProps {
  path: string | string[];
  fallback: React.FunctionComponent;
  isPermission: (user?: ResponseUserInfo) => boolean;
}

export const PrivateRoute = (props: PrivateRouteProps) => {
  const { component, fallback, isPermission, ...rest } = props;

  // const { isLogin, user } = useUser();

  const isLogin = true;

  useEffect(() => {
    // if (isLogin === false) {
    //   window.location.href = ROUTE_SIGN_IN;
    // }
  }, [isLogin]);

  // if (isLogin === undefined || user === undefined) {
  //   return <div />;
  // }

  return (
    <Route
      {...rest}
      component={isPermission(undefined) ? component : fallback}
    />
  );
};
