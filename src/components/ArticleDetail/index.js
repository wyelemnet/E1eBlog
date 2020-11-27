import React from 'react';
import { useParams } from 'react-router-dom';

const articleDetailStyle = {
  paddingTop: 60,
};

const ArticleDetail = () => {
  const { articleId } = useParams();

  return (
    <div style={articleDetailStyle}>
      ArticleDetail<span>{articleId}</span>
    </div>
  );
};

export default ArticleDetail;
