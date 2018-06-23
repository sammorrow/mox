const powers = require('./dragon-powers')

module.exports = {
  state: {
      state: 'free',
      currentPos: {},
      health: 5,
      canMove: true,
      goblinsInBelly: 0,
      isAwakened: false,
      slothTrack: {
        "greed": 2,
        "hunger": 2,
        "prideEvent": 4,
        "prideTwoGem": 1,
        "prideNoMove": 1
      },
      hand: [],
      gems: {
        "wing": { 
          status: 'inactive', // ['active', 'inactive', 'exhausted']
          position: null
        }, 
        "claw": {
          status: 'inactive',
          position: null
        },
        "flame": {
          status: 'inactive',
          position: null
        }
      },
      shriekToken: false,
      activeItem: null,
      pathMap: []
    },
  getters: {
    renderDragonTrack: state => type => {
      const inactiveCubes = state.slothTrack[type]
      if (type === 'prideTwoGem' || type === 'prideNoMove') return inactiveCubes ? [1] : [0]
      return new Array(inactiveCubes).fill(1).concat(new Array(4 - inactiveCubes).fill(0))
    },
    wakefulness: state => {
      return 14 - (Object.keys(state.slothTrack).reduce((acc, val) => acc + state.slothTrack[val], 0)) 
    },
    armor: (state, getters) => {
      return Math.floor(getters.wakefulness / 4) + 1
    },
    spirit: (state, getters) => {
      return Math.floor((getters.wakefulness + 2) / 4) + 3
    },
  },
  mutations: {
    setDragonAttribute (state, action) {
      const { type, quantity } = action
      state[type] = quantity
    },
    setSlothTrack (state, action) {
      const { type, form } = action
      form === 'decrement' ? state.slothTrack[type]-- : state.slothTrack[type]++
    }
  },
  actions: {
    ...powers,
    rouseDragon ({dispatch, rootState}){
      const startPos = rootState.knight.currentPos
      dispatch('movePiece', {piece: 'dragon', startPos, endPos: startPos})
      dispatch('refreshDragonHand')
      dispatch('refreshDragonPathmap')
    },
    startDragonTurn({dispatch}){
      const payload = [
        {type: 'canMove', quantity: true},
      ]
      dispatch('refreshDragonHand')
      dispatch('setAttributes', {type: 'Dragon', actionQueue: payload})
    },
    refreshDragonHand ({state, getters, commit}){
      const newDeck = dragonDeck.slice(), 
        newHand = new Array(getters.spirit).fill(0).map(el => {
          let randomPick = Math.floor(Math.random() * newDeck.length)
          return newDeck.splice(randomPick, 1)[0]
        })
      commit('setDragonAttribute', {type: 'hand', quantity: newHand})
    },
    evaluateDragonMove ({state, dispatch, commit}, action) {
      const { cell } = action, startPos = state.currentPos
      if (!state.canMove){
        console.log('you are out of moves')
        return;
      }
      if (!state.isAwakened){
        if (cell.type === 1) console.log('even dragons fear the dark')
        else if (state.pathMap.includes(`${cell.y}-${cell.x}`)) {
          dispatch('movePiece', {piece: 'dragon', startPos, endPos: cell})
          commit('setDragonAttribute', {type: 'canMove', quantity: false})
          dispatch('refreshDragonPathmap')
        }
        else console.log('invalid move')
      }
    },
    refreshDragonPathmap ({state, commit, rootState}){
      const { currentPos } = state, pathMap = []
      for(let i = currentPos.y - 2; i < currentPos.y + 3; i++){
        if (i !== currentPos.y && rootState.board[i][currentPos.x].type !== 1) pathMap.push(`${i}-${currentPos.x}`)
      }
      for(let i = currentPos.x - 2; i < currentPos.x + 3  ; i++){
        if (i !== currentPos.x && rootState.board[currentPos.y][i].type !== 1) pathMap.push(`${currentPos.y}-${i}`)
      }
      commit('setDragonAttribute', {type: 'pathMap', quantity: pathMap})
    },
    useDragonAbility ({state, dispatch}, action) {
      const { activeItem } = state
      dispatch(`${activeItem}Use`, action)
    },
    settleDragonAbility({state, dispatch}){
      const newState = state === 'reorienting' ? 'reorienting' : 'free'
      const actionQueue = [
        {type: 'state', quantity: newState},
        {type: 'activeItem', quantity: null}
      ]
      dispatch('setAttributes', {actionQueue, type: 'Dragon'})
      dispatch('refreshDragonPathmap')
    },
    dragonOrient ({commit, dispatch}, action) {
      const tile = { ...action }

      commit('setDragonAttribute', {type: 'state', quantity: 'reorienting'})
      dispatch('addTileDispute', {tiles: [`${tile.y}-${tile.x}`], offenderPos: Object.assign({}, {y: 15, x: 15})})
    },
    damageDragon({state, commit, dispatch}) {
      commit('setDragonAttribute', {type: 'health', quantity: state.health - 1})
      if (state.health < 1) dispatch('gameOver', {winner: 'knight'})
    }
  }
}

const dragonDeck = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2]
