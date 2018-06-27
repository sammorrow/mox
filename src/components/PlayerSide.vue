<template>
  <div class="player-side">
    <column></column>
    <column></column>
    <column></column>
    <column></column>
    <column></column>
    <column></column>
    <column></column>
    <column></column>
  </div>
</template>

<script>
  import Column from './Column'
  export default {
    components: {
      'column' : Column
    }
  }
</script>

<style scoped>
.player-side {
  height: 50%;
}
</style>