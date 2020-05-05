const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://127.0.0.1:27017'

var db;

module.exports = {
  connectToServer: function(callback) {
    MongoClient.connect(url,  {useNewUrlParser: true}, function(err, client) {
      db  = client.db('ela-bot');
      return callback(err);
    } );
  },

  getDb: function() {
    return db;
  }
};