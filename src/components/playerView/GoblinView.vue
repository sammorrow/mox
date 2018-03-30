<template>
<div class="player-view">
  <img :src="imageScry('00')" />
  <div class="stats-sheet">
    <h2> Stats </h2>
    <div class="attributes">
      <span> Rage: {{ state.rage }} </span>
    </div>
  </div>
  <div class="tribe-list">
    <tribe-card :name="`fangs`":tribe="state.tribes.fangs" />
    <tribe-card :name="`bones`" :tribe="state.tribes.bones" />
    <tribe-card :name="`eye`" :tribe="state.tribes.eye" />
  </div>
  <button @click="hideTribe"> hide selected tribe </button>
  <div class="loot">
    <h2> Secrets </h2>
    <span :key="'c-' + index" @click="toggleSelected(card, index)" v-for="(card, index) in state.secrets" class="card" :class="parseCardType(card, index)"/>
  </div>
  <div v-if="hand && hand.length">
    <span :key="'wc-' + idx" v-for="(card, idx) in hand" @click="chooseCard(card)"> name: {{  card.name }} </span>
  </div>
  <config></config>
</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import config from '../modular/ArbitrationInterface'
import GoblinTribe from '../modular/GoblinTribe'

const imageSet = require.context('../../assets/goblin-view', false, /\.png$/)

export default {
    name: 'GoblinView',
    components: {
      config,
      'tribe-card': GoblinTribe
    },
    data () {
      return { selectedCards: []}
    },
    computed: {
      state () {
        return this.$store.state.goblin
      },
      hand () {
        return this.$store.state.deck.goblinHand
      }
    },
    methods: {
        ...mapActions([
          'selectTribe',
          'chooseCard',
          'hideTribe'
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

</style>