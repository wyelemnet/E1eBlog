import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

import CodeBlock from '../CodeBlock';

const containerStyle = {
  padding: '120px',
  backgroundColor: 'aliceblue',
};

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
    <div style={containerStyle}>
      <ReactMarkdown
        source={data}
        escapeHtml={false}
        renderers={{
          code: CodeBlock,
        }}
      ></ReactMarkdown>
    </div>
  );
};

export default MarkdownCode;
