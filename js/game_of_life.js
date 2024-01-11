let cells;
let cols, rows;
let isRunning = false;
let interval;
let simulationInterval;
let generation = 0;
const cellSize = 10;
const maxAge = 5;

const startStopButton = document.getElementById('startStop');
const clearButton = document.getElementById('clear');
const speedInput = document.getElementById('speed');
const generationCount = document.getElementById('generationCount');
const generationCountButton = document.getElementById('generationCountButton');
const increaseSpeedButton = document.getElementById('increaseSpeed');
const decreaseSpeedButton = document.getElementById('decreaseSpeed');

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('gameCanvas');
  cols = width / cellSize;
  rows = height / cellSize;
  cells = create2DArray(cols, rows);
  initCells();
  frameRate(10);
  setInterval(draw, 100);
  setSimulationInterval();
}

// function draw() {
//     background(255);
//     if (isRunning) {

//       frameRate(speedInput.value);
//       updateCells();
//       generation++;
//       generationCount.textContent = `Generation: ${generation}`;
//     }
//     for (let i = 0; i < cols; i++) {
//         for (let j = 0; j < rows; j++) {
//             let x = i * cellSize;
//             let y = j * cellSize;
//             let cell = cells[i][j];
//             if (cell.alive) {
//                 let colorValue = map(cell.age, 0, maxAge, 255, 0);
//                 fill(colorValue);
//                 stroke(200);
//                 rect(x, y, cellSize, cellSize);
//             }
//         }
//     }

//     if (isRunning) {
//       updateCells();
//       generation++;
//       generationCount.textContent = `Generation: ${generation}`;
//     }
// }
function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('gameCanvas');
  cols = width / cellSize;
  rows = height / cellSize;
  cells = create2DArray(cols, rows);
  initCells();
  frameRate(10);
  setInterval(draw, 100);
  setSimulationInterval();
}

function draw() {
  background(255);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * cellSize;
      let y = j * cellSize;
      let cell = cells[i][j];
      if (cell.alive) {
        let colorValue = map(cell.age, 0, maxAge, 255, 0);
        fill(colorValue);
        stroke(200);
        rect(x, y, cellSize, cellSize);
      }
    }
  }

  if (isRunning) {
    updateSimulation();
  }
}

function updateSimulation() {
  let next = create2DArray(cols, rows);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let cell = cells[i][j];
      let neighbors = countNeighbors(i, j);
      next[i][j] = {...cell};

      if (cell.alive && (neighbors < 2 || neighbors > 3)) {
        next[i][j].alive = false;
      } else if (!cell.alive && neighbors === 3) {
        next[i][j].alive = true;
        next[i][j].age = 1;
      } else if (cell.alive) {
        next[i][j].age = cell.age + 1;
      }
    }
  }

  cells = next;
  generation++;
  generationCount.textContent = `Generation: ${generation}`;
}

function countNeighbors(x, y) {
  let sum = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      if (col >= 0 && col < cols && row >= 0 && row < rows) {
        sum += cells[col][row].alive ? 1 : 0;
      }
    }
  }
  sum -= cells[x][y].alive ? 1 : 0;
  return sum;
}

function mousePressed() {
    let i = floor(mouseX / cellSize);
    let j = floor(mouseY / cellSize);
    if (i >= 0 && i < cols && j >= 0 && j < rows) {
      cells[i][j].alive = !cells[i][j].alive;
      cells[i][j].age = cells[i][j].alive ? 1 : 0;
    }
}

function create2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            arr[i][j] = { alive: false, age: 0 };
        }
    }
    return arr;
}

function initCells() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            cells[i][j].alive = random(1) < 0.5;
            cells[i][j].age = cells[i][j].alive ? 1 : 0;
        }
    }
}

function updateCells() {
  let next = create2DArray(cols, rows);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let state = cells[i][j].alive;
      let neighbors = countNeighbors(cells, i, j);

      if (state && (neighbors < 2 || neighbors > 3)) {
        next[i][j].alive = false;
      } else if (!state && neighbors === 3) {
        next[i][j].alive = true;
        next[i][j].age = 1;
      } else {
        next[i][j].alive = state;
        next[i][j].age = state ? cells[i][j].age + 1 : 0;
      }
    }
  }

  cells = next;
}



function setSimulationInterval() {
  const speed = parseInt(speedInput.value, 10);
  clearInterval(simulationInterval);
  simulationInterval = setInterval(draw, 1000 / speed);
}

function loadPreset(preset) {
  clearGrid();
  if (preset === 'glider') {
    // Place a glider
    cells[1][0].alive = true;
    cells[2][1].alive = true;
    cells[0][2].alive = true;
    cells[1][2].alive = true;
    cells[2][2].alive = true;
  } else if (preset === 'pulsar') {
    // Add Pulsar pattern setup code here
  }
  // Additional patterns can be added here
}

speedInput.addEventListener('input', setSimulationInterval);
startStopButton.addEventListener('click', () => {
  if (isRunning) {
      stop();
  } else {
      start();
  }
});

clearButton.addEventListener('click', () => {
  clearGrid();
  draw(); // Redraw the empty grid
});

speedInput.addEventListener('input', () => {
  if (isRunning) {
      stop();
      start();
  }
});

generationCountButton.addEventListener('click', () => {
  initCells(); // Generate a new random state
  generation = 0; // Reset the generation count
  generationCount.textContent = `Generation: ${generation}`;
  draw(); // Redraw the grid with the new state
});

increaseSpeedButton.addEventListener('click', () => {
  if (speedInput.value < 100) {
      speedInput.value++;
      setSimulationInterval();
  }
});

decreaseSpeedButton.addEventListener('click', () => {
  if (speedInput.value > 1) {
      speedInput.value--;
      setSimulationInterval();
  }
});

function start() {
  if (!isRunning) {
    isRunning = true;
    startStopButton.textContent = 'Stop';
    interval = setInterval(draw, 1000 / speedInput.value);
  }
}

function stop() {
  if (isRunning) {
    isRunning = false;
    startStopButton.textContent = 'Start';
    clearInterval(interval);
  }
}

function toggleSimulation() {
  isRunning = !isRunning;
  startStopButton.textContent = isRunning ? 'Stop' : 'Start';
  if (isRunning) {
    interval = setInterval(draw, 1000 / speedInput.value);
  } else {
    clearInterval(interval);
  }
}

function clearGrid() {
  // Clear the grid by resetting all cells to 0
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      cells[i][j].alive = false;
      cells[i][j].age = 0;
    }
  }
  generation = 0; // Reset the generation count
  generationCount.textContent = `Generation: ${generation}`;
  stop();
  initCells(); // Repopulate the grid with random states
}
