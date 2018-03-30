<template>
<div class="player-view">
  <config></config>
</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import config from '../modular/ArbitrationInterface'
const imageSet = require.context('../../assets/cave-view', false, /\.png$/)

export default {
    name: 'GoblinView',
    data () {
      return { selectedCards: []}
    },
    components: {
      config
    },
    computed: {
        state () {
          console.log(this.$store.state.goblin)
          return this.$store.state.goblin
        },
        ...mapGetters([
          'wakefulness'
        ]),
        renderDragonTrack(){
          return this.$store.getters.renderDragonTrack
        },
        manaPool(){
          const manaPool = {0: 0, 1: 0, 2: 0, 3: 0}
          this.selectedCards.forEach(el => {
            if (el !== undefined) {
              manaPool[el]++
              manaPool[3]++
            }
          })
          return manaPool
        }
    },
    methods: {
        ...mapActions([
          'wing',
          'scratch',
          'scorch',
          'slither'
        ]),
        imageScry: function (numStr) {
          return imageSet(`./${numStr}.png`)
        },
        parseClass: function (bool) {
          return bool ? "active" : "inactive"
        },
        parseCardType: function (num, id){
          let dynamicClass = ''
          if (this.selectedCards[id] !== undefined) dynamicClass += 'highlighted'
          if (num === 0) dynamicClass += ' claw-card' 
          else if (num === 1) dynamicClass += ' flame-card'
          else dynamicClass += '  wing-card'
          return dynamicClass
        },
        toggleSelected: function (type, id){
          const newState = this.selectedCards.slice();
          if (newState[id] !== undefined) newState[id] = undefined
          else newState[id] = type
          this.selectedCards = newState
          console.log(this.selectedCards)
        },
        isDisabled: function(manaCost){
          let boolean = false
          manaCost.forEach((symbol, index) => {
            if (symbol && (!this.manaPool[index] || this.manaPool[index] < symbol)) boolean = true
          })
          return boolean
        }
    }
}
</script>

<style scoped>

.highlighted {
  transform: scale(1.1);
  margin-bottom: 5px;
}

.card {
  display: inline-block;
  width: 50px;
  height: 50px;
  transition: 0.1s;
}

.claw-card {
  background-color: grey;
}

.flame-card {
  background-color: red;
}

.wing-card {
  background-color: burlywood
}

.attribute-icon {
  cursor: pointer;
}

.attribute-icon:hover{
  opacity: 0.9;
}

.attribute-cube {
  display: inline-block;
  height: 1.5rem;
  width: 1.5rem;
  background-color: #ffdf68;
  border: 1px solid black;
}

.active {
  background-color: #a00a15;
}

.inactive {
  background-color: white;
}

.player-view {
  display: flex;
  flex-flow: row wrap;
}

.tribe-list {
  display: flex;
  flex-flow: row wrap;
}

.stats-sheet {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
}

.pride-box {
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.pride-container{
  display: flex;
  flex-flow: row;
}
</style>