<template>
  <div class="settings-container">
    <div class="game-status">
      <fieldset>
        <legend> Players </legend>
        <table>
          <tr>
            <th> # </th>
            <th> </th> 
            <!-- ^ connection status  -->
            <th> name </th>
            <th> role </th>
            <th><div v-if="isHost()"> kick </div></th> 
             <!-- ^ kick button  -->
          </tr>
          <tr :key="`p-${playerNum}`" v-for="(player, playerNum) in getPlayers()"> 
            <td> {{ playerNum }} </td>
            <td> {{player.isConnected}} </td> 
            <!-- ^ connection status  -->
            <td> {{ player.name }} </td>
            <td> {{ player.name }} </td>
            <td><button @click="kick" v-if="isHost()"> X </button></td> 
             <!-- ^ kick button  -->
          </tr>
        </table>
      </fieldset>
    </div>
    <button @click="startGame"> START </button>
    <chat :id="this.id"></chat>

  </div>
</template>

<script>
import Chat from './modular/Chat'
import mixins from '../mixins';

export default {
  name: 'GameSettings',
  props: ['startGame', 'id'],
  components: {
    'chat': Chat
  },
  computed: {
    playerGames () {return this.$store.state.game},
    ws () {return this.$store.state.ws}
  },
  methods: {
    ...mixins,
    kick: function(){
      console.log('yeouch!')
    },
    isHost: function(){
      return this.playerGames[this.id] && this.playerGames[this.id].isHost
    },
    getPlayers: function(){
      return this.playerGames.gamesList.includes(this.id) ? this.playerGames[this.id].players : [{name: 'bugged'}]
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


</style>
