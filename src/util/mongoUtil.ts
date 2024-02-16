import MongoClient from 'mongodb'

export class MongoUtil {
  private static url = 'mongodb://127.0.0.1:27017'
  private static db;

  public static connectToServer(callback) {
    MongoClient.connect(MongoUtil.url,  {useUnifiedTopology: true}, (err, client) => {
      MongoUtil.db = client.db('ela-bot');
      return callback(err);
    } );
  }

  public static getDb() {
    return MongoUtil.db;
  }
}