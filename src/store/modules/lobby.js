export default {
    state: {
        numUsers: 0,
        numActiveGames: 0,
        roomInfo: [],
        id: null
    },
    mutations: {
      setLobbyAttribute (state, action) {
        const { type, quantity } = action
        state[type] = quantity
      },
    },
    actions: {
      setLobbyAttributes ({commit}, action){
        for (let transaction in action){
          commit('setLobbyAttribute', {type: transaction, quantity: action[transaction]})
        }
      }
    }
}
