module.exports = {
  state: {
    selectedTile: null
  },
  mutations: {
    setSelectedTile (state, action){
      let tile = {...action}
      state.selectedTile = action
    }
  }
}