import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Menu } from 'antd';
import {
  HomeOutlined,
  ReadOutlined,
  UserOutlined,
  GithubOutlined,
} from '@ant-design/icons';

import './MenuComponent.less';

const MenuComponent = () => {
  const [current, setCurrent] = useState('home');
  const history = useHistory();
  const handleClick = (e) => {
    if (e.key !== 'github') {
      setCurrent(e.key);
      history.push(e.key);
    }
  };

  const goGithub = () => {
    let aElement = document.createElement('a');

    aElement.setAttribute('href', 'https://github.com/wyelemnet');
    aElement.setAttribute('target', '_blank');
    aElement.click();
    aElement = null;
  };

  return (
    <>
      <Menu
        className='menu-container'
        onClick={handleClick}
        selectedKeys={[current]}
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
        <Menu.Item onClick={goGithub} key='github' icon={<GithubOutlined />}>
          Github
        </Menu.Item>
      </Menu>
    </>
  );
};

export default MenuComponent;
