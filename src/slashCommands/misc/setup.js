const { MongoClient } = require("mongodb");
const { MONGOSTRING } = require("../../util/config")

class Ping {
  async exec(interaction) {
    const client = new MongoClient(MONGOSTRING);

    try {
      await client.connect();
      const database = client.db("EmojisBDD");
      const movies = database.collection("emojis");

      const invocStFilter = { title: `${interaction.user.id}` };
      const invocStElement = await movies.findOne(invocStFilter);

      if (invocStElement != null) {
        interaction.reply({
          content: `Tu est déja setup !`,
          ephemeral: true
        })
        return;
      }
    } finally {
      await client.close();
    }
    try {
      await client.connect();
      const database = client.db('EmojisBDD');
      const movies = database.collection('emojis');
      const query = { title: `${interaction.user.id}`, content: "" };
      const movie = await movies.insertOne(query);
    } finally {
      await client.close();
    }
    try {
      await client.connect();
      const database = client.db('sample_mflix');
      const movies = database.collection('movies');
      const query = { title: `${interaction.user.id}`, content: "" };
      const movie = await movies.insertOne(query);
    } finally {
      await client.close();
    }

    try {
      await client.connect();
      const database = client.db('sample_mflix');
      const movies = database.collection('cooldowns');
      const query = { title: `${interaction.user.id}`, content: "" };
      const movie = await movies.insertOne(query);
    } finally {
      await client.close();
    }
    interaction.reply({
      content: `Merci ${interaction.user} tu peux désormais utiliser toutes les commandes`,
      ephemeral: true
    })
  }
}
module.exports = Ping