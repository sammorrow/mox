<template>
  <div class="board">
    <enemy-side></enemy-side>
    <player-side></player-side>
  </div>
</template>

<script>
  import EnemySide from './EnemySide'
  import PlayerSide from './PlayerSide'

  export default {components: {
    'enemy-side' : EnemySide,
    'player-side' : PlayerSide
    }}
</script>

<style scoped>
.board {
  border: 2px solid black;
  border-radius: 5px;
  height: 400px;
}
</style>