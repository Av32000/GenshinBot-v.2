const { stripIndent } = require('common-tags');
const { MongoClient } = require("mongodb");
const { MONGOSTRING } = require("../../util/config")

class Ping {
  async exec(interaction) {
    const uri = MONGOSTRING;
    const client = new MongoClient(uri);

    try {
      await client.connect();
      const database = client.db("sample_mflix");
      const movies = database.collection("PatchNote");

      const query = { title: `PatchNote` };

      const movie = await movies.findOne(query);

      interaction.reply(`Voici le Patch Note : \n` + stripIndent`\`\`\`${movie.content}
    \`\`\``)
    } finally {
      await client.close();
    }
  }
}
module.exports = Ping