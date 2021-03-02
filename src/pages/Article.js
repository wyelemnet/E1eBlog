import React from 'react';
import { Route, Switch, useRouteMatch, useHistory } from 'react-router-dom';
import { Timeline } from 'antd';
import styled from 'styled-components';

import ArticleDetail from '../components/ArticleDetail';
import { ARTICLES_INFO } from '../utils/constants';

const TimelineContainer = styled.div`
  padding-top: 100px;
  width: 50%;
  transform: translateX(50%);

  .ant-timeline-item-content {
    cursor: pointer;
    &:hover {
      color: #1da57a;
      font-weight: 700;
      font-size: 18px;
    }
  }
`;

const Article = () => {
  const history = useHistory();
  const { path } = useRouteMatch();
  const articles = ARTICLES_INFO.slice(0).reverse();
  const goArticleDetail = (id) => {
    history.push(`/article/${id}`);
  };

  return (
    <>
      <Switch>
        <Route exact path={path}>
          <TimelineContainer>
            <Timeline mode='left'>
              {articles.map((item) => (
                <Timeline.Item
                  label={item.createTime}
                  key={item.id}
                  onClick={() => goArticleDetail(item.id)}
                >
                  {item.title}
                </Timeline.Item>
              ))}
            </Timeline>
          </TimelineContainer>
        </Route>
        <Route path={`${path}/:articleId`}>
          <ArticleDetail></ArticleDetail>
        </Route>
      </Switch>
    </>
  );
};

export default Article;
