module.exports = {
  burn ({dispatch, rootState}) {
    const allDarks = []
    rootState.board.forEach(row => {
      row.forEach(cell => {
        if (cell.type === 2) allDarks.push(`${cell.y}-${cell.x}`)
      })
    })
     const actionQueue = [
        {type: 'state', quantity: 'usingItem'},
        {type: 'pathMap', quantity: allDarks},
        {type: 'activeItem', quantity: 'burn'}
      ]
      dispatch('setAttributes', {actionQueue, type: 'Dragon'})   
  },
  burnUse ({commit, dispatch, rootState}, action) {
    const source = {...action}
    dispatch('lightCell', source)
    dispatch('addTileDispute', {tiles: [`${source.y}-${source.x}`], offenderPos: {y: 15, x: 15}})
    const updatedCell = rootState.board[source.y][source.x]
    if (updatedCell.tile === "00") dispatch('resolveTileIssue', {opt: 'auto'})
    else commit('setDragonAttribute', {type: 'state', quantity: 'reorienting'})
  },
  flame ({state, dispatch, rootState}, action){
    const { currentPos } = state, darkTiles = [], roll = action.die ? action.die : Math.floor(Math.random() * 6 + 1)  ,
      cb = coord => {if (rootState.board[coord.y][coord.x].type === 2) darkTiles.push(`${coord.y}-${coord.x}`)}
    dragonDie(cb, currentPos, roll);
    if (!darkTiles.length) return
    const actionQueue = [ 
        {type: 'state', quantity: 'usingItem'},
        {type: 'pathMap', quantity: darkTiles},
        {type: 'activeItem', quantity: 'scorch'}
      ]
    dispatch('setAttributes', {actionQueue, type: 'Dragon'}) 
    dispatch('addTileDispute', {tiles: darkTiles, offenderPos: {y: 15, x: 15}})
  },
  scratch ({state, dispatch, rootState}){
    const { currentPos } = state
    if (rootState.board[currentPos.y][currentPos.x].tokens.knight) dispatch('determineGrit', {quantity: -5})
  },
  scorch ({dispatch}){
    dispatch('flame', {die: 1})
  },
  scorchUse ({state, commit, dispatch, rootState}, action) {
      const source = {...action}
      commit('setSelectedTile', source)
      dispatch('lightCell', source)
      const updatedCell = rootState.board[source.y][source.x]
      if (updatedCell.tile === "00") dispatch('resolveTileIssue', {opt: 'auto'})
      else commit('setDragonAttribute', {type: 'state', quantity: 'reorienting'})
  },
  slither ({commit}, action){
    const { sourceTrack, destinationTrack } = action
    
    commit('setSlothTrack', {type: sourceTrack, form: 'decrement'})
    commit('setSlothTrack', {type: destinationTrack, form: 'increment'})
  },
  shriek ({state, commit}){
    if (state.shriekToken) console.log('you already have a shriek token')
    else commit('setDragonAttribute', {type: 'shriekToken', quantity: true})
  },
  wing ({commit}){
    commit('setDragonAttribute', {type: 'canMove', quantity: true})
  }
}

function dragonDie(callback, currentPos, dieRoll){
  const { y, x } = currentPos
  for (let i = y - 1; i < y + 2; i++){
    for (let j = x - 1; j < x + 2; j++){
      let coord = {y: i, x: j}
      if (dieRoll === 1) {
        if (!(i === y && j === x)) callback(coord)
      } else if (dieRoll === 4 || dieRoll === 5) {
          if (i !== y && j !== x) callback(coord)
      } else if (dieRoll === 2 || dieRoll === 3) {
        if ((i === y && j !== x) || (i !== y && j === x)) callback(coord)
      }
      if ((dieRoll === 3 || dieRoll === 5 || dieRoll === 6) && i === y && j === x) callback(coord)
    }
  }
}