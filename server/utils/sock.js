let {EventEmitter} = require('events')

// All sockets currently connected to the server.
let allSocks = []

function broadcastNumUsers() {
  //console.log(`there are now ${allSocks.length} connected users`)
  for (let sock of allSocks){
    sock.send('set', {space: 'Lobby', numUsers: allSocks.length})
  }
}

function message(msg) {
  var [type, data] = JSON.parse(msg)
  console.log('-----sending-----', type, data)
  this.emit(type, data, this)
}

var mixins = {
  err(msg) {
    this.send('error', msg)
  },
  send(type, data) {
    this.ws.send(JSON.stringify([type, data]))
  },
  exit() {
    this.emit('exit', this)
  }
}

class Sock extends EventEmitter {
  constructor(ws) {
    super();
    this.ws = ws
    var {id='', name='default'} = ws.request._query
    this.id = id.slice(0, 25)
    this.name = name.slice(0, 15)
    //var ip = ws.request.connection.remoteAddress
    var ip = ws.request.headers['x-forwarded-for']
    this.ip = ip

    for (var key in mixins){
      this[key] = mixins[key].bind(this)
    }

    allSocks.push(this)
    broadcastNumUsers()
    ws.on('message', message.bind(this))
    ws.on('close', this.exit)

    // `this.exit` may be called for other reasons than the socket closing.
    let sock = this
    ws.on('close', ()=> {
      let index = allSocks.indexOf(sock)
      if (index !== -1) {
        allSocks.splice(index, 1)
        broadcastNumUsers()
      }
    })
  }
  mixin(h) {
    h.sock = this
    this.h = h
    for (var key in mixins){
      h[key] = this[key]
    }
  }
  static broadcast(...args) {
    for (let sock of allSocks){
      console.log('broadcasting', args[1])
      sock.send(...args)
    }
  }
  // static findOrCreate(ws){
  //   const sockIdx = allSocks.findIndex(sock => sock.id === ws.request._query.id)
  //   let outputSock
  //   if (sockIdx !== -1) {
  //     console.log('already here', ws.request._query.id)
  //     allSocks[sockIdx].ws = ws
  //     allSocks[sockIdx].ip = ws.request.headers['x-forwarded-for']
  //     return allSocks[sockIdx]
  //   } else {
  //     console.log('new guy!!!!!!!!!!!', allSocks.map(sock => sock.id))
  //     outputSock = new Sock(ws)
  //   }
  //   return outputSock
  // }
}

// const findSock = ws => allSocks.findIndex(sock => sock.uid === ws.request._query.id)
// const removeSock = ws => {
//     if (findSock(ws) !== -1) allSocks.splice(findSock(ws), 1)
//     broadcastNumUsers(ws)
// }

module.exports = Sock