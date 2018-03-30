import { questCards, warCards, monsterCards, secretCards } from '../decks';

export default {
  state: {
    knightQuest: questCards,
    knightTreasure: [],
    goblinHand: [],
    goblinWar: warCards,
    goblinSecret: secretCards,
    goblinMonster: monsterCards,
    caveTile: [],
    caveOmen: [],
    caveEvent: []
  },
  mutations: {
    drawDeck(state, {type, quantity, piece}){
      const drawnCards = state[type].splice(0, quantity)
      state[`${piece}Hand`] = drawnCards
    },
    replaceCards(state, {type, piece}){
      state[type] = state[type].concat(state[`${piece}Hand`])
      state[`${piece}Hand`] = []
    },
    discardCard(){
      state[`${piece}Hand`] = state[`${piece}Hand`].filter(card => card.name !== discardedCard)
    }
  },
  getters: {
  }
}