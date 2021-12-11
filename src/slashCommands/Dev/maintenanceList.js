const { MongoClient } = require("mongodb");
const {MONGOSTRING} = require('../../util/config'); 

class Ping {
  async exec(interaction, command) {
    if (command == null) {
      const uri = MONGOSTRING;
      const client = new MongoClient(uri);

      let commands = []

      try {
        await client.connect();
        const database = client.db("BlackLists");


        const items = await database.collection('commands').find({}).toArray();
        items.forEach(element => {
          commands.push(element.title)
        });
      } finally {
        await client.close();
      }
      if(commands.length == 0)
      {
        interaction.reply({
          content: `Il n'y a pas de commandes en maintenance`
        })
      }

      interaction.reply({
        content: `Voici la liste des commandes en maintenance : \n ${commands.join('\n')}`
      })
    } else {
      const uri = MONGOSTRING;
      const client = new MongoClient(uri);

      try {
        await client.connect();
        const database = client.db("BlackLists");
        const movies = database.collection("commands");

        const query = { title: `${command}` };

        const movie = await movies.findOne(query);

        if (movie == null) {
          interaction.reply({
            content: `Cette commande n'est pas en maintenance ❌`,
            ephemeral: true
          })
          return;
        }

        interaction.reply(`La commande ${movie.title} est en maintenance pour ${movie.content}`);
      } finally {
        await client.close();
      }
    }
  }
}
module.exports = Ping