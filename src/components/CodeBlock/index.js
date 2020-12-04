import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
// 设置高亮样式
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism';
// 设置高亮的语言
import {
  jsx,
  javascript,
} from 'react-syntax-highlighter/dist/esm/languages/prism';

const CodeBlock = (props) => {
  useEffect(() => {
    // 注册要高亮的语法，
    // 注意：如果不设置打包后供第三方使用是不起作用的
    SyntaxHighlighter.registerLanguage('jsx', jsx);
    SyntaxHighlighter.registerLanguage('javascript', javascript);
    SyntaxHighlighter.registerLanguage('js', javascript);
  }, []);

  const { language, value } = props;

  return (
    <figure className='highlight'>
      <SyntaxHighlighter language={language} style={xonokai}>
        {value}
      </SyntaxHighlighter>
    </figure>
  );
};

CodeBlock.prototype = {
  language: PropTypes.string.isRequired,
  value: PropTypes.string,
};

CodeBlock.defaultProps = {
  language: null,
};

export default CodeBlock;
