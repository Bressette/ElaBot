const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://127.0.0.1:27017'

let db

module.exports = {
  connectToServer: function(callback) {
    MongoClient.connect(url,  {useUnifiedTopology: true}, function(err, client) {
      db  = client.db('ela-bot');
      return callback(err);
    } );
  },

  getDb: function() {
    return db;
  }
};