const { Listener } = require('discord-akairo');
const { MongoClient } = require("mongodb");
const {MONGOSTRING} = require('../../util/config'); 

class messageReactionAddListener extends Listener {
    constructor() {
        super('messageReactionAdd', {
            emitter: 'client',
            event: 'messageReactionAdd'
        });
    }

    async exec(messageReaction, user) {
      if(user.bot){
        return;
      }
      
      //#region Récupérations ds sticker
      const uri = MONGOSTRING;
      const client = new MongoClient(uri);
            
      try {
        await client.connect();
        const database = client.db("EmojisBDD");
        const movies = database.collection("emojis");

        const query = { title: `${user.id}` };

        const movie = await movies.findOne(query);        

        if(messageReaction.emoji.id != null){
          if(movie == null){
            messageReaction.remove()
            user.send(`Merci de faire \`g/setup\` Avant d'utliser les émojis de ce serveur !`)
            return;
          }
          let emoji = movie.content
          const emojisID = emoji.split(" ").slice(1)
          if(!emojisID.includes(messageReaction.emoji.id)){
            if(user.id == "843970970921467915"){
              messageReaction.remove()
              return;
            }
            user.send(`${user.username} vous ne possedez pas cet emoji : ${messageReaction.message.guild.emojis.cache.get(messageReaction.emoji.id)}`)
            messageReaction.remove()
          }
        } 
        
      } finally {
        await client.close();
      }
      //#endregion

    }
}

module.exports = messageReactionAddListener;