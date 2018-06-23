const Heap = require('heap')

function percolatePath(movement, coords, direction, memo, state){
  if (!movement) return;
  const {y, x} = coords,
    newY = !(direction % 2) ? y + (-1 + direction) : y,
    newX = direction % 2 ? x + (2 - direction) : x,
    space = state[newY][newX]
  if (!space.connections || memo.includes(`${newY}-${newX}`)) return;
  
  if (space.type === 2){
    memo.push(`${newY}-${newX}`)
    return;
  }

  const correctedConnections = reorient(space.connections, space.orientation)

  if (!correctedConnections[(direction + 2) % space.connections.length]) return
  memo.push(`${newY}-${newX}`)
  correctedConnections.forEach((connection, idx) => {
    if (connection) percolatePath(movement - 1, {y: newY, x: newX}, idx, memo, state)
  })
}

function detectAdjacentWalls(state, piece, cell){
  const { board } = state, pathMap = [], { y, x } = cell ? cell : state[piece].currentPos
  let newY, newX, adjacentTile
  reorient(board[y][x].connections, board[y][x].orientation).forEach((connection, direction) => {
    newY = !(direction % 2) ? y + (-1 + direction) : y,
    newX = direction % 2 ? x + (2 - direction) : x
    adjacentTile = board[newY][newX]
    if (!connection || (adjacentTile.type === 3 && !reorient(adjacentTile.connections, adjacentTile.orientation)[(direction + 2) % adjacentTile.connections.length])){
      pathMap.push(`${newY}-${newX}`)
    }
  })
  return pathMap
}

function getNeighbors(board, cell, orientation){
    const { y, x } = cell,
    pathMap = [],
    cellOrientation = orientation !== undefined ? orientation : board[y][x].orientation
    let newY, newX, adjacentTile
    reorient(board[y][x].connections, cellOrientation).forEach((connection, direction) => {
      newY = !(direction % 2) ? y + (-1 + direction) : y,
      newX = direction % 2 ? x + (2 - direction) : x
      adjacentTile = board[newY][newX]
      if (connection && (adjacentTile.type === 2 || (adjacentTile.type === 3 && reorient(adjacentTile.connections, adjacentTile.orientation)[(direction + 2) % adjacentTile.connections.length]))){
        pathMap.push(board[newY][newX])
      }
    })
  return pathMap
}

function findPath(startX, startY, endX, endY, board, orientation, race) {
  var grid = new Array(board.length).fill(0).map((el, idx) => board[idx].slice().map(cell => Object.assign({}, cell))),
  visited = []
  var openList = new Heap(function(nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        }),
        startNode = grid[startY][startX],
        endNode = grid[endY][endX],
        weight = 1,
        abs = Math.abs, SQRT2 = Math.SQRT2
      let node, neighbors, neighbor, i, l, x, y, ng;

    // set the `g` and `f` value of the start node to be 0
    startNode.g = 0;
    startNode.f = 0;

    // push the start node into the open list
    openList.push(startNode);
    startNode.opened = true;
    visited.push(`${startY}-${startX}`) 
    // while the open list is not empty
    while (!openList.empty()) {
        // pop the position of node which has the minimum `f` value.
        node = openList.pop();
        node.closed = true;

        // if reached the end position, construct the path and return it
        if (node.y === endNode.y && node.x === endNode.x) {
          return backtrace(endNode);
        }

        if (race === 'goblin' || node.type !== 2) neighbors = getNeighbors(grid, node, orientation);
        else neighbors = []

        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];
            x = neighbor.x;
            y = neighbor.y;

            // get the distance between current node and the neighbor
            // and calculate the next g score
            ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);

            // check if the neighbor has not been inspected yet, or
            // can be reached with smaller cost from the current node
            if (!visited.includes(`${y}-${x}`) || ng < neighbor.g) {
                neighbor.g = ng;
                neighbor.h = neighbor.h || weight * heuristic(abs(x - endX), abs(y - endY));
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = node;

                if (!visited.includes(`${y}-${x}`)) {
                    openList.push(neighbor);
                    visited.push(`${y}-${x}`);
                } else {
                    // the neighbor can be reached with smaller cost.
                    // Since its f value has been updated, we have to
                    // update its position in the open list
                    openList.updateItem(neighbor);
                }
            }
        } // end for each neighbor
    } // end while not open list empty

    // fail to find the path
    return [];
};

function heuristic(dx, dy) {
  var F = Math.SQRT2 - 1;
  return (dx < dy) ? F * dx + dy : F * dy + dx;
}

function backtrace(node) {
  var path = [{y: node.y, x: node.x}];
  while (node.parent) {
      node = node.parent;
      path.push({y: node.y, x: node.x});
  }
  return path.reverse();
}

function canShoot(shooter, target){
  const direction = shooter.x === target.x ? 'horizontal' : shooter.y === target.y ? 'vertical' : null
  if (!direction) return false

  const path = direction === 'horizontal' ? 'x' : 'y',
    axis = direction === 'horizontal' ? 'y' : 'x',
    top = Math.max(shooter[path], target[path]),
    bottom = Math.min(shooter[path], target[path])
  let lastCell = null
  for (let j = top; j >= bottom; j--){
    if (lastCell && lastCell.connections[0])// can shoot straight through])
    lastCell = board[axis === 'y' ? shoooter.y : j][axis === 'x' ? shooter.x : j]
  }
    // shoot up - down
  // build array
  // inspect for connection in pathway all the way through/

  return true  
}

function reorient(array, orientation){
  const offset = orientation / 90
  return array.map((el, idx, arr) => arr[(idx + 4 - offset) % 4])
}

// ['top', 'right', 'bottom', 'down']
// connections must work BOTH ways, e.g. enter a top grid but must check its bottom index. (i + 2) % 4

const connectionsMap = {
  "00": [1, 1, 1, 1],
  "01": [1, 1, 1, 0],
  "02": [1, 0, 1, 0],
  "03": [1, 0, 0, 1],
  "04": [1, 0, 0, 0]
}

function findAdjacentCells(destination, pathMap){
  const destinationStr = `${destination.y}-${destination.x}`
  return pathMap.filter(cellStr => cellStr.slice(3) === destinationStr.slice(3) || cellStr.slice(0, 2) === destinationStr.slice(0, 2))
}

function satisfyConnection(piece, origin, target, board){
  if (piece === 'Knight'){
    if (!detectAdjacentWalls({board}, null, origin).includes(`${target.y}-${target.x}`)) return true
  } else if (piece === 'Dragon'){
    console.log('and so', target, findPath(target.x, target.y, 15, 15, board).length)
    if (!canCellReachLadder(target, board)) return true
    else if (findPath(15, 15, target.x, target.y, board).length) return true
  }

  return false
}

function canCellReachLadder(cell, board){
  for (let i = 0; i < 360; i += 90){
    if (findPath(cell.x, cell.y, 15, 15, board, i).length) return true
  }
  return false
}

module.exports = {
  percolatePath,
  detectAdjacentWalls,
  findAdjacentCells,
  findPath,
  satisfyConnection,
  canCellReachLadder
}