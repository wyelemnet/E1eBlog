// 打字效果
export const typingAnimition = (container, text, index = 0) => {
  if (index < text.length) {
    container.innerHTML += text.charAt(index);
    setTimeout(typingAnimition.bind(this, container, text, ++index), 300);
  } else {
    container.innerHTML = '';
    index = 0;
    typingAnimition(container, text, index);
  }
};
