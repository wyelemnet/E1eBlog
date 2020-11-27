import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import ArticleDetail from '../components/ArticleDetail';

const Article = () => {
  const { path } = useRouteMatch();

  return (
    <>
      <Switch>
        <Route exact path={path}>
          <span>Article</span>
        </Route>
        <Route path={`${path}/:articleId`}>
          <ArticleDetail></ArticleDetail>
        </Route>
      </Switch>
    </>
  );
};

export default Article;
