const path = require('path');
const express = require('express')
const morgan = require('morgan');
const session = require('express-session');
const PORT = process.env.PORT || 8080;
const app = express()

app.use(morgan('dev'))
.use(express.static(path.join(__dirname, '..', 'public')))
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


http.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})