import React from 'react';
import { Result, Button } from 'antd';
import { useHistory } from 'react-router';
import { ROUTE_ROOT } from 'routes/const';

export const AuthorizedResult = () => {
  const history = useHistory();

  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button type="primary" onClick={() => history.push(ROUTE_ROOT)}>
          Back Home
        </Button>
      }
    />
  );
};
