// base
import React, { Suspense, useEffect } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';

// pages
import { LazySignInPage, LazySignUpPage } from 'pages';

// components
import { AuthorizedResult, NotFoundResult, PageLoader } from 'components';

// routes
import { routes } from 'routes';
import { PrivateRoute } from 'routes/PrivateRoute';
import { ROUTE_SIGN_IN, ROUTE_SIGN_UP } from 'routes/const';

// libraries
import hljs from 'highlight.js';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { loadingState } from 'modules/ui';
import { message } from 'antd';
import { ResponseUserInfo } from 'modules';

import 'highlight.js/styles/github-dark.min.css';

const StyledApp = styled.div`
  height: 100vh;
`;

const App = () => {
  const loading = useRecoilValue(loadingState);

  const b = useRecoilValue(loadingState);
  message.config({
    top: 50,
    duration: 2,
    maxCount: 1,
    rtl: true
  });

  const checkUser = (user: ResponseUserInfo) => {
    const arr = ['ADMIN', 'CLIENT', 'USER'];
    const checkArr = arr.every((item) => user?.role === item);

    return !checkArr;
  };

  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <Router>
      <StyledApp className="App">
        {loading && <PageLoader />}

        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path={ROUTE_SIGN_IN} component={LazySignInPage} />
            <Route path={ROUTE_SIGN_UP} component={LazySignUpPage} />
            {routes.common.map((item, idx) => (
              <PrivateRoute
                key={idx}
                path={item.path}
                fallback={AuthorizedResult}
                isPermission={(user) => checkUser(user as any)}
                component={item.component}
                exact
              />
            ))}

            <Route path="*" component={NotFoundResult} />
          </Switch>
        </Suspense>
      </StyledApp>
    </Router>
  );
};

export default App;
