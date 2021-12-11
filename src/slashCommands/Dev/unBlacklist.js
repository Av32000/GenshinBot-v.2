const { MongoClient } = require("mongodb");
const {MONGOSTRING} = require('../../util/config'); 

async function RemoveUser(user){
  const uri = MONGOSTRING;
  const client = new MongoClient(uri);

  const filter = { content: `${user.id}` }; 
  try {        
    await client.connect();
    const database = client.db("BlackLists");
    const movies = database.collection("users");
    await movies.deleteOne(filter);
  } finally {
    await client.close();
  }
}

class Ping{
  exec(interaction, user){
    RemoveUser(user)
    interaction.reply(`${user} n'est plus BlackListé`)
  }
}
module.exports = Ping