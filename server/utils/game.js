let _ = require('./_')
let Human = require('./human')
let Room = require('./room')
let Sock = require('./sock')
let SECOND = 1000
let MINUTE = 1000 * 60
let HOUR   = 1000 * 60 * 60 * 24

let games = {}

;(function playerTimer() {
  for (var id in games) {
    var game = games[id]
    if (game.round < 1)
      continue
    for (var p of game.players)
      if (p.time && !--p.time)
        p.pickOnTimeout()
  }
  setTimeout(playerTimer, SECOND)
})()

;(function gameTimer() {
  var now = Date.now()
  for (var id in games)
    if (games[id].expires < now)
      games[id].kill('game over')

  setTimeout(gameTimer, MINUTE)
})()

module.exports = class Game extends Room {
  constructor({id, title, seats, isPrivate}) {
    super({isPrivate})
    var gameID = _.id()
    Object.assign(this, {
      title, 
      seats,
      delta: -1,
      hostID: id,
      id: gameID,
      players: [],
      round: 0,
      rounds: 3
    })
    this.renew()
    games[gameID] = this
    Game.broadcastGameInfo()
  }

  renew() {
    this.expires = Date.now() + HOUR
  }

  get isActive() {
    return this.players.some(x => x.isActive)
  }

  get didGameStart() {
    return this.round !== 0
  }

  get isGameFinished() {
    return this.round === -1
  }

  get isGameInProgress() {
    return this.didGameStart && !this.isGameFinished
  }

  // The number of total games. This includes ones that have been long since
  // abandoned but not yet garbage-collected by the `renew` mechanism.
  static numGames() {
    return Object.keys(games).length
  }

  // The number of games which have a player still in them.
  static numActiveGames() {
    let count = 0
    for (let id of Object.keys(games)) {
      if (games[id].isActive)
        count++
    }
    return count
  }

  // The number of players in active games.
  static totalNumPlayers() {
    let count = 0
    for (let id of Object.keys(games)) {
      if (games[id].isActive) {
        count += games[id].players.filter(x => x.isConnected && !x.isBot).length
      }
    }
    return count
  }

  static broadcastGameInfo() {
    Sock.broadcast('set', {
      space: 'Lobby',
      numPlayers: Game.totalNumPlayers(),
      numGames: Game.numGames(),
      numActiveGames: Game.numActiveGames(),
    })
    Game.broadcastRoomInfo()
    console.log(`there are now ${Game.totalNumPlayers()} total players in ${Game.numGames()} games, ${Game.numActiveGames()} active`)
  }

  static broadcastRoomInfo() {
    let roomInfo = []
    for (let id of Object.keys(games)) {
      let game = games[id]
      if (game.isPrivate || game.didGameStart || !game.isActive)
        continue

      let usedSeats = game.players.length
      let totalSeats = game.seats
      if (usedSeats === totalSeats)
        continue

      roomInfo.push({
        id: game.id,
        title: game.title,
        usedSeats,
        totalSeats,
        name: game.name,
        timeCreated: game.timeCreated,
      })
    }
    Sock.broadcast('set', { space: 'Lobby', roomInfo: roomInfo })
  }

  name(name, sock) {
    sock.h.name = sock.name
    this.meta()
  }

  join(sock, roomID) {
    for (var i = 0; i < this.players.length; i++) {
      var p = this.players[i]
      if (p.id === sock.id) {
        p.attach(sock)
        this.greet(p, roomID)
        this.meta()
        return
      }
    }

    if (this.didGameStart) return sock.err('game already started')

    super.join(sock)
    var h = new Human(sock)
    if (h.id === this.hostID) {
      h.isHost = true
      sock.once('start', this.start.bind(this))
      sock.on('kick', this.kick.bind(this))
      sock.on('swap', this.swap.bind(this))
    }
    h.on('meta', this.meta.bind(this))
    this.players.push(h)
    this.greet(h, roomID)
    this.meta()
  }

  swap(players) {
    let i = players[0],
        j = players[1],
        l = this.players.length

    if( j < 0 || j >= l  )
      return;

    [this.players[i], this.players[j]] = [this.players[j], this.players[i]];

    this.players.forEach((p, i) =>
      p.send('set', { space: 'Game', self: i }))
    this.meta()
  }

  kick(i) {
    let h = this.players[i]
    if (!h || h.isBot)
      return

    if (this.didGameStart)
      h.kick()
    else
      h.exit()

    h.err('you were kicked')
    h.kick()
  }

  greet(h, id) {
    console.log('greetings to', id)
    h.isConnected = true
    h.send('set', {
      space: 'Game',
      isHost: h.isHost,
      id,
      round: this.round,
      self: this.players.indexOf(h),
    })
  }

  exit(sock) {
    if (this.didGameStart)
      return

    super.exit(sock)
    sock.removeAllListeners('start')
    var index = this.players.indexOf(sock.h)
    this.players.splice(index, 1)

    this.players.forEach((p, i) =>
      p.send('set', { self: i }))
    this.meta()
  }

  meta(state={}) {
    console.log('meta with', this.id)
    state.id = this.id
    state.space = 'Game'
    state.players = this.players.map(p => ({
      name: p.name,
      time: p.time,
      deck: p.deck.length || 0,
      isConnected: p.isConnected,
      isReadyToStart: p.isReadyToStart,
    }))
    for (var p of this.players){
      p.send('set', state)
    }
    Game.broadcastGameInfo()
  }

  kill(msg) {
    if (!this.isGameFinished)
      this.players.forEach(p => p.err(msg))

    delete games[this.id]
    console.log(`game ${this.id} destroyed`)
    Game.broadcastGameInfo()

    this.emit('kill')
  }

  end() {
    var humans = 0
    for (var p of this.players)
        if (!p.isBot) {
            humans++
            p.send('log', p.draftLog.round)
        }

    var draftcap = {
      "gameID": this.id,
      "players": humans,
      "sets": this.sets,
      "seats": this.seats,
      "time": Date.now(),
      "cap": []
    }
    var seatnumber = 0
    for (var p of this.players) {
      seatnumber++
      var playercap = {
        "id": p.id,
        "name": p.name,
         "ip": p.ip,
        "seat": seatnumber,
        "picks": p.cap.packs
      }
      draftcap.cap.push(playercap)
    }

    this.renew()
    this.round = -1
    this.meta({ round: -1 })
  }

  startRound() {
    if (this.round++ === this.rounds) return this.end()
    this.meta({ round: this.round })
  }

  hash(h, deck) {
    h.hash = hash(deck)
    this.meta()
  }

  start({useTimer, timerLength, shufflePlayers}) {

    const { players } = this

    if (!players.every(x => x.isReadyToStart)) return

    this.renew()
    console.log(`4 player match ${this.id} started with ${this.players.length} players and ${this.seats} seats`)
    Game.broadcastGameInfo()

    players.forEach((p, i) => {
      p.on('submit', this.receive.bind(this, p))
      //p.send('set', { space: 'Lobby', self: i })
    })
    this.startRound()
  }

  receive(info){
    const { players } = this
    console.log("GAME RECEIVED", info)
    if (players.every(x => x.isReady)){
      this.executeTurn()
    }
  }

  executeTurn(){
    const { players } = this;
    let board = []
    players.forEach(p => {
      p.orders.forEach(order => {
        if (typeof order.lane !== 'number') console.log('invalid order')
        else p.board[order.lane] = order.unit 
      })
      board = board.concat({id: p.id, board: p.board})
    })
    console.log('our board: ', board)
    players.forEach(p => {
      p.send('set', {board})
      p.draw();
    })
    this.meta();
  }
}