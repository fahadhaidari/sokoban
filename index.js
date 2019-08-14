window.onload = function() {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  const CELL_SIZE = 25;
  const GRID_WIDTH = 15;
  const GRID_HEIGHT = 15;
  const FONT_FAMILY = "Courier";
  const STROKE_COLOR = "#111111";
  const STROKE_WIDTH = 5;
  const SCENE_COLOR = "#FFFFFF";
  const TILE_VAL = 1;
  const GOAL_VAL = 2;
  const canvasStyles = {
    color: "#111111",
    border: { width: 0, color: "#222222", radius: 1 }
  };
  const player = { x: 5, y: 7, dir: {x: 0, y: 0 }, color: "orange" };
  const KEY_MAP = { 37: "left", 39: "right", 38: "up", 40: "down" };
  const colorMap = {
    0: "#EEEEEE",
    1: "#4488FF",
    2: "#CCCCCC",
    3: "teal",
    4: "#FF4488",
    5: "#4FCC28"
  };
  const moveRoutine = {
    left:  function() { moveCol(-1); },
    right: function() { moveCol(1);  },
    up:    function() { moveRow(-1); },
    down:  function() { moveRow(1);  }
  };
  const goalLocations = [];
  let grid = [];
  let numGoals = 0;
  let countToGoal = 0;
  let isGameWin = false;
  let puzzleIndex = 0;

  const countGoals = function() {
    numGoals = 0;
    goalLocations.length = 0;
    for (let i = 0; i < grid.length; i ++) {
      for (let j = 0; j < grid[i].length; j ++)
        if (grid[i][j] === GOAL_VAL) {
          numGoals ++;
          goalLocations.push({row: i, col: j});
        }
    }
  };

  const loadPuzzle = function(index) {
    reset();
      grid = buildGrid(GRID_HEIGHT, GRID_WIDTH);
      addMatrixToGrid(puzzles[index], 2, 3);
      countGoals();
  };

  const reset = function() {
    countToGoal = 0;
    isGameWin = false;
    clearGrid();
  };

  const checkIfCellIsMovable = function(row, col) {
    return grid[row][col] === 0 || grid[row][col] === GOAL_VAL;
  };

  const checkIfCellWasGoal = function(row, col) {
    for (let i = 0; i < goalLocations.length; i ++) {
      const loc = goalLocations[i];
      if (row === loc.row && col === loc.col) {
        return true;
      }
    }
    return false;
  };

  const moveRow = function(row) {
    const cellVal = grid[player.y + row][player.x];

    if (cellVal === TILE_VAL) return;

    if (checkIfCellIsMovable(player.y + row, player.x)) {
      player.y += row;
    } else
    if (grid[player.y + row * 2][player.x] === GOAL_VAL) {
      grid[player.y + row][player.x] = 0;
      grid[player.y + row * 2][player.x] = cellVal;
      player.y += row;
      countToGoal ++;
      if (countToGoal === numGoals) isGameWin = true;
    } else
    if (checkIfCellIsMovable(player.y + row * 2, player.x)) {
      grid[player.y + row][player.x] = 0;
      grid[player.y + row * 2][player.x] = cellVal;

      if (checkIfCellWasGoal(player.y + row, player.x)) {
        grid[player.y + row][player.x] = GOAL_VAL;
          countToGoal --;
          isGameWin = false;
      }
      player.y += row;
    }
  };

  const moveCol = function(col) {
    const cellVal = grid[player.y][player.x + col];

    if (cellVal === TILE_VAL) return;

    if (checkIfCellIsMovable(player.y, player.x + col)) {
      player.x += col;
    } else
    if (grid[player.y][player.x + col * 2] === GOAL_VAL) {
      grid[player.y][player.x + col] = 0;
      grid[player.y][player.x + col * 2] = cellVal;
      player.x += col;
      countToGoal ++;
      if (countToGoal === numGoals) isGameWin = true;
    } else
      if (checkIfCellIsMovable(player.y, player.x + col * 2)) {
      grid[player.y][player.x + col] = 0;
      grid[player.y][player.x + col * 2] = cellVal;

      if (checkIfCellWasGoal(player.y, player.x + col)) {
        grid[player.y][player.x + col] = GOAL_VAL;
          countToGoal --;
          isGameWin = false;
      }

      player.x += col;
    }
  };

  const setupScene = function() {
    document.body.style.background = SCENE_COLOR;
    canvas.style.background = canvasStyles.color;
    canvas.style.border = `solid ${canvasStyles.border.width}px
      ${canvasStyles.border.color}`;
    canvas.style.borderRadius = `${canvasStyles.border.radius}px`;
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    canvas.style.postion = "absolute";
    canvas.width = CELL_SIZE * grid[0].length;
    canvas.height = grid.length * CELL_SIZE;
    canvas.style.marginTop = `${((window.innerHeight / 2) - (canvas.height / 2))}px`;
    canvas.style.marginLeft = `${((window.innerWidth / 2) - (canvas.width / 2))}px`;
  };

  const buildGrid = function(rows, cols) {
    const matrix = [];

    for (let i = 0; i < rows; i ++) {
        matrix[i] = [];
        for (let j = 0; j < cols; j ++)
            matrix[i][j] = 0;
    }
    return matrix;
  };

  const clearGrid = function() {
    for (let i = 0; i < grid.length; i ++) {
        for (let j = 0; j < grid[i].length; j ++)
            grid[i][j] = 0;
    }
  };

  const addMatrixToGrid = function(matrix, row, col) {
    let y = 0;
    let x = 0;

    for (let i = row; i < row + matrix.length; i ++) {
      for (let j = col; j < col + matrix[y].length; j ++) {
        if (matrix[y][x] !== 0)
          grid[i][j] = matrix[y][x];
        x ++;
        if (x >= matrix[y].length) {
          if (y < matrix.length - 1) {
            x = 0;
            y ++;
          }
        }
      }
    }
  };

  const renderGrid = function(matrix) {
    for (let i = 0; i < matrix.length; i ++) {
      for (let j = 0; j < matrix[i].length; j ++) {
        if (matrix[i][j] > 0) {
          context.lineWidth = STROKE_WIDTH;
          context.strokeStyle = STROKE_COLOR;
          context.strokeRect(j * (CELL_SIZE + STROKE_WIDTH), i * (CELL_SIZE + STROKE_WIDTH), CELL_SIZE, CELL_SIZE);
        }
        context.fillStyle = colorMap[matrix[i][j]];
        context.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  };

  const renderCaption = function(txt) {
    context.fillStyle = '#333333'; context.fillText(txt, 5, CELL_SIZE);
  };

  const renderPlayer = function() {
    context.lineWidth = STROKE_WIDTH;
    context.strokeStyle = STROKE_COLOR;
    context.fillStyle = player.color;
    context.fillRect(player.x * CELL_SIZE, player.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    context.strokeRect(player.x * CELL_SIZE, player.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  };

  const update = function() {};

  const draw = function() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    renderGrid(grid);
    renderPlayer();
    const caption = isGameWin ? "PUZZLE SOLVED!" : "GOALS LEFT: " + countToGoal + "/" + numGoals;
    renderCaption(caption);
  };

  const tick = function() {
    update(); draw(); requestAnimationFrame(tick);
  };

  document.onkeydown = function({ keyCode }) {
     if (moveRoutine[KEY_MAP[keyCode]]) moveRoutine[KEY_MAP[keyCode]]();
  };

  loadPuzzle(puzzleIndex);

  setupScene();

  context.font = `${CELL_SIZE * 0.8}px ${FONT_FAMILY}`;
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");

  nextBtn.onclick = function() {
    if (puzzleIndex < puzzles.length - 1) {
      puzzleIndex ++;
      loadPuzzle(puzzleIndex);
    }
  };

  prevBtn.onclick = function() {
    if (puzzleIndex > 0) {
      puzzleIndex --;
      loadPuzzle(puzzleIndex);
    }
  };

  tick();
}