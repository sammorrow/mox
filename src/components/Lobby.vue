<template>
<div class="lobby-container">
  <div class="lobby">
    <h1 class="lobby-header"> <span class="left"> MOX ONLINE </span> </h1>
    <div class="lobby-subheader">
      <p> {{ lobbyState.numUsers }} user{{lobbyState.numUsers !== 1 ? 's' : '' }} online • {{ lobbyState.numPlayers}} player{{lobbyState.numPlayers !== 1 ? 's' : '' }} in {{ lobbyState.numActiveGames }} game{{lobbyState.numActiveGames !== 1 ? 's' : '' }}</p>
    </div>
    <div>
      <fieldset class="lobby-box">
        <legend align="left"> Create a room </legend>
        <div>
          <label> Room name: </label>
          <input v-model="title" type="text" />
        </div>
        <div>
            <label> Number of players: </label>
          <select v-model="seats"> 
            <option> 3 </option>
            <option> 4 </option>
          </select>
        </div>
        <div>
          <label> Private : </label>
          <input v-model="isPrivate" type="checkbox" />
        </div>
        <button @click="createRoom"> Create Room </button>
      </fieldset>
    </div>
    <div>
      <fieldset>
        <legend align="left"> Join a room </legend>
        <table v-if="noRooms()">
          <div class="rooms-message">
            <p> There are no open rooms. </p>
          </div>
        </table>
        <table v-else>
          <thead>
          <th> Name </th>
          <th> Format </th>
          <th> Seats </th>
          <th> </th>
          </thead>
          <tbody>
            <tr :key="room.id" v-for="room of lobbyState.roomInfo">
              <td> {{ room.title }} </td>
              <td> Normal </td>
              <td> {{ room.usedSeats }} / {{ room.totalSeats }} </td>
              <td> <router-link :to="{path: `/g/${room.id}`}"> Join room </router-link> </td>
            </tr>
          </tbody>
        </table>
      </fieldset>
    </div>
  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import mixins from '../mixins';

export default {
  name: 'lobby',
  data () {
    return {
      title: 'Default',
      seats: 4,
      isPrivate: false,
    }
  },
  computed: {
    lobbyState () {return this.$store.state.lobby},
    ws () {return this.$store.state.ws}
  },
  methods: {
    ...mixins,
    createRoom(){
      this.send('create', this.$data)
    },
    noRooms(){
      return this.lobbyState.roomInfo.length === 0
    }
  }
}
</script>

<style scoped>
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
  margin: 10px 0;
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

.lobby-subheader, .rooms-message {
  display: flex;
  justify-content: flex-start;
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
table {
  width: 100%;
  border-collapse: collapse;
}

tr:nth-child(odd) {background: #CCC}

</style>