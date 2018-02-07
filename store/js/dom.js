'use strict';

function addBr(text) {

  return text.toString().split('\n').reduce((f, item, key, array) => {
    f.appendChild(document.createTextNode(item));

    if ((array.length - 1) > key) {
      f.appendChild(document.createElement('br'));
    }
    return f;
  }, document.createDocumentFragment());

}

function createElement(block) {

  if ((typeof block === 'string') || (typeof block === 'number')) {
    return addBr(block);
  }

  if (Array.isArray(block)) {
    return block.reduce((f, item) => {
      f.appendChild(createElement(item));
      return f;
    }, document.createDocumentFragment());
  }

  const el = document.createElement(block.name);

  if (block.childs) {
    el.appendChild(createElement(block.childs));
  }

  if (block.props) {
    Object.keys(block.props).forEach((key) => {
      el.setAttribute(key, block.props[key]);
    });
  }

  return el;
}

const nodeMy = {
  name: 'h1',
  props: {
    class: 'main-title'
  },
  childs: [
    'Заголовок'
  ]
};

const elementMy = createElement(nodeMy);
const wrapperMy = document.getElementById('root');
wrapperMy.appendChild(elementMy);