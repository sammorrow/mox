<template>
  <div class="app-container">
    <div class="main-container">
      <overlay></overlay>
      <the-board></the-board>
    </div>
    <sidebar class="sidebar"></sidebar> 
    <div class="player-view">
      <knight-view v-if="activePlayerID === 0"></knight-view>
      <goblin-view v-else-if="activePlayerID === 1"></goblin-view>
      <dragon-view v-else-if="activePlayerID === 2" ></dragon-view>
      <cave-view v-else></cave-view>
    </div>
  </div>
</template>

<script>
import Board from './Board'
import Sidebar from './Sidebar'
import { KnightView, GoblinView, DragonView, CaveView } from './playerView'
import Overlay from './Overlay'

export default {
  name: 'GameController',
  components: {
    'overlay': Overlay,
    'the-board': Board,
    'sidebar': Sidebar,
    'knight-view': KnightView,
    'dragon-view': DragonView,
    'goblin-view': GoblinView,
    'cave-view': CaveView
  },
  computed: {
    activePlayerID(){
      return this.$store.state.arbitrator.activePlayerID
    }
  }
}
</script>

<style scoped>

.app-container {
  display: flex;  
  flex-flow: column wrap;
}

.main-container {
  display: flex;
  max-width: 85%;
  margin: 0;
  padding: 0;
}

.player-view {
  max-width: 85%;
}

sidebar {
  width: 100%;
}

</style>
