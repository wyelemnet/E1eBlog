import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import styled from 'styled-components';

import CodeBlock from '../CodeBlock';

const Container = styled.div`
  padding: 120px 120px 20px 30%;

  ul > li {
    list-style: inside;
  }

  ol > li {
    list-style: decimal;
  }

  img {
    width: 600px
  }
`;

const baseUrl = window.location.origin;

const MarkdownCode = (props) => {
  const { url } = props;
  const [data, setData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${baseUrl}${url}`);
      setData(res.data);
    };

    fetchData();
  }, [url]);

  return (
    <Container>
      <ReactMarkdown
        source={data}
        escapeHtml={false}
        renderers={{
          code: CodeBlock,
        }}
      ></ReactMarkdown>
    </Container>
  );
};

export default MarkdownCode;
