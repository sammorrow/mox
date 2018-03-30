import { detectAdjacentWalls, canShoot } from '../../utils'

export default {
  useKnightPassive({state, commit, dispatch}, item){
    if (state.activeItems.includes(item)) return console.log(`you already used ${item} this turn`)
    commit('setKnightAttribute', {type: 'activeItems', quantity: state.activeItems.concat([item])})
    dispatch(`${item}`)
  },
  ancientMap ({dispatch, rootState}, action){
    const adjacentWalls = detectAdjacentWalls(rootState, 'knight')
    if (!adjacentWalls.length) {
      console.log('no adjacent walls!')
      return
    }
    const actionQueue = [
        {type: 'state', quantity: 'usingItem'},
        {type: 'pathMap', quantity: adjacentWalls},
        {type: 'activeItem', quantity: 'ancientMap'}
      ]
    dispatch('setAttributes', {actionQueue, type: 'Knight'})
  },
  ancientMapUse({dispatch}, action){
    dispatch('evaluateKnightMove', {cell: action})
  },
  bomb ({ state, commit, dispatch, rootState }){  
    const { currentPos } = state, { board }= rootState
    if (board[currentPos.y][currentPos.x].tokens.knight && board[currentPos.y][currentPos.x].tokens.dragon){
      commit('decrementKnightAttribute', {type: 'availableAP'})
      dispatch('attackDragon')
    }
  },
  bow () {
    // cycle through active tribes and check if any are in the line of fire
    //const targets = canShoot(currentPos)
    const actionQueue = [
        {type: 'state', quantity: 'usingItem'},
        //{type: 'pathMap', quantity: targets},
        {type: 'activeItem', quantity: 'bow'}
      ]
      dispatch('setAttributes', {actionQueue, type: 'Knight'})
  },
  bowUse (context, action) {
    //shoot the tribe in question
  },
  shield ({state, commit}, action){
    if (state.isShielded){
      console.log('you are already bracing')
      return 
    }
    commit('decrementKnightAttribute', {type: 'availableAP'})
    commit('setKnightAttribute', {type: 'isShielded', quantity: true})
  },
  javelin({commit}){
    // to-do eh
  },
  mightyAxe({state, commit}){
    commit('setKnightAttribute', {type: 'activeItems', quantity: state.activeItems.concat(['mightyAxe'])})
    commit('decrementKnightAttribute', {type: 'availableAP'}) 
    commit('incrementKnightAttribute', {type: 'temporaryStrength'})
  },
  enchantedBow(){
    // well crap
  },
  pixieLantern({commit}){
    commit('setKnightAttribute', {type: 'activeItems', quantity: state.activeItems.concat(['pixieLantern'])})
    commit('decrementKnightAttribute', {type: 'availableAP'}) 
    commit('incrementKnightAttribute', {type: 'movement'})
    commit('incrementKnightAttribute', {type: 'perception'})
  },
  heroicBoots({commit}){
    commit('setKnightAttribute', {type: 'activeItems', quantity: state.activeItems.concat(['heroicBoots'])})
    commit('decrementKnightAttribute', {type: 'availableAP'}) 
    commit('incrementKnightAttribute', {type: 'movement', quantity: 4})
  },
  elvishSword({commit}){
    commit('setKnightAttribute', {type: 'activeItems', quantity: state.activeItems.concat(['elvishBoots'])})
    commit('decrementKnightAttribute', {type: 'availableAP'}) 
    commit('incrementKnightAttribute', {type: 'temporaryStrength'})
    commit('incrementKnightAttribute', {type: 'perception'})
  },
  potionKit({state, commit}){
    commit('decrementKnightAttribute', {type: 'availableAP'}) 
    if (state.totalAP > 2) commit('decrementKnightAttribute', {type: 'totalAP'}) 
    commit('incrementKnightAttribute', {type: 'health', quantity: 2})
    commit('incrementKnightAttribute', {type: 'discardedAP'})
 // exile the card
  }
}