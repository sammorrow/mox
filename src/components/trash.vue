
$(document).mousedown(function(e) {

    e.preventDefault();
    previousX = e.clientX;
    previousY = e.clientY;
    clicking = true;
});

$(document).mouseup(function() {
    clicking = false;
});

$(document).mousemove(function(e) {
    if (clicking) {
        e.preventDefault();
        var directionX = (previousX - e.clientX) > 0 ? 1 : -1;
        var directionY = (previousY - e.clientY) > 0 ? 1 : -1;
        $(document).scrollLeft($(document).scrollLeft() + 10 * directionX);
        $(document).scrollTop($(document).scrollTop() + 10 * directionY);
        previousX = e.clientX;
        previousY = e.clientY;
    }
});
    pathfindWalled(context, action) {
        const { distance, y, x } = action;
        if (!distance || !this.connection[direction + 2 % this.connections.length]) return null;
        if (dark || distance === 1 && this.connections[direction + 2 % this.connections.length]) return this;
        if (this.connections[direction + 2 % this.connections.length]) this.connectionsMap.forEach(connection => {
          connection ? pathfindWalled()
        })

        export function canIGetThere(startCoords, endCoords, direction, memo, state){
  if (startCoords.y === endCoords.y && startCoords.x === endCoords.y) return true


  const {x, y} = coords,
    newY = !(direction % 2) ? y + (-1 + direction) : y,
    newX = direction % 2 ? x + (2 - direction) : x,
    space = state[newY][newX]
  
  if(memo.includes(`${newY}-${newX}`)) return

  if (space.type === 2){
    memo.push(`${newY}-${newX}`)
    return;
  }

  const correctedConnections = reorient(space.connections, space.orientation)
  if (!correctedConnections[(direction + 2) % space.connections.length]) return;
  
  memo.push(`${newY}-${newX}`)
  return correctedConnections.some((connection, idx) => {
    if (connection) canIGetThere({y: newY, x: newX}, endCoords, idx, memo, state)
  })
  
  return false;
}

<style scoped>
.board {
  /* display: grid;
  max-height: 100vh;
  overflow: hidden;
  margin: 0;
  grid-template-columns: 1;
  grid-template-rows: repeat(32, 1fr);
  grid-gap: 0; */
  display: flex;
  flex-flow: row wrap;
  -moz-transition: all 0.3s;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  justify-content: center;
  align-items: center;
  /* -moz-transform: scale(1.75);
  -webkit-transform: scale(1.75);
  transform: scale(1.75); */
}

.row {
  display: flex;
  flex-flow: column wrap;
  margin: 0;
  padding: 0;
  /* display: grid;
  grid-gap: 0;
  grid-template-columns: repeat(32, 1fr);
  grid-template-rows: 1; */
}


</style>
