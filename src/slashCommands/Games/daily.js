const { Command } = require('discord-akairo');
const { MongoClient } = require("mongodb");
const { MONGOSTRING } = require('../../util/config');


class Ping {
  async exec(interaction) {
    let today = new Date();

    //#region Check Coins
    const uri = MONGOSTRING;
    const client = new MongoClient(uri);

    const filter = { title: `${interaction.user.id}` };
    const options = { upsert: true };

    try {
      await client.connect();
      const database = client.db("sample_mflix");
      const movies = database.collection("cooldowns");

      const query = { title: `${interaction.user.id}` };

      const movie = await movies.findOne(query);
      if (movie == null) {
        interaction.reply({
          content: `Merci de faire \`g/setup\` Avant d'utliser les commandes de ce serveur`,
          ephemeral: true
        })
        return;
      }
      if (movie.content == today.getDate()) return interaction.reply({content: "Vous avez déjà utlisé cette commande aujourd'hui :(", ephemeral: true})
      
    } finally {
      await client.close();
    }

    //#endregion

    //#region SetCooldowns
    var current;

    try {
      await client.connect();
      const database = client.db("sample_mflix");
      const movies = database.collection("cooldowns");

      const query = { title: `${interaction.user.id}` };

      const movie = await movies.findOne(query);

      current = today.getDate()
    } finally {
      await client.close();
    }

    try {
      await client.connect();
      const database = client.db("sample_mflix");
      const movies = database.collection("cooldowns");

      const updateDoc = {
        $set: {
          content: `${current}`
        },
      };
      const result = await movies.updateOne(filter, updateDoc, options);
    } finally {
      await client.close();
    }
    //#endregion

    //#region AddCoins
    var current;

    try {
      await client.connect();
      const database = client.db("sample_mflix");
      const movies = database.collection("movies");

      const query = { title: `${interaction.user.id}` };

      const movie = await movies.findOne(query);

      current = movie.content;
      current = parseInt(current) + parseInt(90);
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
      interaction.reply(`Merci d'avoir récupéré tes 90 primos gemmes du jour !`)
    } finally {
      await client.close();
    }
  }
}
module.exports = Ping