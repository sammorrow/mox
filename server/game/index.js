const Vuex = require('vuex')
const Vue = require('vue');
Vue.use(Vuex);

const { arbitrator, knight, dragon, goblin, cave, deck, player, lobby, game } = require('./modules')
const { reorient, connectionsMap } = require('./utils')

module.exports = () => new Vuex.Store({
  modules: {
    lobby,
    arbitrator,
    knight,
    dragon,
    goblin,
    cave,
    deck,
    game,
    player
  },
  state: {
    board: new Array(32).fill(0).map((el, colIdx) => new Array(32).fill(0).map((el, rowIdx) => ({x: rowIdx, y: colIdx, type: 1, tile: '01', back: '00', orientation: 0, tokens: {}})))
  },
  getters: {
    centerCell(state){
      if (state.board) return state.board[15][15]
    },
    activePlayerState(state, getters){
      return state[getters.activePlayer.toLowerCase()]
    }
  },
  mutations: {
    setCell (state, action) {
        const { y, x } = action,
          board = [ ...state.board ]
        board[y][x] = {...board[y][x], ...action}
        state.board = board
    },
    setCurrentPos (state, action) {
        const { piece, position } = action,
          newState = { ...state[piece] }
        newState.currentPos = position
        state[piece] = newState
    },
    refreshPathMap (state, action) {
      const { piece, map } = action
      
      state[piece].pathMap = map;
    }
  },
  actions: {
    _set({dispatch}, action){
      dispatch(`set${action.space}Attributes`, action)
    },
    startGame ({commit, dispatch}) {
      const startX = 15, startY = 15,
        startCell = { x: startX, y: startY, type: 3, tile: '00_l', back: '00', orientation: 0, tokens: { knight: true }, connections: connectionsMap['00']}
      commit('setCell', startCell)
      commit('setCurrentPos', { piece: 'knight', position: startCell })
      dispatch('autofillTiles', startCell)
      dispatch('refreshKnightPathmap')
    },
    lightCell ({state, commit}, action) {
        const { y, x } = action
        if (state.board[y][x].type === 2) commit('setCell', {x, y, type: 3})
    },
    reorientCell ({commit, dispatch}, action){
      commit('setCell', action)
      dispatch('refreshKnightPathmap')
    },
    setAttributes ({commit}, action){
      action.actionQueue.forEach(actionInst => {
        commit(`set${action.type}Attribute`, {type: actionInst.type, quantity: actionInst.quantity})
      })
    },
    movePiece ({state, commit}, action){
      const { piece, startPos, endPos } = action,
        startCell = state.board[startPos.y][startPos.x], endCell = state.board[endPos.y][endPos.x]
      commit('setCell', {y: startCell.y, x: startCell.x, tokens: Object.assign({}, startCell.tokens, {[piece]: false})})
      commit('setCell',  {y: endCell.y, x: endCell.x, tokens: Object.assign({}, endCell.tokens, {[piece]: true})})
      commit('setCurrentPos', {piece, position: {y: endCell.y, x: endCell.x}}) // to be refactored
    },
    removePiece ({state, commit}, action){
      const { piece, startPos } = action,
        startCell = state.board[startPos.y][startPos.x]
      commit('setCell', {y: startCell.y, x: startCell.x, tokens: Object.assign({}, startCell.tokens, {[piece]: false})})
    },
    autofillTiles ({state, commit, dispatch}, action) {
      const actionCopy = { ...action }, { y, x } = actionCopy,
        originCell = state.board[y][x], 
        rollTheDice = () => {
          let baseStr = `0${Math.floor(Math.random() * 5)}`
          if (Math.random() > 0.5) baseStr += "_a"
          return baseStr
        },
        goForBroke = () => `0${Math.floor(Math.random() * 3)}`

      reorient(originCell.connections, originCell.orientation).forEach((opening, idx) => {
        if (opening && (y > 0 && y < 31 && x > 0 && x < 31)){
          const tileID = rollTheDice(),
            newY = (idx % 2) ? y : y - 1 + idx, newX = (idx % 2) ? x + 2 - idx : x,
            payload = {y: newY, x: newX, type: 2, orientation: 0, tile: tileID, back: goForBroke(), tokens: {}, connections: connectionsMap[tileID.slice(0,2)]}
          
          if (state.board[newY][newX].type === 1)  commit('setCell', payload)
        }
      })
      dispatch('setFree')      
    },
    autosetTile ({dispatch, state}, action) {
      const { startPos, endPos, direction } = action,
        endCell = state.board[endPos.y][endPos.x]
      let orientation = 0, orientedArray = endCell.connections.slice()

      while (!orientedArray[(direction + 2) % orientedArray.length]){
        orientation = (orientation + 90) % 360
        orientedArray = reorient(endCell.connections.slice(), orientation)
      }
      dispatch('reorientCell', {y: endCell.y, x: endCell.x, orientation})
    }
  }
})