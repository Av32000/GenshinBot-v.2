const { MongoClient } = require("mongodb");
const {MONGOSTRING} = require('../../util/config'); 

async function AddUser(command, reason){
  let reasonValide = reason;
  if(reason == null){
    reasonValide = "Aucune raison spécifié"
  }
  const uri = MONGOSTRING;
  const client = new MongoClient(uri);

  const filter = { title: `${command}` }; 
  const options = { upsert: true };
  try {        
    await client.connect();
    const database = client.db("BlackLists");
    const movies = database.collection("commands");

    const updateDoc = {
      $set: {
        title: `${command}`,
        content: `${reasonValide}`
      },
    };
    await movies.updateOne(filter, updateDoc, options);
  } finally {
    await client.close();
  }
}

class Ping{
  exec(interaction, command, reason){
    AddUser(command, reason)
    interaction.reply({
      content: `La commande \`${command}\` est désormais en maintenance pour \`${reason}\` 🛠️`
    })
  }
}
module.exports = Ping