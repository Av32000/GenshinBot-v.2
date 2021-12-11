const { Inhibitor } = require('discord-akairo');
const { MongoClient } = require("mongodb");
const {MONGOSTRING} = require('../util/config');

class commandsMaintenance extends Inhibitor {
  constructor() {
      super('commandsMaintenance', {
          reason: 'La commande est temporairement désactivé',
          type: 'post'
      })
  }

  async exec(message, command) {
    let commandsblacklist = [];
    const uri = MONGOSTRING;
    const client = new MongoClient(uri);
        
    try {
      await client.connect();
      const database = client.db("BlackLists");

      const items = await database.collection('commands').find({}).toArray();
      //Ajout des users a l'array
      items.forEach(element => {
        commandsblacklist.push(element.title)
      });
    } finally {
      await client.close();
    }

    return commandsblacklist.includes(command.aliases[0]);
  }
}

module.exports = commandsMaintenance;