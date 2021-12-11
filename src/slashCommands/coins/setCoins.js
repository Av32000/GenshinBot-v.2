const { MongoClient } = require("mongodb");
const {MONGOSTRING} = require('../../util/config'); 

class Ping {
  async exec(interaction, user, value) {
    const uri = MONGOSTRING;
    const client = new MongoClient(uri);


    const filter = { title: `${user.id}` };
    const options = { upsert: true };

    try {
      await client.connect();
      const database = client.db("sample_mflix");
      const movies = database.collection("movies");

      const updateDoc = {
        $set: {
          content: `${value}`
        },
      };
      const result = await movies.updateOne(filter, updateDoc, options);
      interaction.reply(`${user} a désormais : ${value} primo gemmes.`);
    } finally {
      await client.close();
    }
  }
}
module.exports = Ping