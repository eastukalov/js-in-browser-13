'use strict';

const query = new XMLHttpRequest();
const plane = document.getElementById('acSelect');
const schema = document.getElementById('seatMapDiv');
let halfCount = 0;
let adultCount = 0;
let  selectPlane = false;

document.getElementById('btnSeatMap').addEventListener('click', () => {
  event.preventDefault();
  query.open('GET', `https://neto-api.herokuapp.com/plane/${plane.value}`);
  query.addEventListener('load', viewSchema);
  query.send();
});
document.getElementById('btnSetFull').addEventListener('click', () => reservationAll('unFree'));
document.getElementById('btnSetEmpty').addEventListener('click', () => reservationAll('free'));

function viewSchema() {
  if (query.status === 200) {
    let json;

    try {
      json = JSON.parse(query.responseText);
    } catch (e) {}

    selectPlane = true;
    document.querySelector('#seatMapDiv .text-center').style.display = 'none';
    document.getElementById('seatMapTitle').textContent = `${json.title} (${json.passengers} пассажиров)`;

    const first = schema.firstElementChild.cloneNode(true);

    while (schema.firstElementChild) {
      schema.removeChild(schema.firstElementChild);
    }

    schema.appendChild(first);
    const frag = createTemplate(templateSchema(json));
    schema.appendChild(frag);

    for (const seat of document.querySelectorAll('#seatMapDiv .col-xs-4.seat')) {
      seat.addEventListener('mousedown', reservation);
    }

    statistic(adultCount, halfCount);
  }

}

function reservation() {
  event.preventDefault();
  const el = event.currentTarget;

  if ((event.buttons & 1) !== 1) {
    return;
  }

  if (el.classList.contains('adult')) {
    el.classList.remove('adult');
    adultCount--;
  } else if (el.classList.contains('half')) {
    el.classList.remove('half');
    halfCount--;
  } else if (event.altKey) {
    el.classList.add('half');
    halfCount++;
  } else {
    el.classList.add('adult');
    adultCount++;
  }

  statistic(adultCount, halfCount);
}

function statistic(adult, half) {
  document.getElementById('totalAdult').textContent = adult;
  document.getElementById('totalHalf').textContent = half;
  document.getElementById('totalPax').textContent = half + adult;
}

function reservationAll(action) {
  event.preventDefault();

  if (!selectPlane) {
    return;
  }

  for (const seat of document.querySelectorAll('#seatMapDiv .col-xs-4.seat')) {
    if (action === 'free') {
      seat.classList.remove('half');
      seat.classList.remove('adult');
      halfCount = 0;
      adultCount = 0;
    } else {
      if (!seat.classList.contains('adult') && !seat.classList.contains('half')) {
        seat.classList.add('adult');
        adultCount++;
      }
    }

    statistic(adultCount, halfCount);
  }

}

function templateSchema(json) {
  let result =  [];
  let count = 1;

  for(const el of json.scheme) {
    result.push({
      tag: 'div',
      cls: 'row seating-row text-center',
      content: []
    });

    result[count - 1].content.push({
      tag: 'div',
      cls: 'col-xs-1 row-number',
      content: {
        tag: 'h2',
        cls: '',
        content: count
      }
    });

    let trio = 0;

    for (let i = 0; i < el; i++) {

      if (i === 0 || i === 3) {
        result[count - 1].content.push({
          tag: 'div',
          cls: 'col-xs-5',
          content: []
        });

        trio++;
      }

      result[count - 1].content[trio].content.push({
        tag: 'div',
        cls: 'col-xs-4 seat',
        content: {
          tag: 'span',
          cls: 'seat-label',
          content: `${(el === 6) ? json.letters6[i] : json.letters4[i]}`
        }
      });

    }

    trio = 2;

    if (el === 0) {
      trio = 0
    } else if (el === 4) {
      trio = 1;
    }

    for(let i = trio; i < 2; i++) {

      if (trio === 0) {
        result[count - 1].content.push({
          tag: 'div',
          cls: 'col-xs-5',
          content: []
        });
      }

      for(let k = 0; k < (3 - ((el > 3) ? el - 3 : el)); k++) {
        result[count - 1].content[i + 1].content.push({
          tag: 'div',
          cls: 'col-xs-4 no-seat'
        });

      }
    }

    count++;
  }

  return result;
}

function addBr(text) {

  return text.toString().split('\n').reduce((f, item, key, array) => {
    f.appendChild(document.createTextNode(item));

    if ((array.length - 1) > key) {
      f.appendChild(document.createElement('br'));
    }
    return f;
  }, document.createDocumentFragment());

}

function createTemplate(block) {

  if ((typeof block === 'string') || (typeof block === 'number')) {
    return addBr(block);
  }

  if (Array.isArray(block)) {
    return block.reduce((f, item) => {
      f.appendChild(createTemplate(item));
      return f;
    }, document.createDocumentFragment());
  }

  const el = document.createElement(block.tag);
  el.className = block.cls;

  if (block.content) {
    el.appendChild(createTemplate(block.content));
  }

  if (block.attrs) {
    Object.keys(block.attrs).forEach((key) => {
      el.setAttribute(key, block.attrs[key]);
    });
  }

  if (block.style) {
    Object.keys(block.style).forEach((key) => {
      el.style[key] = block.style[key];
    });
  }

  return el;
}