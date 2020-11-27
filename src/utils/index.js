// 打字效果
export const typingAnimition = (container, text, index = 0) => {
  console.log(text);
  if (index < text.length) {
    container.innerHTML += text.charAt(index);
    setTimeout(typingAnimition.bind(this, container, text, ++index), 300);
  } else {
    container.innerHTML = '';
    index = 0;
    typingAnimition(container, text, index);
  }
};

export const goOutWebsite = (url) => {
  let aElement = document.createElement('a');

  aElement.setAttribute('href', url);
  aElement.setAttribute('target', '_blank');
  aElement.click();
  aElement = null;
};
