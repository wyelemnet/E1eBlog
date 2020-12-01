import React from 'react';

import aboutMe from '../assets/md/aboutMe.md';
import MarkdownCode from '../components/MarkdownCode';
import weChat from '../assets/images/weChat.jpg';

const weChatStyle = {
  marginLeft: '30%',
  marginTop: '-60px',
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
