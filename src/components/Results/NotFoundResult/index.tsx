import { Result, Button } from 'antd';
import { useHistory } from 'react-router';
import { ROUTE_ROOT } from 'routes/const';

export const NotFoundResult = () => {
  const history = useHistory();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => history.push(ROUTE_ROOT)}>
          Back Home
        </Button>
      }
    />
  );
};
