const { MongoClient } = require("mongodb");
const {MONGOSTRING, invocSt} = require('../../util/config'); 
const emojis = require('../../util/emojis'); 

const randomDice100 = () => Math.floor(Math.random() * 100) + 1;
const randomDiceIII = () => Math.floor(Math.random() * emojis.III.length);
const randomDiceIV = () => Math.floor(Math.random() * emojis.IV.length);
const randomDiceV = () => Math.floor(Math.random() * emojis.V.length);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function addStickers(interaction, stickers){
  var current;

  const uri = MONGOSTRING;
  const client = new MongoClient(uri);


  const filter = { title: `${interaction.user.id}` }; 
  const options = { upsert: true };

  try {
    await client.connect();
    const database = client.db("EmojisBDD");
    const movies = database.collection("emojis");

    const query = { title: `${interaction.user.id}` };

    const movie = await movies.findOne(query);

    current = movie.content;
    current += " " + stickers;

  } finally {
    await client.close();
  }

  try {
    await client.connect();
    const database = client.db("EmojisBDD");
    const movies = database.collection("emojis");

    const updateDoc = {
      $set: {
        content: `${current}`
      },
    };
    const result = await movies.updateOne(filter, updateDoc, options);
  } finally {
    await client.close();
  }
}

class Ping{
  async exec(interaction) {
    interaction.reply("...")
    let lv;
    let number = randomDice100();

    //#region Check Coins
    const uri = MONGOSTRING;
    const client = new MongoClient(uri);

    const filter = { title: `${interaction.user.id}` }; 
    const options = { upsert: true };
          
    try {
      await client.connect();
      const database = client.db("sample_mflix");
      const movies = database.collection("movies");

      const query = { title: `${interaction.user.id}` };

      const movie = await movies.findOne(query);
      if(movie == null){
        interaction.reply({
          content: `Merci de faire \`g/setup\` Avant d'utliser les commandes de ce serveur`,
          ephemeral: true
        })
        return;
      } 
      if(movie.content < invocSt[0])return interaction.reply({
        content: "Vous n'avez pas assez de primo gemmes :(",
        ephemeral: true
      })

    } finally {
      await client.close();

    }
      //#endregion
      
    if(number <= 90){
      lv = interaction.guild.emojis.cache.get(emojis.etoileIII)
    }else if(number > 90 && number <= 98){
        lv = interaction.guild.emojis.cache.get(emojis.etoilesIV)
    }else if(number > 98){
        lv = interaction.guild.emojis.cache.get(emojis.etoilesV)
    }

    //#region Retrait Coins
      var current;

    try {
      await client.connect();
      const database = client.db("sample_mflix");
      const movies = database.collection("movies");

      const query = { title: `${interaction.user.id}` };

      const movie = await movies.findOne(query);
      current = movie.content;
      current = parseInt(current) - parseInt(invocSt[0]);
      if(current < 0){
        current = 0;
      }
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
    } finally {
      await client.close();
    }
    //#endregion

    if(lv === interaction.guild.emojis.cache.get(emojis.etoileIII)){
      await interaction.editReply('https://media.giphy.com/media/uieBjXzuH2ObAyku1e/giphy.gif')
      await sleep(6000);
      await interaction.deleteReply()
      let emoji = emojis.III[randomDiceIII()]
      await interaction.followUp(`Vous gagnez un sticker... ${lv} \n ${interaction.guild.emojis.cache.get(emoji)}`)
      addStickers(interaction,emoji)
    }
    else if(lv === interaction.guild.emojis.cache.get(emojis.etoilesIV)){
      interaction.reply("https://c.tenor.com/8OqlJIRATS0AAAAC/wishing-genshin.gif")

      await sleep(4500);
      interaction.deleteReply()
      let emoji = emojis.IV[randomDiceIV()]
      interaction.followUp(`Vous gagnez un sticker... ${lv} \n ${interaction.channel.send.guild.emojis.cache.get(emoji)}`)
      addStickers(interaction,emoji)
    }
    else if(lv === interaction.guild.emojis.cache.get(emojis.etoilesV)){
      interaction.reply("https://tenor.com/view/genshin-wish-5star-gif-19762608")

      await sleep(4500);
      interaction.deleteReply()
      let emoji = emojis.V[randomDiceV()]
      let ids = [];

      if(emoji === "Eula"){
        emojis.Eula.forEach(element =>{
          interaction.followUp(`VOUS GAGNEZ UN PACK ${lv} !!! \n ${interaction.guild.emojis.cache.get(element)}`);
          ids.push(" " + element)
        });
        addStickers(interaction, ids.join(""))
      }else if(emoji === "Ganyu"){
        emojis.Ganyu.forEach(element =>{
          interaction.followUp(`VOUS GAGNEZ UN PACK ${lv} !!! \n ${interaction.guild.emojis.cache.get(element)}`);
        ids.push(" " + element)
      });
      addStickers(interaction, ids.join(""))
      }else if(emoji === "Keqing"){
        emojis.Keqing.forEach(element =>{
          interaction.followUp(`VOUS GAGNEZ UN PACK ${lv} !!! \n ${interaction.guild.emojis.cache.get(element)}`);
          ids.push(" " + element)
        });
        addStickers(interaction, ids.join(""))
      }else if(emoji === "Klee"){
        emojis.Klee.forEach(element =>{
          interaction.followUp(`VOUS GAGNEZ UN PACK ${lv} !!! \n ${interaction.guild.emojis.cache.get(element)}`);
          ids.push(" " + element)
        });
        addStickers(interaction, ids.join(""))
      }else if(emoji === "Zhongli"){
        emojis.Zhongli.forEach(element =>{
          interaction.followUp(`VOUS GAGNEZ UN PACK ${lv} !!! \n ${interaction.guild.emojis.cache.get(element)}`);
          ids.push(" " + element)
        });
        addStickers(interaction, ids.join(""))
      }

    }    
  }
}
module.exports = Ping