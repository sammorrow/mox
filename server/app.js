const path = require('path');
const express = require('express')
const morgan = require('morgan');
const session = require('express-session');

const PORT = process.env.PORT || 8080;
const app = express()
// var cookieSession = require('cookie-session')

// const db = require('./db')

// db.set('my test key', JSON.stringify('test'))
// db.get('my test key', function(error, result) {
//   if (error) throw error;
//   console.log('GET result ->', result)
// });

app.use(morgan('dev'))
// .use(cookieSession({
//   name: 'session',
//   keys: ['my dog is Cody'],
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }))
// .use(function (req, res, next) {
//   req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
//   next()
// })
.use(express.static(path.join(__dirname, '..', 'public')))
// .use(session({
//   secret: process.env.SESSION_SECRET || 'my best friend is Cody',
//   resave: false,
//   saveUninitialized: true,
//   maxAge: 60000
// }))
// .use(passport.initialize())
// .use(passport.session())
.use((req, res, next) =>
  path.extname(req.path).length > 0 ? res.status(404).send('Not found') : next())
.use('*', (req, res) =>
  res.sendFile(path.join(__dirname, '..', 'public/index.html')))
.use((err, req, res, next) =>
  res.status(err.status || 500).send(err.message || 'Internal server error.'));

const router = require('./utils/router');

var engine = require('engine.io');
var http = require('http').createServer(app);
var server = engine(http);

server.on('connection', function(socket){
  router(socket);
});


http.listen(8080, () => {
  console.log('listening on port 8080')
})