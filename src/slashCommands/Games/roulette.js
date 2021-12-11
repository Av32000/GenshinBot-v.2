const { MongoClient } = require("mongodb");
const {MONGOSTRING, roulette, cooldowns} = require('../../util/config'); 
const {MessageEmbed} = require('discord.js')
const randomDice100 = () => Math.floor(Math.random() * 100) + 1;

class Ping{
  async addCoins(User, Value){
    var current;
    const uri = MONGOSTRING;
    const client = new MongoClient(uri);
    const filter = { title: `${User}` }; 
    const options = { upsert: true };
    try {
      await client.connect();
      const database = client.db("sample_mflix");
      const movies = database.collection("movies");
      const query = { title: `${User}` };
      const movie = await movies.findOne(query);
      if(movie == null){
         interaction.reply(`Merci de faire \`g/setup\` Avant d'utliser les commandes de ce serveur`)
        return;
      } 
      current = movie.content;
      current = parseInt(current) + parseInt(Value);
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
  }


  async exec(interaction) {
    const uri = MONGOSTRING;
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const database = client.db("sample_mflix");
      const movies = database.collection("movies");
      const query = { title: `${interaction.user.id}` };
      const movie = await movies.findOne(query);
      if(movie == null){
        interaction.reply({content: `Merci de faire \`g/setup\` Avant d'utliser les commandes de ce serveur`, ephemeral: true})
        return;
      } 
    } finally {
      await client.close();
    }

    let today = new Date();

    let userCooldowns = false;

    roulette.forEach(element => {
      if(element.split("=>")[0] == interaction.user.id){

        if((parseInt(element.split("=>")[1].split(" ")[1]) +  10800000) > today.getTime()){
          userCooldowns = true
        }
      }
    });
    if(userCooldowns == true){
      interaction.reply({ embeds: [
        new MessageEmbed()
        .setColor("#fc0320")
        .setTitle(`${interaction.user.username}`)
        .setDescription(`:x:  Merci d'attendre 3h entre chaque tirage :x: `)
      ],ephemeral: true})
      return;
    }

    if(userCooldowns == false){
      for(let i = 0; i < roulette.length; i++){
        if(roulette[i].split("=>")[0] == interaction.user.id){
          roulette[i].slice(i,1)
          break;
        }
      }
    }
    roulette.push(interaction.user.id + "=> " + today.getTime())

    let number = randomDice100();
    //#region Roulette
    if(number <= 60){
      interaction.reply({ embeds: [
        new MessageEmbed()
        .setColor("#fc0320")
        .setTitle(`${interaction.user.username}`)
        .setDescription(":x:  Malheureusement vous n'avez rien gagné :x: ")
      ]}).the
      return;
    }else if(number > 60 && number <= 70){
      this.addCoins(interaction.user.id, 120)
      interaction.reply({ embeds: [
        new MessageEmbed()
        .setColor("#42f563")
        .setTitle(`${interaction.user.username}`)
        .setDescription("Bravo ! Vous gagnez 120 primos gemmes!")
      ]})
      return;
    }else if(number > 70 && number <= 80){
      this.addCoins(interaction.user.id, 150)
      interaction.reply({ embeds: [
        new MessageEmbed()
        .setColor("#42f563")
        .setTitle(`${interaction.user.username}`)
        .setDescription("Bravo ! Vous gagnez 150 primos gemmes!")
      ]})
      return;
    }else if(number > 80 && number <= 90){
      this.addCoins(interaction.user.id, 180)
      interaction.reply({ embeds: [
        new MessageEmbed()
        .setColor("#42f563")
        .setTitle(`${interaction.user.username}`)
        .setDescription("Bravo ! Vous gagnez 180 primos gemmes!")
      ]})
      return;
    }else if(number > 90 && number <= 99){
      this.addCoins(interaction.user.id, 210)
      interaction.reply({ embeds: [
        new MessageEmbed()
        .setColor("#42f563")
        .setTitle(`${interaction.user.username}`)
        .setDescription("Bravo ! Vous gagnez 210 primos gemmes!")
      ]})
      return;
    }else if(number == 100){
      this.addCoins(interaction.user.id, 300)
      interaction.reply({ embeds: [
        new MessageEmbed()
        .setColor("#42f563")
        .setTitle(`${interaction.username}`)
        .setDescription("Bravo ! Vous gagnez 300 primos gemmes!")
      ]})
      return;
    }
    //#endregion
  
  }
}
module.exports = Ping