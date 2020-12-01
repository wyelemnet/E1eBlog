import React from 'react';

import aboutMe from '../assets/md/aboutMe.md';
import MarkdownCode from '../components/MarkdownCode';

const AboutMe = (props) => {
  return <MarkdownCode url={aboutMe}></MarkdownCode>;
};

export default AboutMe;
