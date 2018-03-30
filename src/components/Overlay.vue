<template>
  <div class="overlay-container">
    <div class="player-bip">
      <img v-bind:src="imageScry('00')" />
      <div class='overlay-lower'>
        <span class="active-bar" :class="isActive(0)"/>
        <span>HP {{state.knight.health}} </span>
        <span>AP {{state.knight.totalAP}} </span>
        <span>STR {{state.knight.strength}} </span>
      </div>
    </div>
    <div class="player-bip">
      <img v-bind:src="imageScry('01')" />
      <div class='overlay-lower'>
        <span  class="active-bar" :class="isActive(1)"/>
        <span>RAGE {{state.goblin.rage}} </span>
        <span>POP {{state.knight.totalAP}} </span>
        <span>SEC {{state.goblin.rage}} </span>
      </div>
    </div>
    <div class="player-bip">
      <img v-bind:src="imageScry('02')" />
      <div class='overlay-lower'>
        <span class="active-bar" :class="isActive(2)"/>
        <div>
          <span>HP {{state.dragon.health}} </span>
          <span>AR {{getters.armor}} </span>
          <span>SP  {{getters.spirit}} </span>
          <span>WAKE {{getters.wakefulness}} </span>
        </div>
      </div>
    </div>
    <div class="player-bip">
      <img v-bind:src="imageScry('03')" />
      <div class='overlay-lower'>
        <span :class="isActive(3)"/>
        <span>OMENS {{state.knight.health}} </span>
        <span>TILES LEFT {{state.knight.totalAP}} </span>
        <span>CRYSTALS {{state.knight.movement}} </span>
      </div>
    </div>
  </div>
</template>

<script>
const imageSet = require.context('../assets/overlay', false, /\.png$/)
import { mapGetters } from 'vuex'

export default {
    name: 'Overlay',
    computed: {
      ...mapGetters([
        'activePlayers'
      ]),
      state () {
        return this.$store.state
      },
      getters () {
        return this.$store.getters
      }
    },
    methods: {
        imageScry(numStr) {
            return imageSet(`./${numStr}.png`)
        },
        parseClass(bool) {
            return bool ? "active" : "inactive"
        },
        isActive(index){
          return this.state.arbitrator.activePlayerID === index ? 'active' : 'inactive'
        }
    }
}
</script>

<style scoped>

.active-bar {
  display: inline-block;
  height: 5px;
  width: 100%;
  transition: 0.2s ease-in;
}

.inactive {
  display: inline-block;
  width: 100%;
  height: 10px;
  margin: 0;
  background-color: grey;
}

.active {
  display: inline-block;
  width: 100%;
  height: 10px;
  margin: 0;
  background-color: red;
}

.player-bip {
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  width: 12rem;
  height: 7rem;
  background-color:white;
  overflow: hidden;
}

.player-bip img {
  width: 100%;
  height: 75%;
  overflow: hidden;
}
.overlay-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 25%;
  width: 1000px;
  height: 70px;
  z-index: 1;
}

.overlay-lower {
  flex: 1;
  display: flex;
  flex-flow: row wrap;
}
</style>