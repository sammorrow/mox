<template>
  <div>                 
    <enemy-card></enemy-card>
    <enemy-card></enemy-card>
    <enemy-card></enemy-card>
    <enemy-card></enemy-card>

  </div>
</template>

<script>
  import EnemyCard from "./EnemyCard"


  export default {
    components: {
      'enemy-card': EnemyCard
    }

  }
</script>