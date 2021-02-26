// 打字效果
export const typingAnimation = (container, text, index = 0) => {
  if (index < text.length) {
    container.innerHTML += text.charAt(index);
    setTimeout(typingAnimation.bind(this, container, text, ++index), 300);
  } else {
    // 最后一个字停止500ms后重新开始
    setTimeout(() => {
      container.innerHTML = '';
      index = 0;
      typingAnimation(container, text, index);
    }, 500);
  }
};

export const goOutWebsite = (url) => {
  let aElement = document.createElement('a');

  aElement.setAttribute('href', url);
  aElement.setAttribute('target', '_blank');
  aElement.click();
  aElement = null;
};
