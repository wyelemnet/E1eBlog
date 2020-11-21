import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeOutlined, ReadOutlined, UserOutlined } from '@ant-design/icons';

import './MenuComponent.less';

const MenuComponent = () => {
  const [current, setCurrent] = useState('home');
  const history = useHistory();
  const handleClick = (e) => {
    setCurrent(e.key);
    history.push(e.key);
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
          WeChat
        </Menu.Item>
      </Menu>
    </>
  );
};

export default MenuComponent;
