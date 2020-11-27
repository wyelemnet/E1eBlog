import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

import test from '../assets/md/test.md';

const containerStyle = {
  padding: '120px',
  backgroundColor: 'aliceblue',
};

const AboutMe = () => {
  const [data, setData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:3000${test}`);
      setData(res.data);
    };

    fetchData();
  }, []);

  return (
    <div style={containerStyle}>
      <ReactMarkdown source={data} escapeHtml={false}></ReactMarkdown>
    </div>
  );
};

export default AboutMe;
