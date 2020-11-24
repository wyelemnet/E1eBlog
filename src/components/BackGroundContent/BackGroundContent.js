import React, { useEffect } from 'react';
import './BackGroundContent.less';

import { typingAnimition } from '../../utils/index';
import { SENTENCES } from '../../utils/constants';

const BackGroundContent = () => {
  const weekDay = new Date().getDay();
  const sentence = SENTENCES[weekDay];

  useEffect(() => {
    const sentenceElement = document.getElementById('sentence');
    typingAnimition(sentenceElement, sentence.text);

    return () => {
      const maxTimer = setTimeout({}, 0);
      for (let i = 1; i <= maxTimer; i++) {
        clearTimeout(i);
      }
    };
  });

  return (
    <>
      <div className='back-content-container'>
        <div className='content-container'>
          <h2>E1e's Home;</h2>
          <div id='sentence'></div>
        </div>
      </div>
    </>
  );
};

export default BackGroundContent;
