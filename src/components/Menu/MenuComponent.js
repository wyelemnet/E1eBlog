import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Menu } from 'antd';
import {
  HomeOutlined,
  ReadOutlined,
  UserOutlined,
  GithubOutlined,
} from '@ant-design/icons';

import './MenuComponent.less';
import { goOutWebsite } from '../../utils/index';
import { MenuContext } from '../../reduces/contexts';
import { UPDATE_MENU_KEY } from '../../reduces/types';

const MenuComponent = () => {
  const { menuKey, dispatch } = useContext(MenuContext);
  const history = useHistory();
  const pathname = history.location.pathname;
  let currentKey = pathname.substring(1);
  const hasMore = currentKey.indexOf('/');
  if (hasMore !== -1) {
    currentKey = currentKey.substring(0, hasMore);
  }
  dispatch({ type: UPDATE_MENU_KEY, data: currentKey });

  const handleClick = (e) => {
    if (e.key !== 'github') {
      dispatch({ type: UPDATE_MENU_KEY, data: e.key });
      history.push(`/${e.key}`);
    }
  };

  return (
    <>
      <Menu
        className='menu-container'
        onClick={handleClick}
        selectedKeys={[menuKey]}
        mode='horizontal'
      >
        <Menu.Item key='home' icon={<HomeOutlined />}>
          Home
        </Menu.Item>
        <Menu.Item key='article' icon={<ReadOutlined />}>
          Article
        </Menu.Item>
        <Menu.Item key='aboutMe' icon={<UserOutlined />}>
          AboutMe
        </Menu.Item>
        <Menu.Item
          onClick={() => goOutWebsite('https://github.com/wyelemnet')}
          key='github'
          icon={<GithubOutlined />}
        >
          Github
        </Menu.Item>
      </Menu>
    </>
  );
};

export default MenuComponent;
