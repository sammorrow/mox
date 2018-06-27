<template>
  <div class="enemy-side">
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
.enemy-side {
  height: 50%;
}
</style>