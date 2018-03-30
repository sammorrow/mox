import { reorient, percolatePath, connectionsMap, findAdjacentCells, findPath } from '../../utils'
import abilities from './knight-abilities'

export default {
  state: {
    state: 'free', // ['free', 'reorientingTile', 'usingAbility']
    currentPos: {},
    health: 7,
    grit: 0,
    totalAP: 2,
    availableAP: 2,
    discardedAP: 0,
    movement: 2,
    perception: 1,
    encounters: 1,
    strength: 1,
    temporaryStrength: 0,
    crystalsSmashed: 0,
    activeItem: null,
    isShielded: false,
    loot: [],
    quests: [],
    pathMap: [],
    activeItems: [],
    movementPoints: 0,
    perceptionPoints: 0,
    strengthPoints: 0,
    ancientMapPoints: 0
  },
  getters: {
    getPoints: state => type => new Array(state[type]).fill(1).concat(new Array(3 - state[type]).fill(0)),
    totalStrength: state => state.strength + state.temporaryStrength
  },
  mutations: {
    setKnightAttribute(state, action){ // HP. AP, grit, movement, perception, strength 
      const { type, quantity } = action

      state[type] = quantity
    },
    incrementKnightAttribute(state, action){
      const { type } = action,
        quantity = action.quantity || 1

      state[type] += quantity
    },
    decrementKnightAttribute(state, action){
      const { type } = action,
        quantity = action.quantity || 1
      if (state[type]) state[type] -= quantity
    }
  },
  actions: {
    ...abilities,
    spendPoint ({commit, dispatch}, action) {
      if (action.type !== 'ancientMap') commit('incrementKnightAttribute', action)
      commit('incrementKnightAttribute', {type: `${action.type}Points`})
      commit('decrementKnightAttribute', {type: 'availableAP'})
      if (action.type === 'movement') {
        commit('incrementKnightAttribute', action)
        dispatch('refreshKnightPathmap')
      }
    },
    startKnightTurn ({dispatch, state}){
      const actionQueue = [
        {type: 'availableAP', quantity: state.totalAP},
        {type: 'strength', quantity: 1},
        {type: 'temporaryStrength', quantity: 0},
        {type: 'perception', quantity: 1},
        {type: 'encounters', quantity: 1},
        {type: 'movement', quantity: 1},
        {type: 'movementPoints', quantity: 0},
        {type: 'perceptionPoints', quantity: 0},
        {type: 'strengthPoints', quantity: 0},
        {type: 'ancientMapPoints', quantity: 0},
        {type: 'isShielded', quantity: false}
      ]
      dispatch('setAttributes', {actionQueue, type: 'Knight'})
      dispatch('refreshKnightPathmap')
    },
    endKnightTurn ({dispatch, state}){
      const actionQueue = [
        {type: 'temporaryStrength', quantity: 0}
      ]
      dispatch('setAttributes', {actionQueue, type: 'Knight'})
    },
    knightMove ({ dispatch, commit, state, rootState }, action) {
      const destination = {...action},
        origin = state.currentPos,
        pathWay = findPath(origin.x, origin.y, destination.x, destination.y, rootState.board)
      let startPos, endPos, moveOrder
      pathWay.forEach((cell, idx, array) => {
        setTimeout(() => {
        if (idx === 0) return;
          startPos = array[idx - 1],
          endPos = cell,
          moveOrder = { piece: 'knight', startPos, endPos }
        if (rootState.board[endPos.y][endPos.x].type === 2) dispatch('knightReveal', {startPos, endPos})
        dispatch('movePiece', moveOrder)
        commit('decrementKnightAttribute', {type: 'movement'})      
          dispatch('refreshKnightPathmap')
        }, 150 * idx)
      })
    },
    knightReveal ({state, dispatch, commit, rootState}, action){
      const { endPos, startPos } = action
      dispatch('lightCell', endPos)
      
      const direction = startPos.x === endPos.x ? startPos.y > endPos.y ? 0 : 2 : startPos.x < endPos.x ? 1 : 3 // up down right left 
      dispatch('autosetTile', {startPos, endPos, direction})

      const updatedEndPos = rootState.board[endPos.y][endPos.x]
      if (updatedEndPos.tile === "01" || updatedEndPos.tile === "03" ) dispatch('knightOrient', updatedEndPos)
      else dispatch('autofillTiles', updatedEndPos)
      dispatch('determineGrit', {quantity: 1})
    },
    knightOrient ({state, commit, dispatch}, action) {
      const tile = { ...action }

      commit('setKnightAttribute', {type: 'state', quantity: 'reorienting'})
      dispatch('addTileDispute', {tiles: [`${tile.y}-${tile.x}`], offenderPos: Object.assign({}, {y: state.currentPos.y}, {x: state.currentPos.x})})
      commit('setSelectedTile', tile)
    },
    refreshKnightPathmap ({state, commit, dispatch, rootState}){
      const { currentPos, movement } = state,
      { y, x } = currentPos, currentPosCell = rootState.board[y][x]
      let newPathMap = [`${y}-${x}`]

      reorient(currentPosCell.connections, currentPosCell.orientation).forEach((connection, idx) => {
        if (connection) percolatePath(movement, {y, x}, idx, newPathMap, rootState.board, 'human')
      })
      
      newPathMap = newPathMap.slice(1)
      console.log('completed', newPathMap)
      commit('refreshPathMap', {piece: 'knight', map: newPathMap})
    },
    evaluateKnightMove ({state, commit, dispatch, rootState}, action){
      const { cell } = action
      if (rootState.arbitrator.gameState !== 'free') console.log('unable to act')
      else if (cell.type < 2) console.log('invalid tile, knight!')
      else if (!state.pathMap.includes(`${cell.y}-${cell.x}`)) console.log('you overestimate your abilities!')
      else dispatch('knightMove', {...cell})  
    },
    useKnightAbility ({state, dispatch}, action) {
      const { activeItem } = state
      dispatch(`${activeItem}Use`, action)
      dispatch('spendPoint', {type: `${activeItem}`})
      const actionQueue = [
        {type: 'state', quantity: 'free'},
        {type: 'activeItem', quantity: null}
      ]
      dispatch('setAttributes', {actionQueue, type: 'Knight'})
      dispatch('refreshKnightPathmap')
    },
    determineAP ({state, commit, dispatch}, action) {
      const { newAP } = action, currentAP = state.totalAP, APDiff = state.totalAP - state.availableAP
      commit('setKnightAttribute', {type: 'totalAP', quantity: newAP})
      if (currentAP < newAP || state.availableAP > 0) commit('setKnightAttribute', {type: 'availableAP', quantity: newAP - APDiff})       
      else dispatch('endTurn')
    },
    determineGrit ({state, commit, dispatch}, action) {
      const gritDifference = state.isShielded ? Math.max(action.quantity, -1) : action.quantity,
        newGrit = state.grit + gritDifference
      let newAP = 2;
      
      gritArray.forEach((rung, idx) => {
        if (rung <= newGrit) newAP = idx + 2 
      })
      commit('setKnightAttribute', {type: 'grit', quantity: Math.max(newGrit, 0)})
      if (newAP !== state.totalAP) dispatch('determineAP', {newAP})
    },
    attackDragon ({state, getters, dispatch, rootState}) {
      if (state.strength < getters.armor) dispatch('damageDragon')
    },
    damageKnight({state, commit, dispatch}) {
      commit('setKnightAttribute', {type: 'health', quantity: state.health - 1})
      if (state.health < 1) dispatch('gameOver', {winner: 'knight'})
    }
  }
}

const gritArray = [0, 5, 11, 17, 26, 35]
const gritMap = {"00": 2, "05": 3, "11": 4, "18": 5, "26": 6, "35": 7}