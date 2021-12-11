const { MongoClient } = require("mongodb");
const {MONGOSTRING} = require('../../util/config'); 

async function AddUser(user, userTag){
  const uri = MONGOSTRING;
  const client = new MongoClient(uri);

  const filter = { title: `${user.username}` }; 
  const options = { upsert: true };
  try {        
    await client.connect();
    const database = client.db("BlackLists");
    const movies = database.collection("users");

    const updateDoc = {
      $set: {
        title: `${userTag}`,
        content: `${user.id}`
      },
    };
    await movies.updateOne(filter, updateDoc, options);
  } finally {
    await client.close();
  }
}

class Ping{
  exec(interaction, user){
    AddUser(user, user.tag)
    interaction.reply(`${user} est désormais BlackListé`)
  }
}
module.exports = Ping