'use strict';

function showComments(list) {
  const commentsContainer = document.querySelector('.comments');
  // const comments = list.map(createComment).join('');
  // commentsContainer.innerHTML += comments;
  let frag = createComment(list.map(templateComment));
  commentsContainer.appendChild(frag);
}

// function createComment1(comment) {
//   return `<div class="comment-wrap">
//     <div class="photo" title="${comment.author.name}">
//       <div class="avatar" style="background-image: url('${comment.author.pic}')"></div>
//     </div>
//     <div class="comment-block">
//       <p class="comment-text">
//         ${comment.text.split('\n').join('<br>')}
//       </p>
//       <div class="bottom-comment">
//         <div class="comment-date">${new Date(comment.date).toLocaleString('ru-Ru')}</div>
//         <ul class="comment-actions">
//           <li class="complain">Пожаловаться</li>
//           <li class="reply">Ответить</li>
//         </ul>
//       </div>
//     </div>
//   </div>`
// }

function addBr(text) {
  return text.toString().split('\n').reduce((f, item, key, array) => {
    f.appendChild(document.createTextNode(item));

    if ((array.length - 1) > key) {
      f.appendChild(document.createElement('br'));
    }
    return f;
  }, document.createDocumentFragment());
}

function  templateComment(comment) {
  return {
    tag: 'div',
    cls: 'comment-wrap',
    content: [
      {
        tag: 'div',
        cls: 'photo',
        attrs: {
          title: `${comment.author.name}`
        },
        content: {
          tag: 'div',
          cls: 'avatar',
          style: {
            "background-image": `url('${comment.author.pic}')`
          }
        }
      },
      {
        tag: 'div',
        cls: 'comment-block',
        content: [
          {
            tag: 'p',
            cls: 'comment-text',
            content: `${comment.text}`
            //проще сделать так, но это изменение верстки, т.ч. переносы строки функцией addBr добавляю
            // content: {
            //   tag: 'pre',
            //   content: `${comment.text}`
            // }
          },
          {
            tag: 'div',
            cls: 'bottom-comment',
            content: [
              {
                tag: 'div',
                cls: 'comment-date',
                content: `${new Date(comment.date).toLocaleString('ru-Ru')}`
              },
              {
                tag: 'ul',
                cls: 'comment-actions',
                content: [
                  {
                    tag: 'li',
                    cls: 'complain',
                    content: 'Пожаловаться'
                  },
                  {
                    tag: 'li',
                    cls: 'reply',
                    content: 'Ответить'
                  }
                ]
              }
            ]
          }
        ]
      }
    ],

  };
}

function createComment(comment) {

  if ((typeof comment === 'string') || (typeof comment === 'number')) {
    return addBr(comment);
  }

  if (Array.isArray(comment)) {
    return comment.reduce((f, item) => {
      f.appendChild(createComment(item));
      return f;
    }, document.createDocumentFragment());
  }

  const el = document.createElement(comment.tag);
  el.className = comment.cls;

  if (comment.content) {
    el.appendChild(createComment(comment.content));
  }

  if (comment.attrs) {
    Object.keys(comment.attrs).forEach((key) => {
      el.setAttribute(key, comment.attrs[key]);
    });
  }

  if (comment.style) {
    Object.keys(comment.style).forEach((key) => {
      el.style[key] = comment.style[key];
    });
  }

  return el;
}

fetch('https://neto-api.herokuapp.com/comments')
  .then(res => res.json())
  .then(showComments);
