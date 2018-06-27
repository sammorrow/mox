<template>
  <div> 
    <button @click="dummySend"> submit </button>
  </div>
</template>

<script>
import VueSwing from 'vue-swing'
import mixins from '../mixins' 
export default {
  components: {
    'vue-swing': VueSwing, 
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

.app-container {
  display: flex;  
  flex-flow: column wrap;
}

.main-container {
  display: flex;
  max-width: 100%;
  margin: 0;
  padding: 0;
}

.player-view {
  /* max-width: 85%; */
}

.sidebar {
  position: fixed;
  width: 100%;
}

</style>
