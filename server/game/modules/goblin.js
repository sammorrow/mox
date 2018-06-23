const abilities = require('./goblin-abilities')
const { findPath } = require('../utils')
module.exports = {
  state: {
    state: 'free',
    activeTribe: null,
    selectedTribe: null,
    exhaustedTribes: [],
    rage: 1,
    hand: {},
    tribes: {
      fangs: {
        pop: 0,
        activated: false,
        monsters: [],
        currentPos: {x: null}
      },
      bones: {
        pop: 0,
        activated: false,
        monsters: [],
        currentPos: {x: null}
      },
      eye: {
        pop: 0,
        activated: false,
        monsters: [],
        currentPos: {x: null}
      }
    }
  },
  getters: {
    perception (state) {
      return tribe => state.tribes[tribe].pop + 1
    },
    tribeStr (state) {
      return tribe => {
        const selectedTribe = state.tribes[tribe]
        // if various secret shit, other calculations
        let str = tribe === 'fangs' ? 1 : 0
        str += selectedTribe.pop + selectedTribe.monsters.reduce((acc, val) => acc + val.str, 0) + (-1 + Math.min(state.rage, 1))
        return str
      }
    }
  },
  mutations: {
    setGoblinAttribute (state, action){
      const { type, quantity } = action

      state[type] = quantity
    },
    setTribeAttribute (state, action){
      const { tribe, type, quantity } = action

      state.tribes[tribe][type] = quantity
    },
    goblinEnrage (state){
      if (state.rage < 3) state.rage++
    },
    goblinPlacate (state){
      if (state.rage) state.rage--
    }
  },
  actions: {
    ...abilities,
    chooseCard ({state, commit, dispatch}, action){
      dispatch(`resolve${state.state}`, action)
      commit('setGoblinAttribute', {type: 'state', quantity: 'free'})
    },
    resolveWarCard ({state, commit}, action){
      commit('setTribeAttribute', {tribe: 'bones', type: 'pop', quantity: state.tribes.bones.pop + action.bones})
      commit('setTribeAttribute', {tribe: 'fangs', type: 'pop', quantity: state.tribes.fangs.pop + action.fangs})
      commit('setTribeAttribute', {tribe: 'eye', type: 'pop', quantity: state.tribes.eye.pop + action.eye})
      commit('replaceCards', {piece: 'goblin', type: 'goblinWar'})
    },
    drawWarCards ({state, commit}){
      commit('setGoblinAttribute', {type: 'state', quantity: 'WarCard'})
      commit('drawDeck', {piece: 'goblin', type: 'goblinWar', quantity: state.rage})
    },
    startGoblinTurn ({state, dispatch}) {
      const actionQueue = [
        {type: 'hand', quantity: {}},
        {type: 'rage', quantity: Math.max(1, state.rage)},
        {type: 'exhaustedTribes', quantity: []}
      ]
      dispatch('setAttributes', {type: 'Goblin', actionQueue})
      dispatch('drawWarCards')
    },
    scatterTribe({state, commit, dispatch}, {tribe}){
      commit('setTribeAttribute', {tribe, type: 'pop', quantity: Math.max(0, state.tribes[tribe].pop - 2)})
      dispatch('removePiece', {piece: tribe, startPos: state.tribes[tribe].currentPos})
      commit('setTribeAttribute', {type: 'currentPos', tribe, quantity: {x: null}})
    },
    hideTribe({state, dispatch}){
      const { selectedTribe } = state
      if (selectedTribe) dispatch('removePiece', {piece: selectedTribe, startPos: state.tribes[selectedTribe].currentPos})
    },
    evaluateGoblinMove ({state, commit, dispatch}, {cell}){
      const { activeTribe, selectedTribe, exhaustedTribes } = state
      if (!activeTribe && selectedTribe){
        if (exhaustedTribes.includes(selectedTribe)){
          console.log('you\'ve already activated this tribe.')
          return
        }
        if (state.tribes[selectedTribe].currentPos.x === null) dispatch('revealTribe', {selectedTribe, cell})
        else {
          dispatch('activateTribe', {tribe: selectedTribe})
          dispatch('moveTribe', {selectedTribe, cell})
        }
        dispatch('deactivateTribe')
      }
    },
    moveTribe({commit, state, dispatch, rootState}, {selectedTribe, cell}){
      const origin = state.tribes[selectedTribe].currentPos, destination = cell,
        pathWay = findPath(origin.x, origin.y, destination.x, destination.y, rootState.board, undefined, 'goblin')
      let startPos, endPos, moveOrder, litCells = 0
      console.log(pathWay, "gobbo path")
      pathWay.forEach((cell, idx, array) => {
        setTimeout(() => {
        if (idx === 0) return;
          startPos = array[idx - 1],
          endPos = cell,
          moveOrder = { piece: selectedTribe, startPos, endPos }
        dispatch('movePiece', moveOrder)
        if (rootState.board[endPos.y][endPos.x].type === 3) litCells++
        if (litCells === 2) {
          commit('setTribeAttribute', {tribe: selectedTribe, type: 'pop', quantity: Math.max(0, state.tribes[selectedTribe].pop - 1)})
          litCells = 0
        }
        commit('setTribeAttribute', {type: 'currentPos', tribe: selectedTribe, quantity: cell})
        //if (rootState.board[cell.y][cell.x].tokens.knight) dispatch('attackKnight')
        }, 250 * idx)
      })
    },
    revealTribe ({state, commit, dispatch, rootState}, {cell, selectedTribe, opt}) {
      const selectedTile = rootState.board[cell.y][cell.x]
      if (!opt && selectedTile.type !== 2) return console.log('invalid tile! can only reveal on dark tiles unless special circumstance that is not coded yet')  
      if (
        !opt &&
        selectedTribe === 'fangs' && selectedTile.back !== "00" || 
        selectedTribe === 'bones' && selectedTile.back !== "01" || 
        selectedTribe === 'eye' && selectedTile.back !== "02"
      ){
        return console.log('this tribe cannot settle on those tiles')  
      }
      dispatch('activateTribe', {tribe: selectedTribe})
      dispatch('movePiece', {piece: selectedTribe, startPos: cell, endPos: cell})
      commit('setTribeAttribute', {type: 'currentPos', tribe: selectedTribe, quantity: cell})
    },
    deactivateTribe({state, commit}) {
      commit('setGoblinAttribute', {type: 'exhaustedTribes', quantity: state.exhaustedTribes.concat([state.activeTribe])})
      commit('setGoblinAttribute', {type: 'activeTribe', quantity: null})
    },
    activateTribe({commit}, {tribe}) {
      commit('setGoblinAttribute', {type: 'activeTribe', quantity: tribe})
    },
    selectTribe({commit}, action){
      commit('setGoblinAttribute', {type: 'selectedTribe', quantity: action.tribe})
    },
    attackKnight({state, getters, commit, dispatch, rootState}) {
      if (getters.tribeStr(state.activeTribe) < rootState.knight.strength) console.log('** invalid attack **')
      dispatch('damageKnight')
      commit('goblinPlacate')
      dispatch('scatterTribe', {tribe: state.activeTribe})
    },
    ambushGoblin({commit, dispatch, rootState}, {tribe}){
      dispatch('activateTribe', {tribe})
      const actionArray = [
        () => dispatch('revealTribe', {cell: rootState.knight.currentPos, selectedTribe: tribe, opt: 'ambush'}),
        () => dispatch('attackKnight'),
        () => commit('setArbitratorAttribute', {type: 'activePlayerID', quantity: 0}),
        () => commit('setKnightAttribute', {type: 'state', quantity: 'free'})
      ]
      actionArray.forEach((action, idx) => setTimeout(() => {
        action()
      }, 200 * idx))
    }
  }
}
