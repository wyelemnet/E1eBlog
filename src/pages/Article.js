import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import ArticleDetail from '../components/ArticleDetail';

const containerStyle = {
  paddingTop: 60,
};

const Article = () => {
  const { path } = useRouteMatch();

  return (
    <div style={containerStyle}>
      <Switch>
        <Route exact path={path}>
          <span>Article</span>
        </Route>
        <Route path={`${path}/:articleId`}>
          <ArticleDetail></ArticleDetail>
        </Route>
      </Switch>
    </div>
  );
};

export default Article;
