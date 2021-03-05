import React, { useState, useEffect } from 'react';
import { Pagination } from 'antd';

import './HomeContent.less';
import HomeContentItem from '../HomeContentItem/HomeContentItem';
import LearningWebsite from '../LearningWebsite/LearningWebsite';
import { ARTICLES_INFO } from '../../utils/constants';

const HomeContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const pageSize = 8;

  useEffect(() => {
    setArticles(
      ARTICLES_INFO.slice(pageSize * (currentPage - 1), pageSize * currentPage),
    );
  }, [currentPage]);

  const items = articles.map((item) => (
    <HomeContentItem info={item} key={item.id}></HomeContentItem>
  ));

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className='home-content-container'>
        <div className='items-container'>{items}</div>
        <LearningWebsite></LearningWebsite>
      </div>
      <Pagination
        className='pagination-container'
        defaultPageSize={pageSize}
        defaultCurrent={1}
        total={ARTICLES_INFO.length}
        onChange={handlePageChange}
      />
    </>
  );
};

export default HomeContent;
