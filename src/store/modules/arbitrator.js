import { satisfyConnection } from '../../utils'

export default {
  state: {
    gameState: 'free', // ['free', 'forcedMove'],
    turnOrder: ['Knight', 'Goblin', 'Dragon', 'Cave'],
    playerState: 'free', // ['free', 'orientation', 'forcedMove'],
    activePlayerID: 0,
    conflictQueue: [],
    offendingTiles: [],
    offenderPos: {}
  },
  mutations: {
    passTurn (state){
      state.activePlayerID = (state.activePlayerID + 1) % state.turnOrder.length
    },
    setPlayerState (state, action){
      state.playerState = action.state
    },
    setArbitratorAttribute (state, action) {
      const { type, quantity } = action
      state[type] = quantity
    }
  },
  getters: {
    activePlayer (state){
      return state.turnOrder[state.activePlayerID]
    }
  },
  actions: {
    endTurn ({commit, dispatch, getters}, action) {
      commit('passTurn')
      dispatch(`start${getters.activePlayer}Turn`)
    },
    setFree ({getters, dispatch}) {
      const actionQueue = [
        {type: 'state', quantity: 'free'},
        {type: 'pathMap', quantity: []},
        {type: 'activeItem', quantity: null}
      ]
      dispatch('setAttributes', {actionQueue, type: getters.activePlayer})
      if (getters.activePlayer === 'Knight') dispatch('knightEncounter')
      else dispatch('refreshPlayerPathmap')
    },
    resolveTileIssue ({state, getters, commit, dispatch, rootState}, action){
      if (!rootState.player.selectedTile) return
      let cell = {...rootState.player.selectedTile}
      if (!action.opt && !satisfyConnection(getters.activePlayer, Object.assign({}, state.offenderPos), cell, rootState.board)){
        console.log('invalid orientation')
        return
      }
      commit('setArbitratorAttribute', {type: 'offendingTiles', quantity: state.offendingTiles.filter(tile => tile !== `${cell.y}-${cell.x}`)})
      dispatch('autofillTiles', cell)
      commit('refreshPathMap', {piece: getters.activePlayer.toLowerCase(), map: state.offendingTiles.slice()})
      commit('setSelectedTile', null)
      
      if (!state.offendingTiles.length){
        commit('setArbitratorAttribute', {type: 'offenderPos', quantity: {}})
        dispatch('setFree')
      }
      else commit(`set${getters.activePlayer}Attribute`, {type: 'state', quantity: 'usingItem'})
    },
    evaluateMove ({dispatch, getters}, action){
      dispatch(`evaluate${getters.activePlayer}Move`, action)
    },
    refreshPlayerPathmap ({dispatch, getters}){
      dispatch(`refresh${getters.activePlayer}Pathmap`)
    },
    useAbility ({getters, commit, dispatch, rootState}, action){
      if (rootState.player.selectedTile) return
      commit('setSelectedTile', action)
      dispatch(`use${getters.activePlayer}Ability`, action)
    },
    addTileDispute ({commit}, action){
      commit('setArbitratorAttribute', {type: 'offendingTiles', quantity: action.tiles})
      commit('setArbitratorAttribute', {type: 'offenderPos', quantity: Object.assign({}, {y: action.offenderPos.y}, {x: action.offenderPos.x})})
    },
    resolveAmbush({commit}){
      commit('setArbitratorAttribute', {type: 'activePlayerID', quantity: 1})
      commit('setGoblinAttribute', {type: 'state', quantity: 'ambushing'})
    },
    gameOver ({commit}){
      commit('setArbitratorAttribute', {type: 'gameState', quantity: 'done'})
    }
  }
}

const continualAbilities = ['scorch']

/* GENERAL FLOW

  Tile reveal
    Lit tile is flipped, oriented
    New tiles are placed around it
    Actions are resolved

    When multiple tiles are revealed simultaneously, the cave / revealing player chooses which order to put them down in 


  TILE REORIENTATION

  Cave can reorient with ability
  Knight can reorient by 

  KNIGHT STATES
[ name      available actions
  'free' -- use actionable items, adjust points, score sidequests, take a movement (MUST HAVE 1+ ENCOUTER), smash a crystal (MUST HAVE 3+ STR),
  'orientation' -- reorient revealed tile to connect with map (if no cave, draw x tiles and place on x squares)
  'forcedMove' -- move to available, legal square
]

Encounters are spent instantly upon:
  Beginning the turn on an event
  Entering any point of the ACTION CHAIN
              1. Entering a dark tile
              2. Resolving combat on your tile (dragon, goblin, crystal)
              3. Resolving treasure (dragon gem, treasure token)
  Using the javelin


SPECIAL:
  SHIELD MUST BE ACTIVATED BEFORE DISPLACEMENT EFFECTS ARE ON THE STACK
  The Knight cannot be moved through walls, onto Dark tiles, or onto spaces with players. If she enters a space with an Event token, 
  she must stop. (On her next turn, she must resolve the Event token as an Encounter, and must do so before moving.)
*/