const DiscordJS = require('discord.js')
const{MessageActionRow, MessageButton, MessageEmbed} = require('discord.js');
const { MongoClient } = require("mongodb");
const {MONGOSTRING} = require('../../util/config'); 

module.exports = {
  category: 'Games',
  description: 'Prpose un duel à un autre utilisateur',
  
  slash: true, 
  testOnly: true,

  expectedArgs: '<user> <mise>',
  minArgs: 2,
  maxArgs: 2,

  options: [
    {
      name: 'user', // Must be lower case
      description: "L'utilisateur à défier",
      required: true,
      type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER, // This argument is a string
    },
    {
      name: 'mise', // Must be lower case
      description: 'Le nombre de primos gemmes mises en jeux',
      required: true,
      type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER, // This argument is a string
    },
  ],
  
  callback: async ({interaction, args}) => {
    const [user, mise] = args
        if(mise <= 0){
          return interaction.reply({ embeds: [
            new MessageEmbed()
                .setColor("#ff1100")
                .setDescription(`Merci de parier un nombre positif non nul de primo gemmes`)
          ]})
        }

        if(user == interaction.user){
          return interaction.reply({ embeds: [
            new MessageEmbed()
                .setColor("#ff1100")
                .setDescription(`Vous ne pouvez pas vous defier vous même !`)
          ]})
        }

        //#region CheckCoins
        const uri = MONGOSTRING;
        const client = new MongoClient(uri);
  
        try {
          await client.connect();
          const database = client.db("sample_mflix");
          const movies = database.collection("movies");

          const query = { title: `${interaction.user.id}` };

          const movie = await movies.findOne(query);

          if(movie == null){
            interaction.reply(`${interaction.user} Cet utilisateur n'est pas enregistré dans la BDD`)
            return;
          }
          if(parseInt(movie.content) < parseInt(mise)){
            return interaction.reply({ embeds: [
              new MessageEmbed()
                  .setColor("#ff1100")
                  .setDescription(`Il vous manques des primos gemmes`)
            ]})
          }
        } finally {
          await client.close();
        }
        //Adverssaire
        try {
          await client.connect();
          const database = client.db("sample_mflix");
          const movies = database.collection("movies");

          const query = { title: `${user}` };

          const movie = await movies.findOne(query);

          if(movie == null){
            interaction.reply(`<@${user}> Cet utilisateur n'est pas enregistré dans la BDD`)
            return;
          }
          if(parseInt(movie.content) < parseInt(mise)){
            return interaction.reply({ embeds: [
              new MessageEmbed()
                  .setColor("#ff1100")
                  .setDescription(`Il manques des primos gemmes à <@${user}>`)
            ]})
          }
        } finally {
          await client.close();
        }
        //#endregion

        const row = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId('AcceptDuel')
              .setEmoji('✔️')
              .setLabel("Accepter")
              .setStyle("SUCCESS")
          )
          .addComponents(
            new MessageButton()
              .setCustomId('RefuserDuel')
              .setEmoji('❌')
              .setLabel("Refuser")
              .setStyle("DANGER")
          )

      await interaction.reply({
        content: `<@${user}> / ${interaction.user.id} : ${mise}`,
        embeds: [
          new MessageEmbed()
          .setColor("#06087a")
          .setTitle(`${interaction.client.users.cache.get(user).username}, voulez vous accepter le duel de ${interaction.user.username} ?`)
          .setDescription(`La mise est de ${mise}`)
        ],
        components: [row]
      })
  },
}