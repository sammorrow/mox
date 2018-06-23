<template>
  <div class ="board-container">
     <div id="board">
       <div class="row" v-for="(row, rIndex) in board" :key="'r-' + rIndex">
        <div class="cell" ref="rIndex + '-' + index" v-for="(cell, index) in row" :key="rIndex + '-' + index" ><game-cell :contents="cell"></game-cell> </div>
      </div>
    </div>
</div>
</template>

<script>
import Cell from './Cell'
import panzoom from 'panzoom'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Board',
  components: {
    'game-cell': Cell
  },
  data: function () {
    return {
      clicking: false,
      prevX: 0,
      prevY: 0,
      panning: false
    }
  },
  computed: {
    ...mapGetters([
      'centerCell'
    ]),
    board () {
      return this.$store.state.board
    }
  },
  mounted () {
     panzoom(document.getElementById('board'), {smoothScroll: false,
          minZoom: 1,
          maxZoom: 4.25,
          zoomDoubleClickSpeed: 1, 
        }).zoomAbs(
          document.getElementById('center-cell').getBoundingClientRect().x + 150, // initial x position
          document.getElementById('center-cell').getBoundingClientRect().y + 200, // initial y position
          3.5   // initial zoom 
        );
  },
  methods: {
    ...mapActions([
        'refreshKnightPathmap'
      ])
  }
}

</script>

<style scoped>

.board-container {
  overflow: hidden;
  max-height: 75vh;
  background-color: grey;
}
#board {
  border: 1px solid red;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  margin: auto;
  border: 1px solid black;
  -moz-transition: all 0.3s;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  overflow: hidden;
  transform: scale(2.0)

}

/* .board:hover {
  -moz-transform: scale(1.1);
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
} */

.row {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>


