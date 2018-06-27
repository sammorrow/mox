<template>
  <draggable class="card" @start="drag=true" @end="drag=false">
    <transition-group>
      <p :key="name.index"> {{ name }} </p>
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
        name: "name goes here",
        text: "placeholder text",
        power: "1",
        image: "image goes here"
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