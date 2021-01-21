const startBtn = document.querySelector('.start');
const refBtn = document.querySelector('.refresh');

startBtn.addEventListener('click', start);
refBtn.addEventListener('click', refresh);

// Initializes the board
window.onload = () => {
  createBoard();
};

// Creates a node
function createNode(row, col, weight) {
  let node = document.createElement('div');

  node.setAttribute('class', 'node');
  node.setAttribute('row', row);
  node.setAttribute('col', col);
  node.setAttribute('cost', Number.POSITIVE_INFINITY);
  node.setAttribute('parent', null);
  node.setAttribute('weight', weight);
  node.innerText = weight.toString();

  return node;
}

// Creates the entire board
function createBoard() {
  let grid = document.querySelector('.container');

  grid.innerHTML = '';

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      let weight = Math.round(Math.random() * (100 - 1) + 1);
      let node = createNode(row, col, weight);
      let shadow = weight / 10;

      node.style.boxShadow = `${shadow}px ${shadow}px ${shadow}px rgba(0,0,0,0.8)`;

      grid.appendChild(node);
    }
  }

  // Declares the start and end nodes
  let startNode = document.querySelector("div[row='0'][col='0']");
  let endNode = document.querySelector("div[row='9'][col='9']");

  startNode.setAttribute('cost', 0);
  startNode.innerHTML = 'Start';
  endNode.innerHTML = 'End';
  startNode.style.boxShadow = `${0}px ${0}px ${0}px rgba(0,0,0,0.6)`;
}

// Refresh button
function refresh() {
  let btn = document.querySelector('.start');
  btn.disabled = false;
  btn.style.opacity = 1;
  createBoard();
}

// Checks and updates node
function checkNode(row, col, curr, checker, seen, counter) {
  if (row >= 0 && col >= 0 && row <= 9 && col <= 9) {
    let node = document.querySelector(`div[row="${row}"][col="${col}"]`);

    let cost = Math.min(
      parseInt(curr.getAttribute('cost')) +
        parseInt(node.getAttribute('weight')),
      node.getAttribute('cost')
    );

    if (cost < node.getAttribute('cost')) {
      node.setAttribute(
        'parent',
        curr.getAttribute('row') + '|' + curr.getAttribute('col')
      );
      node.setAttribute('cost', cost);
    }

    changeColor(node, counter, cost);
    changeColor(curr, counter, false);

    if (!seen.includes(node)) {
      checker.push(node);
    }

    seen.push(node);

    return node;
  } else {
    return false;
  }
}

// Animates the nodes
function changeColor(node, counter, cost) {
  setTimeout(() => {
    node.style.backgroundColor = '#116466';

    if (cost) {
      node.innerHTML = cost;
    }
  }, counter * 100);

  setTimeout(() => {
    node.style.backgroundColor = '#d9b08c';
  }, counter * 100 + 100);
}

// Pathfinding algorithm
function start() {
  let startNode = document.querySelector("div[row='0'][col='0']");
  let endNode = document.querySelector("div[row='9'][col='9']");

  // Disable the start and end buttons
  let buttons = document.querySelectorAll('button');

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
    buttons[i].style.opacity = 0.5;
  }

  // Algorithm starts here
  let seen = [startNode];
  let checker = [startNode];
  let counter = 1;

  while (checker.length != 0) {
    checker.sort(function (a, b) {
      if (parseInt(a.getAttribute('cost')) < parseInt(b.getAttribute('cost'))) {
        return 1;
      }

      if (parseInt(a.getAttribute('cost')) > parseInt(b.getAttribute('cost'))) {
        return -1;
      }

      return 0;
    });

    let curr = checker.pop();

    let row = parseInt(curr.getAttribute('row'));
    let col = parseInt(curr.getAttribute('col'));

    let down = row + 1;
    let up = row - 1;
    let left = col - 1;
    let right = col + 1;

    checkNode(down, col, curr, checker, seen, counter);
    checkNode(up, col, curr, checker, seen, counter);
    checkNode(row, left, curr, checker, seen, counter);
    checkNode(row, right, curr, checker, seen, counter);

    counter++;
  }

  // Draws out the shortest path
  setTimeout(() => {
    startNode.style.backgroundColor = '#2c3531';

    while (endNode.getAttribute('parent') != 'null') {
      endNode.style.backgroundColor = '#2c3531';
      let coor = endNode.getAttribute('parent').split('|');
      let prow = parseInt(coor[0]);
      let pcol = parseInt(coor[1]);
      endNode = document.querySelector(`div[row="${prow}"][col="${pcol}"]`);
    }
  }, counter * 100 + 100);

  // Enable refresh button only, after the visualizing process ends
  setTimeout(() => {
    let button = document.querySelector('.refresh');
    button.disabled = false;
    button.style.opacity = 1;
  }, counter * 100 + 100);
}
