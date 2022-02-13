function slider(startDate, endDate, startPoint, endPoint) {
  let minBlock = document.querySelector('.min');
  let maxBlock = document.querySelector('.max');
  let rangeColor = document.querySelector('.range-color');
  let sliderBlock = document.querySelector('.slider-block__bar');

  let textBlock = document.querySelector('.slider-block__text');
  let tooltipMin = document.querySelector('.tooltip-min');
  let tooltipMax = document.querySelector('.tooltip-max');
  let tooltipMinBlock = document.querySelector('.tooltip-min__block');
  let tooltipMaxBlock = document.querySelector('.tooltip-max__block');

  let allMonths = document.querySelector('#all-month');

  let switcher = document.getElementsByName('switch');

  let startCoord = getCoords(sliderBlock).left;

  let startYear = +startDate;
  let endYear = +endDate;

  let startPointYear = +startPoint.toString().split(/\.|\//)[1];
  let startPointMonth = +startPoint.toString().split(/\.|\//)[0];
  let endPointYear = +endPoint.toString().split(/\.|\//)[1];
  let endPointMonth = +endPoint.toString().split(/\.|\//)[0];

  let coord = [];
  let curPosMin = (startPointYear - startYear) * 12 + startPointMonth;
  let curPosMax = (endPointYear - startYear) * 12 + endPointMonth;
  let flag = true;
  let curPos = 0;

  let curBlock = '';

  createIndiactor(startYear, endYear);
  moveTo(minBlock, curPosMin);
  moveTo(maxBlock, curPosMax);
  moveTo(tooltipMin, curPosMin);
  moveTo(tooltipMax, curPosMax);
  changeTooltipText(tooltipMinBlock, startPointMonth, startPointYear);
  changeTooltipText(tooltipMaxBlock, endPointMonth, endPointYear);
  getColorRange(coord[curPosMin], coord[curPosMax]);

  window.addEventListener('resize', () => {
    console.log(`resize`);
    startCoord = getCoords(sliderBlock).left;
    coord = stepsGrid();
    createIndiactor(startYear, endYear);
    moveTo(minBlock, curPosMin);
    moveTo(maxBlock, curPosMax);
    moveTo(tooltipMin, curPosMin);
    moveTo(tooltipMax, curPosMax);
    changeTooltipText(tooltipMinBlock, startPointMonth, startPointYear);
    changeTooltipText(tooltipMaxBlock, endPointMonth, endPointYear);
    getColorRange(coord[curPosMin], coord[curPosMax]);
  })

  minBlock.onmousedown = function () {
    curBlock = this;
    curPos = curPosMin;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onMouseUp);
    document.addEventListener('touchmove', onMouseMove);
    this.addEventListener('dragstart', () => false);
  }

  maxBlock.onmousedown = function () {
    curBlock = this;
    curPos = curPosMax;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onMouseUp);
    document.addEventListener('touchmove', onMouseMove);
    this.addEventListener('dragstart', () => false);
  }

  switcher.forEach((item) => {
    item.addEventListener('click', (e) => {
      let startPosMin = curPosMin;
      let startPosMax = curPosMax;

      if (e.target.id == 'all-year' && !flag) {
        curPosMin = (startPointYear - startYear) * 12 + startPosMin;
        curPosMax = (startPointYear - startYear) * 12 + startPosMax;
        flag = true;
        createIndiactor(startYear, endYear);
      } else if (e.target.id == 'all-month' && flag) {
        startPointYear = startYear + Math.floor(startPosMin / 12);

        if (startYear + Math.floor(startPosMax / 12) >= endYear) {
          createIndiactor(startYear + Math.floor(startPosMin / 12), startYear + Math.floor(startPosMax / 12));
        } else {
          createIndiactor(startYear + Math.floor(startPosMin / 12), startYear + Math.floor(startPosMax / 12) + 1);
        }

        curPosMin = (startPointYear - (startYear + Math.floor(startPosMin / 12))) * 12 + (startPosMin % 12);
        curPosMax = ((startYear + Math.floor(startPosMax / 12)) - startPointYear) * 12 + (startPosMax % 12);

        flag = false;
      }

      moveTo(minBlock, curPosMin);
      moveTo(tooltipMin, curPosMin);
      moveTo(maxBlock, curPosMax);
      moveTo(tooltipMax, curPosMax);
      getColorRange(coord[curPosMin], coord[curPosMax]);
    })
  })

  function onMouseMove(e) {
    e.preventDefault();
    let pos = e.clientX;
    console.log(e);
    if (e.touches != undefined) {
      pos = e.targetTouches[0].clientX;
    }
    if (curBlock == minBlock) {
      move(curBlock, tooltipMin, tooltipMinBlock, pos);
    } else {
      move(curBlock, tooltipMax, tooltipMaxBlock, pos);
    }
  }

  function move(elem, ttelem, ttelemblock, x) {
    let cursorCoord = Math.floor(x);

    if (cursorCoord >= coord[curPos + 1]) {
      if ((elem == minBlock && curPos + 1 < curPosMax) ||
        (elem == maxBlock && curPos + 1 > curPosMin)) {
        curPos += 1;
      }
    }
    if (cursorCoord <= coord[curPos - 1]) {
      if ((elem == minBlock && curPos - 1 < curPosMax) ||
        (elem == maxBlock && curPos - 1 > curPosMin)) {
        curPos -= 1;
      }
    }

    moveTo(elem, curPos);
    moveTo(ttelem, curPos);
    getColorRange(coord[curPosMin], coord[curPosMax]);

    if (flag) {
      changeTooltipText(ttelemblock, curPos % 12, startYear + Math.floor(curPos / 12));
    } else {
      changeTooltipText(ttelemblock, curPos % 12, startPointYear + Math.floor(curPos / 12));
    }

    if (elem == minBlock) curPosMin = curPos;
    else curPosMax = curPos;
  }

  function createIndiactor(start, end) {
    let out = '';
    let months = ['фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

    if (start >= endYear) {
      start = start - 1;
      end = end - 1;
    }

    for (let i = start; i < end; i++) {
      out += `<div class="year">${i}</div>`;

      for (let j = 0; j < 11; j++) {
        if (allMonths.checked) {
          out += `<div class="month">${months[j]}</div>`;
        } else {
          out += `<div class="month"></div>`;
        }
      }
    }

    out += `<div class="year">${end}</div>`;

    textBlock.innerHTML = out;
    coord = stepsGrid();
  }

  function changeTooltipText(elem, month, year) {
    let months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    elem.innerHTML = `<p>${months[month]}</p><p>${year}</p>`;
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('touchmove', onMouseMove);
    document.removeEventListener('touchend', onMouseUp);
  }

  function getCoords(elem) {
    let rect = elem.getBoundingClientRect();

    return {
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
      width: rect.width
    }
  }

  function stepsGrid() {
    let textBlocks = document.querySelectorAll('.slider-block__text div')
    let arr = [];

    textBlocks.forEach(item => {
      arr.push(Math.floor(getCoords(item).left + (getCoords(item).width / 2)))
    })
    arr[0] = Math.floor((minBlock.offsetWidth / 2) + startCoord);
    arr[arr.length - 1] = Math.floor(sliderBlock.offsetWidth - minBlock.offsetWidth / 2 + startCoord);

    return arr;
  }

  function moveTo(elem, pos) {
    elem.style.left = Math.floor(coord[pos] - startCoord - getCoords(elem).width / 2) + 'px';
  }

  function getColorRange(left, right) {
    rangeColor.style.width = right - left + 'px';
    rangeColor.style.left = left - startCoord + 'px';
  }

}