<template>
  <div  @click="selectTribe({tribe: name})" :class="isActive" class="tribe-card">
    <h2> {{capitalized}} </h2>
    <div class="tribe-stats">
      <span> Pop: {{ tribe && tribe.pop }} </span>
      <span> Str: {{ tribe && tribeStr(name) }} </span>
      <span> Percep: {{ tribe && perception(name) }} </span>
    </div>
    <div class="monster-stats">
      <h3> Monsters </h3>
      <span :key="`${name}-${monsterIdx}`" v-for="(monster, monsterIdx) in tribe" class="monster-card"/>
    </div>
    <div class ="actions">
      <button @click="tribeSpecial"> Special Ability </button>
      <button 
        title="ambush the knight. your tribe will scatter afterward."
        v-if="state && state.state === 'ambushing'"
        :disabled="isDisabled()"    
        @click="ambushGoblin({tribe: name})"> Ambush! </button>
    </div>
  </div>  
</template>

<script>

const imageSet = require.context('../../assets/goblin-view', false, /\.png$/)

import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'tribe-card',
  props: [ 'tribe', 'name' ],
  computed: {
    ...mapGetters([
      'tribeStr',
      'perception'
    ]),
    capitalized(){
      return this.name.slice(0, 1).toUpperCase().concat(this.name.slice(1))
    },
    state(){
      return this.$store.state.goblin
    },
    knightState(){
      return this.$store.state.knight
    }
  },
  methods: {
    ...mapActions([
      'selectTribe',
      'ambushGoblin'
    ]),
    isActive(){

    },
    isDisabled(){
      return false
      //return this.tribeStr(this.name) < +this.knightState.strength
    },
    tribeSpecial(){
      this[`${this.name}Ability`]()  
    }
  }
}
</script>

<style scoped>
.tribe-card {
  display: inline-block;
  min-width: 9rem;
  min-height: 9rem;
  margin: 0 0.5rem;
  border: 1px solid red;
}
.tribe-stats, .monster-stats {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
}
</style>