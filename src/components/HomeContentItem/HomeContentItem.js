import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import { useHistory } from 'react-router-dom';

import './HomeContentItem.less';
import { CATEGORY_COLORS } from '../../utils/constants';
import { UPDATE_MENU_KEY } from '../../reduces/types';
import { MenuContext } from '../../reduces/contexts';

const HomeContentItem = (props) => {
  const { dispatch } = useContext(MenuContext);
  const history = useHistory();
  const info = props.info;
  const getTagColor = () => {
    const categoryColor = CATEGORY_COLORS.find(
      (item) => item.category === info.category,
    );
    return categoryColor && categoryColor.color;
  };
  const goArticleDetail = (id) => {
    dispatch({ type: UPDATE_MENU_KEY, data: 'arcticle' });
    history.push(`/article/${id}`);
  };

  return (
    <>
      <div
        className='home-content-item-container'
        onClick={() => goArticleDetail(info.id)}
      >
        <h2 className='title'>{info.title}</h2>
        <div className='desc'>{info.desc}</div>
        <div className='category-container'>
          <Tag color={getTagColor()}>{info.category}</Tag>
          <span className='create-time'>{info.createTime}</span>
        </div>
      </div>
    </>
  );
};

HomeContentItem.propTypes = {
  info: PropTypes.object.isRequired,
};

export default HomeContentItem;
