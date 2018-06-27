<template>
  <draggable class="card" @start="drag=true" @end="drag=false">
    <transition-group>
      <p v-for='(data, index) in card' :key="index"> {{ data }} </p>
    </transition-group>
  </draggable>
  
</template>

<script>
  import draggable from 'vuedraggable'

  export default {
    components: {
      draggable
    },  
    data() { 
      return {
        card: [ "name goes here",
        "placeholder text",
        "1",
        "image goes here"]
      }
    }
  }
</script>

<style scoped>
.card {
  border: 1px solid black;
  display: inline-block;
  width: 10%;
  height: 25%;
}
</style>