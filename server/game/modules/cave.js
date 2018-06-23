module.exports = {
    state: {
        isCollapsing: false,
        omens: [],
        crystalsCollapsed: 0
    },
    mutations: {
        setCaveAttribute(action, state){
            state[action.type] = action.quantity
        }
    },
    getters: {
    },
    actions: {
        startCaveTurn(){

        }
    }
}
