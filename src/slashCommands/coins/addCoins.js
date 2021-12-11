const { MongoClient } = require("mongodb");
const {MONGOSTRING} = require('../../util/config'); 

class Ping {
  async exec(interaction, user, value) {
    var current;

    const uri = MONGOSTRING;
    const client = new MongoClient(uri);


    const filter = { title: `${user.id}` };
    const options = { upsert: true };

    try {
      await client.connect();
      const database = client.db("sample_mflix");
      const movies = database.collection("movies");

      const query = { title: `${user.id}` };

      const movie = await movies.findOne(query);
      if (movie == null) {
        interaction.reply({
          content: `Cet utilisateur n'est pas enregistré dans la BDD`,
          ephemeral: true
        })
        return;
      }
      current = movie.content;
      current = parseInt(current) + parseInt(value);
    } finally {
      await client.close();
    }

    try {

      await client.connect();
      const database = client.db("sample_mflix");
      const movies = database.collection("movies");

      const updateDoc = {
        $set: {
          content: `${current}`
        },
      };
      const result = await movies.updateOne(filter, updateDoc, options);
      interaction.reply(`${user} a désormais : ${current} primo gemmes.`);
    } finally {
      await client.close();
    }
  }
}
module.exports = Ping