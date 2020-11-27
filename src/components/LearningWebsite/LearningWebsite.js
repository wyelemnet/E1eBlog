import React from 'react';
import { Popover } from 'antd';

import './LearningWebsite.less';
import { goOutWebsite } from '../../utils';
import { LEARNING_SITES } from '../../utils/constants';

const LearningWebsite = () => {
  return (
    <>
      <div className='learning-website-container'>
        <span>推荐一些网站及书籍：</span>
        {LEARNING_SITES.map((item) => (
          <div className='learning-website' key={item.id}>
            <span className='title'>{item.title}:</span>
            <Popover content={item.desc}>
              <span className='website' onClick={() => goOutWebsite(item.url)}>
                {item.desc}
              </span>
            </Popover>
          </div>
        ))}
      </div>
    </>
  );
};

export default LearningWebsite;
