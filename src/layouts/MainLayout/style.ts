import { Layout } from 'antd';
import styled from 'styled-components';

export const StyledMainLayout = styled(Layout)`
  min-height: 100vh;

  .ant-layout-sider {
    background: #000 !important;

    .ant-layout-sider-children {
      .ant-menu {
        background: #000 !important;
      }
    }

    .ant-layout-sider-trigger {
      background: #000 !important;
    }
  }

  .layout-right {
    .ant-layout-header {
      padding: 0;
      background: #fff;
      border-bottom: 1px solid #fddd;

      .header-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        font-weight: 500;

        &-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
      }
    }

    .ant-layout-content {
      margin: 16px;

      .main-wrapper {
        background: #fff;
        padding: 24px;
        min-height: 360px;
        height: 100%;
      }
    }

    .ant-layout-footer {
      text-align: center;
      background: #fff;
    }
  }
`;
