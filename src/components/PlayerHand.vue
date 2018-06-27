<template>
  <draggable @start="drag=true" @end="drag=false">                
      <transition-group>
        <card v-for='(name, index) in hand' :name="name" :key="index"> </card>
      </transition-group>
  </draggable>
</template>

<script>
  import Card from "./Card"
  import draggable from "vuedraggable"
  export default {
    components: {
      card: Card,
      draggable: draggable
    },
    data() {
      return {
        hand: ["good","bad","meh","meme"]
      }
    }

  }
</script>