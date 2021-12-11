const { MongoClient } = require("mongodb");
const {MONGOSTRING} = require('../../util/config'); 

async function RemoveUser(command){
  const uri = MONGOSTRING;
  const client = new MongoClient(uri);

  const filter = { title: `${command}` }; 
  try {        
    await client.connect();
    const database = client.db("BlackLists");
    const movies = database.collection("commands");
    await movies.deleteOne(filter);
  } finally {
    await client.close();
  }
}

class Ping{
  exec(interaction, command){
    RemoveUser(command)
    interaction.reply({
      content: `La commande \`${command}\` n'est plus en maintenance ✅`
    })
  }
}
module.exports = Ping