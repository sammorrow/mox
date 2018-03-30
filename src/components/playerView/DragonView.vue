<template>
<div class="player-view">
    <img :src="imageScry('00')" />
    <div class="stats-sheet">
        <h2> STATS </h2>
        <div class="attributes">
          <span> Wakefulness: {{ wakefulness }} </span>
          <div><span> Goblins in Belly: {{state.goblinsInBelly}} </span></div>
          <div>
            <img title="health" :src="imageScry('a-4')"/>
            <span> {{ state.health }} </span>
          </div>
          <div class="sloth-track">
            <h2> Sloth Tracker </h2>
            <div>
                <img class="attribute-icon" title="greed" :src="imageScry('a-1')"/>
                <span v-for="point in renderDragonTrack('greed')" class="attribute-cube" :class="parseClass(point)"/>
            </div>
            <div>
                <img  class="attribute-icon" title="hunger" :src="imageScry('a-2')"/>
                <span v-for="point in renderDragonTrack('hunger')" class="attribute-cube" :class="parseClass(point)"/>
            </div>
            <div class="pride-container">
                <img  class="attribute-icon" title="pride" :src="imageScry('a-3')"/>
                <div class="pride-box">
                  <div><span v-for="point in renderDragonTrack('prideEvent')" class="attribute-cube" :class="parseClass(point)"/></div>
                  <div><span v-for="point in renderDragonTrack('prideTwoGem')" class="attribute-cube" :class="parseClass(point)"/></div>
                  <div><span v-for="point in renderDragonTrack('prideNoMove')" class="attribute-cube" :class="parseClass(point)"/></div>
                </div>
            </div>
          </div>
        </div>
    </div>
     <div class="loot">
        <h2> HAND </h2>
        <span class="shriek-token" v-if="state.shriekToken" />
        <span :key="'c-' + index" @click="toggleSelected(card, index)" v-for="(card, index) in state.hand" class="card" :class="parseCardType(card, index)"/>
    </div>
    <div class="ability-list">
        <button :disabled="isDisabled([0,1,1])" class="dragon-ability" @click="burn" > Burn </button>
        <button :disabled="isDisabled([0,1,0])" class="dragon-ability" @click="flame" > Flame </button>
        <button :disabled="isDisabled([0,0,1])" class="dragon-ability" @click="wing"> Wing </button>
        <button :disabled="isDisabled([3,0,0])" class="dragon-ability" @click="scratch" > Scratch </button>
        <button :disabled="isDisabled([0,2,0])" class="dragon-ability" @click="scorch" > Scorch </button>
        <button :disabled="isDisabled([0,0,0,2])" class="dragon-ability" @click="shriek" > Shriek </button>
        <button :disabled="isDisabled([1,1,0])" class="dragon-ability" @click="slither({sourceTrack: 'greed', destinationTrack: 'hunger'})"> Slitherrr </button>
    </div>
    <config></config>
</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import config from '../modular/ArbitrationInterface'
const imageSet = require.context('../../assets/dragon-view', false, /\.png$/)

export default {
    name: 'DragonView',
    data () {
      return { selectedCards: []}
    },
    components: {
      config
    },
    computed: {
        state () {
          return this.$store.state.dragon
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
          'burn',
          'flame',
          'scratch',
          'scorch',
          'shriek',
          'slither',
          'wing'
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

.dragon-ability {
  display: inline-block;
  min-height: 1.5rem;
  min-width: 1.5rem;
  max-height: 3rem;
  margin: 1rem;
  border: 1px solid #a00a15;
}

.player-view {
  display: flex;
  flex-flow: row wrap;
}
.ability-list {
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

.pride-container {
  display: flex;
  flex-flow: row;
}

.shriek-token {
  display: inline-block;
  width: 5rem;
  height: 5rem;
  background-color: grey;
}

</style>