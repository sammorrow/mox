var Game = require('./game')
var Room = require('./room')
const Sock = require('./sock')
//var db = require('../db')
var rooms = {
  lobby: new Room({isPrivate: true})
}

function create(opts) {
  console.log('attempting to create', opts)
  // try {
  //   util.game(opts)
  // } catch(err) {
  //   return this.err(err.message)
  // }
  opts.id = this.id
  var g = new Game(opts)
  console.log('the new guy', g.join)
  rooms[g.id] = g
  this.send('route', 'g/' + g.id)
  g.once('kill', kill)
}

function join(roomID) {
  var room = rooms[roomID]
  if (!room) return this.err(`room ${roomID} not found`)
  this.exit()
  room.join(this, roomID)
}

function kill() {
  delete rooms[this.id]
}

module.exports = function (ws) {
  let sock = new Sock(ws)
  sock.on('join', join)
  sock.on('create', create)
  sock.on('close', () => {
    console.log('client disconnected :(', ws.id)
  })
  Game.broadcastGameInfo()
  //sock.send('set', { serverVersion: '0.1' })
}