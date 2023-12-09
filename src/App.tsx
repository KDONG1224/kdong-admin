// base
import React, { Suspense } from 'react';
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
import styled from 'styled-components';

const StyledApp = styled.div`
  height: 100vh;
`;

const App = () => {
  const checkUser = (user: any) => {
    // const arr = ['partner', 'anno', 'compliance'];
    // const checkArr = arr.every(item => user?.accountType === item);

    // return !checkArr;

    return true;
  };

  return (
    <Router>
      <StyledApp className="App">
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
