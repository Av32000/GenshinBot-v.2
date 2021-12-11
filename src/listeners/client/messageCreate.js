const { Listener } = require('discord-akairo');
const { MongoClient } = require("mongodb");
const {MONGOSTRING} = require('../../util/config'); 
const {MessageEmbed} = require('discord.js')

async function CheckEmoji(emojis, user, message){
  const uri = MONGOSTRING;
      const client = new MongoClient(uri);

      const filter = { title: `${user.id}` }; 
      const options = { upsert: true };
            
      try {
        await client.connect();
        const database = client.db("EmojisBDD");
        const movies = database.collection("emojis");

        const query = { title: `${user.id}` };

        const movie = await movies.findOne(query);

        let emoji = movie.content
        const emojisID = emoji.split(" ").slice(1)

        if(emojis != null){
          if(!emojisID.includes(emojis)){
            if(user.id == "843970970921467915"){
              message.delete();
              return;
            }
            user.send(`${user.username} vous ne possedez pas cet emoji : ${message.guild.emojis.cache.get(emojis)}`)
            message.delete();
          }
        } 
        
      } finally {
        await client.close();
      }
}


class messageCreateListener extends Listener {
    constructor() {
        super('messageCreate', {
            emitter: 'client',
            event: 'messageCreate'
        });
    }


    async exec(message) {
      let today = new Date();
      if(message.guild == null && message.author.tag != "Genshin BOT#7216"){
        if(message.author.id == "895705031284772885"){
          return;
        }
        return this.client.users.cache.find(user => user.id === '593436735380127770').send({ embeds: [
          new MessageEmbed()
              .setColor("#eff542")
              .setTitle(`Nouveaux mp de ${message.author.tag}`)
              .setDescription(`${message}`)
              .setFooter(`Date ${today.getDate()}/${today.getMonth()}/${today.getFullYear()} à ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`)
      ]})
      }
      try{
        if(message.member.user.bot){
          return;
        }
      }catch{
        return;
      }
      let messageDeleted = false;

      //#region Récupérations ds sticker
      const uri = MONGOSTRING;
      const client = new MongoClient(uri);

      const filter = { title: `${message.member.user.id}` }; 
      const options = { upsert: true };
            
      try {
        await client.connect();
        const database = client.db("EmojisBDD");
        const movies = database.collection("emojis");

        const query = { title: `${message.member.user.id}` };

        const movie = await movies.findOne(query);
        let messageSplit = message.toString().split("<")
        if(messageSplit.length > 1){
        messageSplit.forEach(element => {
          let emoji = element.split(">")[0].split(":")[2]
          if(emoji != undefined){
            if(emoji != null){
              if(movie == null){
                message.member.user.send(`Merci de faire \`g/setup\` Avant d'utliser les émojis de ce serveur !`)
                if(messageDeleted == true){
                  return;
                }
                message.delete()
                messageDeleted = true;
                return;
              }
              if(messageDeleted == true){
                return;
              }
              CheckEmoji(emoji, message.member.user, message)
              messageDeleted = true;
            }
          }

        });
        //si non verifiez que l'utilisateur a l'emoji
      }
      }finally {
        await client.close();
      }
      //#endregion

    }
}

module.exports = messageCreateListener;