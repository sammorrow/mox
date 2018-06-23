<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
// import _ from 'lodash'
import eio from 'engine.io-client'

export default {
  name: 'App',
  methods: {
    ...mapActions([
      '_set',
      '_addMessage'
    ]),
    message(msg){
      msg = msg.toString()
      if (JSON.parse(msg)[0] === 'set') {
        console.log('received', JSON.parse(msg)[1])
        this._set(JSON.parse(msg)[1])
      } else if (JSON.parse(msg)[0] === 'route') {
        console.log('routed,', msg)
        this.$router.push(JSON.parse(msg)[1])
      } else if (JSON.parse(msg)[0] === 'say') {
        console.log('said')
      } else if (JSON.parse(msg)[0] === 'chat') {
        console.log('chat received,', msg)
        let newChat = JSON.parse(msg)[1]
        newChat.space = 'Game'
        this._set(newChat)
      } else if (JSON.parse(msg)[0] === 'hear') {
        console.log('heard,', msg)
        let newMsg = JSON.parse(msg)[1]
        newMsg.space = 'Game'
        this._addMessage(newMsg)
      }
    },
    connect() {
      let { id, name } = this
      let options = {
        query: { id, name }
      }
      let ws = this.ws = eio(location.host, options)
      this._set({space: 'Root', ws: this.ws})
      ws.on('open' , ()=> console.log('open'))
      ws.on('close', ()=> console.log('close'))
      //ws.on('set', payload => console.log('set', payload))
      ws.on('message', this.message)
    },
    restore(){
      let val = localStorage.getItem('id')
      if (val) {
        try {
          this._set({space: 'Lobby', id: JSON.parse(val)})
        } catch(e) {
          delete localStorage.getItem('id')
        }
      }
      if (!this.id) {
        this._set({space: 'Lobby', id: JSON.stringify(Math.random().toString(36).slice(2))})
        console.log(this.id, 'ehhhhhhh ----------------------')
        localStorage.setItem('id', this.id)
      }
    },
  },
  computed: {
    id () {return this.$store.state.lobby.id},
    name () {return 'default'}
  },
  created(){
    this.restore()
    this.connect()
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  content: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
