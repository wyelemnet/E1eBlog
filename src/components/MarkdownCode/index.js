import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import styled from 'styled-components';

import CodeBlock from '../CodeBlock';

const Container = styled.div`
  padding: 120px 120px 20px 30%;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 10px;
    font-weight: 600;
  }

  code {
    word-break: break-word;
    border-radius: 2px;
    overflow-x: auto;
    background-color: #fff5f5;
    color: #ff502c;
    padding: 3px 5px;
  }

  pre > code {
    margin: 0;
    word-break: normal;
    display: block;
    overflow-x: auto;
    background: #2a2a2a;
  }

  p {
    padding: 5px;
    margin-bottom: 0;
  }

  ul > li {
    list-style: inside;
  }

  ol > li {
    list-style: decimal;
  }

  img {
    width: 600px;
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
