import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Tooltip } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import MarkdownCode from '../MarkdownCode';

const Container = styled.div`
  & > span {
    position: fixed;
    top: 130px;
    left: 25%;

    &:hover {
      cursor: pointer;
      color: #1da57a;
    }
  }
  ul {
    li {
      padding: 5px 0;
      list-style: inside;
    }
  }
`;

const ArticleDetail = () => {
  const history = useHistory();
  const { articleId } = useParams();
  const articleContext = require.context(
    '../../assets/md',
    false,
    /[0-9]\.md$/,
  );
  const articlePaths = articleContext
    .keys()
    .map((item) => articleContext(item).default);
  const articlePath = articlePaths.find((item) =>
    item.includes(`article${articleId}`),
  );

  return (
    <Container>
      <Tooltip title='返回'>
        <RollbackOutlined
          onClick={() => {
            history.push('/article');
          }}
          style={{
            fontSize: '30px',
          }}
        />
      </Tooltip>

      <MarkdownCode url={articlePath}></MarkdownCode>
    </Container>
  );
};

export default ArticleDetail;
