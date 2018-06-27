<template>
  <div class="game">
    <enemy-hand></enemy-hand>
    <game-board></game-board>
    <player-hand></player-hand>
  </div>
</template>

<script>
  import EnemyHand from './EnemyHand'
  import PlayerHand from './PlayerHand'
  import GameBoard from './GameBoard'

  export default {components: {
    'enemy-hand' : EnemyHand,
    'player-hand' : PlayerHand,
    'game-board' : GameBoard
    },
  methods: {
    ...mixins,
    dummySend(){
      console.log('sent')
      this.send('submit', [{lane: 0, unit: 'grunt'}])
    }
  }
}

</script>

<style scoped>
.game {
  width: 90%;
  height: 500px;
}
</style>