
<template>
  <div class="cell-container" :id="isCenter">
      <span id="knight" v-if="contents && contents.tokens && contents.tokens.knight" />
      <span class="dragon" v-if="contents && contents.tokens && contents.tokens.dragon" />
      <span class="fangs" v-if="contents && contents.tokens && contents.tokens.fangs" />
      <span class="bones" v-if="contents && contents.tokens && contents.tokens.bones" />
      <span class="eye" v-if="contents && contents.tokens && contents.tokens.eye" />
    <div class="square" @click.shift="rotateCell" @click.ctrl="onClick" v-bind:class="lightLevel">
      <img class="cell" v-bind:class="cellOrientation" v-if="isLit" v-bind:src="selectTile(contents.tile)" />
      <img class="cell" v-else-if="isDark" v-bind:src="selectTile(contents.back, 'back')" />
      <p class="cell" v-else></p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
const tileSet = require.context('../assets/tileset', false, /\.png$/)
const tileBacks = require.context('../assets/tileset/backs', false, /\.png$/)

export default {
  name: 'Cell',
  props: [ 'contents' ],
  data () {
    return { orientation: 0 }
  },
  computed: {
    ...mapGetters([
      'activePlayer'
    ]),
    cellState: function () {
      if (this.contents) return this.contents
      return null
    },
    lightLevel: function () {
      if (!this.contents || this.contents === 1) return 'black'
      if (this.contents.type === 2) return 'dark'
      if (this.contents.type === 3) return 'lit'
      return 'black'
    },
    cellOrientation: function () { 
      if (this.contents.orientation < 90) return ''
      if (this.contents.orientation < 180) return 'quarter-turn'
      if (this.contents.orientation < 270) return 'half-turn'
      return 'three-quarter-turn'
    },
    isLit: function () {
      return this.contents && this.contents.type === 3
    },
    isDark: function () {
      return this.contents && this.contents.type === 2
    },
    isCenter: function(){
      return this.contents && this.contents.y === 15 && this.contents.x === 15 ? 'center-cell' : ''
    },
    activePlayerStore: function(){
      return this.$store.state[this.activePlayer.toLowerCase()]
    }
  },
  methods: {
      ...mapActions([
        'reorientCell',
        'evaluateMove',
        'useAbility'
    ]),
    onClick: function(){
      if (this.activePlayerStore.state === 'free') this.evaluateMove({cell: this.cellState})
      else if (this.activePlayerStore.state === 'usingItem' && this.activePlayerStore.pathMap.includes(`${this.cellState.y}-${this.cellState.x}`)) this.useAbility(this.cellState)
      else console.log('invalid action, state is not free')
    },
    selectTile: function(numStr, option){
      if (option) return tileBacks(`./${numStr}.png`)
      return tileSet(`./${numStr}.png`)
    },
    rotateCell: function(){
      console.log(this.contents)
      if (!this.isLit) return
      if (this.activePlayerStore.state === 'reorienting' && this.$store.state.arbitrator.offendingTiles.includes(`${this.contents.y}-${this.contents.x}`)){
        this.orientation = (this.orientation + 90) % 360
        this.reorientCell({...this.cellState, orientation: (this.cellState.orientation + 90) % 360})
      } else {
        console.log('you cannot reorient this tile')
      }
    }
  }
}
</script>

<style scoped>
.square {
  width: 3rem;
  height: 3rem;
  object-fit: cover;
}

img {
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
}
.black {
  background-color: black;
}

.dark {
  background-color: #444
}

.lit {
 background-color: #eee
}
.cell {
  overflow: hidden;
  display: inline-block;
  width: 100%;
  height: 100%;
  margin: 0;
}
.quarter-turn {
  transform: rotateZ(90deg);
}
.half-turn {
  transform: rotateZ(180deg);
}
.three-quarter-turn {
  transform: rotateZ(270deg);
}

.cell-container {
  position: relative;
}

#knight {
  width: 1rem;
  height: 1rem;
  background-image: url('../assets/knight-view/00.png');
  background-size: cover;
  position: absolute;
  z-index: 3;
  cursor: pointer;
}

.dragon {
  width: 1rem;
  height: 1rem;
  background-image: url('../assets/dragon-view/00.png');
  background-size: cover;
  position: absolute;
  z-index: 2;
  cursor: pointer;
  bottom: 0%;
}

.fangs {
  width: 1rem;
  height: 1rem;
  background-image: url('../assets/goblin-view/00.png');
  background-size: cover;
  position: absolute;
  z-index: 2;
  cursor: pointer;
  bottom: 0%;
}

.bones {
  width: 1rem;
  height: 1rem;
  background-image: url('../assets/goblin-view/00.png');
  background-size: cover;
  position: absolute;
  z-index: 2;
  cursor: pointer;
  bottom: 0%;
}


.eye {
  width: 1rem;
  height: 1rem;
  background-image: url('../assets/goblin-view/00.png');
  background-size: cover;
  position: absolute;
  z-index: 2;
  cursor: pointer;
  bottom: 0%;
}


</style>
