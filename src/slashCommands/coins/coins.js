const { MongoClient } = require("mongodb");
const {MONGOSTRING} = require('../../util/config'); 

class Ping{
  async exec(interaction, user) {
    const uri = MONGOSTRING;
    const client = new MongoClient(uri);

    try {
      await client.connect();
      const database = client.db("sample_mflix");
      const movies = database.collection("movies");

      const query = { title: `${user.id}` };

      const movie = await movies.findOne(query);

      if(movie == null){
        interaction.reply({
          content: `Cet utilisateur n'est pas enregistré dans la BDD`,
          ephemeral: true
        })
        return;
      }

      interaction.reply(`${user} a ${movie.content} primo gemmes.`);
    } finally {
      await client.close();
    }
  }
}
module.exports = Ping