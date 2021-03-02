import React from 'react';

import aboutMe from '../assets/md/aboutMe.md';
import MarkdownCode from '../components/MarkdownCode';
import weChat from '../assets/images/others/weChat.jpg';

const weChatStyle = {
  marginLeft: 'calc(50% - 100px)',
  width: '200px',
};

const AboutMe = () => {
  return (
    <>
      <MarkdownCode url={aboutMe}></MarkdownCode>
      <img src={weChat} alt='weChat' style={weChatStyle}></img>
    </>
  );
};

export default AboutMe;
