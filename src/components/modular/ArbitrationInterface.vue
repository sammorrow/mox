<template>
<div>
  <button @click="endTurn"> Pass turn </button>
  <button @click="logState"> state </button>
  <button @click="resolveTileIssue"> resolve / clear state </button>
  <div> 
    <h2> STATE -- <span> {{ activePlayer }} : {{ gameState }} </span> </h2>
  </div>
  <div v-if="gameOver"> It's over </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ArbitrationInterface',
  methods: {
    ...mapActions([
      'endTurn',
      'resolveTileIssue'
    ]),
    logState(){
      console.log(this.$store.state)
    }
  },
  computed: {
    ...mapGetters([
      'activePlayer'
    ]),
    gameState(){
      return this.$store.state[this.activePlayer.toLowerCase()].state
    },
    gameOver(){
      return this.$store.state.arbitrator.gameState === 'done'
    }
  }
}
</script>

<style scoped>

</style>