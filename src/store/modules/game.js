export default {
    state: {
      gamesList: []
    },
    mutations: {
      setGameAttribute (state, action) {
        const { id, type, quantity } = action
        if (!state[id]){
          state[id] = {
            players: [],
            round: 0
          }
          state.gamesList = state.gamesList.concat([id])
        } 
        state[id][type] = quantity
        state.gamesList = state.gamesList.concat([])

      }
    },
    actions: {
      setGameAttributes ({commit}, action){
        for (let transaction in action){
          commit('setGameAttribute', {type: transaction, quantity: action[transaction], id: action.id})
        }
      }
    },
    getters: {
  }
} 
