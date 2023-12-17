// base
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

// style
import { StyledMainLayout } from './style';

// components
import { BasicAvatar } from 'components';

// modules
import { userLoginState } from 'modules/auth';
import { collapsedState } from 'modules/ui';

// services
import { cookieStorage } from 'services/cookie';

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
  ROUTE_PROFILE_BANNER,
  ROUTE_PROFILE_FAQ,
  ROUTE_PROFILE_KDONG,
  ROUTE_ROOT,
  ROUTE_SETTING,
  ROUTE_SIGN_IN,
  ROUTE_USER,
  ROUTE_USER_EMAIL,
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
import { MenuInfo } from 'rc-menu/lib/interface';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { get } from 'http';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [activeKey, setActiveKey] = useState<string[]>([]);

  const [collapsed, setCollapsed] = useRecoilState(collapsedState);
  const { isLogin, userInfo } = useRecoilValue(userLoginState);

  const setLogout = useSetRecoilState(userLoginState);

  const history = useHistory();
  const pathname = history.location.pathname;

  const items: MenuItem[] = [
    getItem('대시보드', ROUTE_ROOT, <AppstoreOutlined />),
    getItem('프로필', ROUTE_PROFILE, <UserOutlined />, [
      getItem('KDONG', ROUTE_PROFILE_KDONG),
      getItem('메인 배너', ROUTE_PROFILE_BANNER),
      getItem('FAQ', ROUTE_PROFILE_FAQ)
    ]),
    getItem('유저관리', ROUTE_USER, <TeamOutlined />, [
      getItem('유저목록', ROUTE_USER_MANAGEMENT),
      getItem('이메일 요청', ROUTE_USER_EMAIL)
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

  const onChangeCollasped = (value: boolean) => {
    setCollapsed(value);
  };

  const onChangeOpenKeys = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const onSignIn = () => {
    history.push(ROUTE_SIGN_IN);
  };

  const onSignOut = () => {
    cookieStorage.clearAllCookies();
    setLogout({
      userInfo: undefined,
      isLogin: false
    });
    history.push(ROUTE_SIGN_IN);
  };

  useEffect(() => {
    if (collapsed) return;

    const openkey = `/${pathname.split('/').filter(Boolean)[0]}`;

    setActiveKey([pathname]);
    setOpenKeys([openkey]);
  }, [collapsed, pathname]);

  return (
    <StyledMainLayout>
      {/* Layout - Sider */}
      <Layout.Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onChangeCollasped}
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
          defaultOpenKeys={openKeys}
        />
      </Layout.Sider>

      {/* Layout Content */}
      <Layout className="layout-right">
        <Layout.Header>
          <div className="header-wrapper">
            <div>KDONG's Portfolio</div>
            <div className="header-wrapper-right">
              {isLogin && userInfo && (
                <BasicAvatar
                  text={userInfo.username.split('')[0]}
                  gap={10}
                  size={40}
                  style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}
                />
              )}
              <Button
                type="primary"
                onClick={() => {
                  if (isLogin && userInfo) {
                    onSignOut();
                  } else {
                    onSignIn();
                  }
                }}
              >
                {isLogin && userInfo ? '로그아웃' : '로그인'}
              </Button>
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
