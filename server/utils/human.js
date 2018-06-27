const {EventEmitter} = require('events')
const _ = require('./_')
const deck = require('./deck')

module.exports = class extends EventEmitter {
  constructor(sock) {
    super(sock)
    Object.assign(this, {
      isBot: false,
      isConnected: false,
      isReadyToStart: true,
      isReady: false,
      id: sock.id,
      ip: sock.ip,
      name: sock.name,
      time: 0,
      commands: {},
      board: new Array(8).fill({}),
      deck
    })
    this.attach(sock)
  }
  get isActive() {
    return this.isConnected && !this.isBot
  }
  attach(sock) {
    if (this.sock && this.sock !== sock)
      this.sock.ws.close()

    sock.mixin(this)
    sock.on('readyToStart', this._readyToStart.bind(this))
    sock.on('submit', this._receive.bind(this))
    sock.once('exit', this._farewell.bind(this))
  }
  err(message) {
    this.send('error', message)
  }
  _farewell() {
    this.isConnected = false
    this.emit('meta')
  }
  _readyToStart(value) {
    this.isReadyToStart = value
    this.emit('meta')
  }
  _receive(orders) {
    this.isReady = true;
    this.orders = orders
    this.emit('submit', {noiiiice: 'noice'})
  }
  draw(num = 1){
    if (this.deck.length > num){
      card = this.deck.slice(0, num)
      this.deck = this.deck.slice(0, num)
    } else card = {name: 'Nothing', power: 0}
    this.send('draw', card)
  }
  kick() {
    this.send = ()=>{}
    this.isBot = true
  }
}
