var redis = require('redis');
var client = redis.createClient();
client.on('error', function(err){
  console.log('Something went wrong ', err)
});

module.exports = client