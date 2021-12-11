const { Inhibitor } = require('discord-akairo');
const { MongoClient } = require("mongodb");
const {MONGOSTRING} = require('../util/config');

class userBlacklistInhibitor extends Inhibitor {
  constructor() {
      super('userblacklist', {
          reason: 'Vous êtes BlackLister',
          type: 'post'
      })
  }

  async exec(message) {
    let userblacklist = [];
    const uri = MONGOSTRING;
    const client = new MongoClient(uri);
        
    try {
      await client.connect();
      const database = client.db("BlackLists");

      const items = await database.collection('users').find({}).toArray();
      //Ajout des users a l'array
      items.forEach(element => {
        userblacklist.push(element.content)
      });
    } finally {
      await client.close();
    }

    return userblacklist.includes(message.author.id);
  }
}

module.exports = userBlacklistInhibitor;