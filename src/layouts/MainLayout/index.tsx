// base
import React, { useEffect, useState } from 'react';

// style
import { StyledMainLayout } from './style';

// components
import { BasicAvatar } from 'components';

// utils
import { MenuItem, getItem } from 'utils';

// routes
import {
  ROUTE_ARTICLE,
  ROUTE_ARTICLE_CATEGORY,
  ROUTE_ARTICLE_LIST,
  ROUTE_EVENT,
  ROUTE_GUESTBOOK,
  ROUTE_PROFILE,
  ROUTE_ROOT,
  ROUTE_SETTING,
  ROUTE_USER,
  ROUTE_USER_MANAGEMENT
} from 'routes/const';

// libraries
import { Button, Layout, Menu } from 'antd';
import {
  AppstoreOutlined,
  BuildOutlined,
  ContactsOutlined,
  ReadOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router';
import { MenuInfo } from 'rc-menu/lib/interface';
import { userLoginState } from 'modules/auth';
import { useRecoilValue } from 'recoil';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [activeKey, setActiveKey] = useState<string[]>([]);

  const user = useRecoilValue(userLoginState);

  const history = useHistory();
  const pathname = history.location.pathname;

  const items: MenuItem[] = [
    getItem('대시보드', ROUTE_ROOT, <AppstoreOutlined />),
    getItem('프로필', ROUTE_PROFILE, <UserOutlined />),
    getItem('유저관리', ROUTE_USER, <TeamOutlined />, [
      getItem('유저목록', ROUTE_USER_MANAGEMENT)
    ]),
    getItem('게시글', ROUTE_ARTICLE, <ReadOutlined />, [
      getItem('게시글 목록', ROUTE_ARTICLE_LIST),
      getItem('게시글 카테고리', ROUTE_ARTICLE_CATEGORY)
    ]),
    getItem('방명록', ROUTE_GUESTBOOK, <ContactsOutlined />),
    getItem('이벤트', ROUTE_EVENT, <BuildOutlined />),
    getItem('Setting', ROUTE_SETTING, <SettingOutlined />)
  ];

  const onClickMenu = (info: MenuInfo) => {
    const { key, keyPath } = info;

    setOpenKeys([keyPath[keyPath.length - 1]]);
    history.push(key.toString());
  };

  const onChangeOpenKeys = (keys: string[]) => {
    setOpenKeys(keys);
  };

  useEffect(() => {
    const openkey = `/${pathname.split('/').filter(Boolean)[0]}`;

    setActiveKey([pathname]);
    setOpenKeys([openkey]);
  }, [pathname]);

  return (
    <StyledMainLayout>
      {/* Layout - Sider */}
      <Layout.Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Menu
          theme="dark"
          mode="inline"
          items={items}
          onClick={onClickMenu}
          onOpenChange={onChangeOpenKeys}
          openKeys={openKeys}
          selectedKeys={activeKey}
          defaultSelectedKeys={[ROUTE_ROOT]}
        />
      </Layout.Sider>

      {/* Layout Content */}
      <Layout className="layout-right">
        <Layout.Header>
          <div className="header-wrapper">
            <div>KDONG's Portfolio</div>
            <div className="header-wrapper-right">
              {user && user.userInfo && (
                <BasicAvatar
                  text={user.userInfo.username}
                  gap={10}
                  size={45}
                  style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}
                />
              )}
              <Button type="primary">로그인</Button>
            </div>
          </div>
        </Layout.Header>
        <Layout.Content style={{ background: '#fff' }}>
          <div className="main-wrapper">{children}</div>
        </Layout.Content>
        <Layout.Footer>
          COPYRIGHT © 2023 BY KDONG., Ltd. All rights reserved.
        </Layout.Footer>
      </Layout>
    </StyledMainLayout>
  );
};
