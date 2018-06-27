<template>
  <div class="card">
    <p v-for='(data, index) in card' :key="index"> {{ data }} </p>
  </div>
  
</template>

<script>
  export default {
    props: ['name'],
    data() { 
      return {
        card: [ this.name,
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