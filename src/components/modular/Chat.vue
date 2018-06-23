<template>
<div class="chat-container">
  <div class="chat">
    <div class="messages">
      <div :key="`m-${mIdx}`" v-for="(message, mIdx) in messages">
        <time>{{ readable(message.time) }}</time>
        <span class="name"> {{ message.name }}: {{ message.text.text }}
        </span>
      </div>
    </div>
    <input class="chat-input" v-model="localMessage" @keyup.enter="chat" placeholder="press enter to chat or /help for commands..." />
  </div>
</div>
</template>

<script>
import mixins from '../../mixins';
import moment from 'moment'
import { mapActions } from 'vuex';

export default {
  name: 'Chat',
  props: ['id'],
  data(){
    return {localMessage: ''}
  },
  computed: {
    messages(){
      return this.$store.state.game.gamesList.includes(this.id) ? this.$store.state.game[this.id].messages.filter(el => el) : []
    },
    ws() {
      return this.$store.state.ws
    }
  },
  methods: {
    ...mapActions([
      '_addMessage'
    ]),
    ...mixins,
    parse(command){
      switch(command){
        case 'help':
          return '/help: lists commands; /nick: sets nickname'
        default:
          return `invalid command; you entered ${command}`
      }
    },
    command(){
      const command = this.localMessage.slice(1),
        text = {text: this.parse(command)},
        message =
          { 
            text,
            time: Date.now(),
            name: ''
          }
      this._addMessage({id: this.id, message})
    },
    chat(){
      if (this.localMessage[0] === '/') this.command()
      else this.send('say', {text: this.localMessage})
      this.localMessage = ''
    },
    readable(timeStamp){
    return moment(timeStamp).format('hh:mm:ss')
    }
  }
  // created(){
  //   this.ws.on('hear', this.hear.bind(this))
  // },
  // destroyed(){
  //   this.ws.off('hear', this.hear.bind(this))
  // }
}
</script>

<style>
.chat-container {
  height: 100%;
  position: relative;
  min-width: 25%;
}

.chat {
  border-left: 1px solid #ccc;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: fixed;
  right: 7px;
  top: 0;
  width: 25%;
  z-index: 0;
}

.messages {
  background-color: #fafafa;
  flex-grow: 1;
  height: 100%;
  overflow: auto;
  padding: 5px;
}

.messages div {
  text-align: left;
}
time  {
  font-style: italic;
}
input {
  margin-left: -1px;
  width: 100%;
}

.chat-input {
  padding: 3px;
}


</style>