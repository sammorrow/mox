<template>
  <div class="app-container">
    <div class="main-container">
      <game-settings v-if="!inProgress()" :startGame="startGame" :id="this.id"></game-settings>
      <game v-else></game>
    </div>
  </div>
</template>

<script>
import Game from './Game'
import GameSettings from './GameSettings'
import mixins from '../mixins';

export default {
  name: 'GameController',
  props: ['id'],
  components: {
    'game': Game, 
    'game-settings': GameSettings
  },
  computed: {
    ws () {return this.$store.state.ws},
    gamesState (){return this.$store.state.game}
  },
  methods: {
    ...mixins,
    inProgress(){
      return this.gamesState.gamesList.includes(this.id) ? this.gamesState[this.id].round !== 0 : false
    },
    startGame(){
      this.send('start', this.id)
    }
  },
  mounted(){
    this.send('join', this.id)
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
  margin: 0;
  padding: 0;

}

h1 {
  font-family: 'Montserrat', 'Arial', sans-serif;
  text-transform: uppercase;
}

fieldset {
  background-color: #eaeaea;
  border-radius: 3px;
  border: solid #ccc 1px;
  line-height: 20px;
  padding: 10px;
  margin: 10px;
}

legend {
  background-color: #FFFFFF;
  border: solid #ccc 1px;
  box-shadow: 0 1px 1px 0 #ccc;
  color: #089dff;
  font-family: 'Montserrat', 'Arial', sans-serif;
  font-size: 20px;
  font-weight: bold;
  padding: 3px 5px;
}

input[type=button], button, input[type=text], textarea, select {
  font-size: 16px;
  line-height: 16px;
  padding: 3px;
}


input[type=button], button, input[type=text], textarea {
  border: solid #d0d0d0 1px;
}

input[type=button], button {
  background-color: #f0f0f0;
  padding: 5px;
}

input[type=button]:hover, button:hover, input[type=text]:hover, textarea:hover {
  border-color: #909090;
}

input[type=button]:active, button:active {
  box-shadow: 0 0 1px 0 black inset;
}

input[type=button]:disabled, button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

input[type=button]:disabled:hover, button:disabled:hover {
  border: solid #ccc 1px;
}

input[type=button]:disabled:active, button:disabled:active {
  box-shadow: none;
}

select, input {
  padding: 0 0.5rem;
  margin: 0 10px;
}

.lobby-box {
  display: flex;
  align-items: flex-start;
}

button {
  margin-top: 10px;
}

.lobby-box > div {
  display: flex;
  align-items: flex-start;
}

.lobby {
  flex-grow: 1;
  margin: 0 auto;
  padding-right: 30px;
}

.lobby-header {
  font-size: 40px;
  height: 40px;
}

.lobby-container {
  box-sizing: border-box;
  height: 100%;
  padding: 30px 0 30px 30px;
  display: flex;
  flex-direction: row;
}

.spacer-dot:after {
  content: "\00b7";
  display: inline-block;
  width: 0.75em;
  text-align: center;
}

.lobby .fieldset:not(:last-child) {
  margin-bottom: 30px;
}

.left {
  float: left;
}

</style>
