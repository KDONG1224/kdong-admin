// base
import ReactDOM from 'react-dom/client';

// app
import App from './App';

// libraries
import { RecoilRoot } from 'recoil';
import { ConfigProvider } from 'antd';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// consts
import { themes } from 'consts';

// styles
import 'antd/dist/reset.css';
import './assets/scss/index.scss';

import locale from 'antd/locale/ko_KR';
import 'dayjs/locale/ko';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true
    }
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <QueryClientProvider client={queryClient}>
    <RecoilRoot>
      <ConfigProvider theme={themes} locale={locale}>
        <ReactQueryDevtools initialIsOpen={false} />
        <App />
      </ConfigProvider>
    </RecoilRoot>
  </QueryClientProvider>
);
