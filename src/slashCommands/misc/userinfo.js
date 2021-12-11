const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { MongoClient } = require("mongodb");
const { MONGOSTRING } = require('../../util/config');

class Ping {
  async exec(interaction, user) {
    let member = interaction.guild.members.cache.find(member => member.user.id === user.id)
    let tag = user.tag
    let id = user.id
    let avatar = member.displayAvatarURL()
    let name
    let color = member.displayHexColor
    let createDate = user.createdAt
    let permission = []
    let permissions = ''
    let bot = user.bot
    let premium
    let joinDate = member.joinedAt
    let setupInfo

    //#region GetPrimos
    const uri = MONGOSTRING;
    const client = new MongoClient(uri);

    try {
      await client.connect();
      const database = client.db("sample_mflix");
      const movies = database.collection("movies");

      const query = { title: `${user.id}` };

      const movie = await movies.findOne(query);

      if (movie == null) {
        setupInfo = "N'est pas enregistré dans la Base de Données. Doit faire /setup"
      } else {
        setupInfo = `Est enregistré dans la Base de Données et a ${movie.content} primos gemmes`
      }
    } finally {
      await client.close();
    }
    //#endregion

    if (member.nickname == null) {
      name = user.username
    } else {
      name = member.nickname
    }

    if (member.premiumSince != null) {
      premium = `Booster du serveur depuis le : ${member.premiumSince}`
    } else {
      premium = "N'est pas booster du serveur"
    }

    const embed = new MessageEmbed()
      .setColor(color)
      .setImage(avatar)
      .setTitle(`${name} (${id})`)
      .setDescription(`Tag : ${tag}, ID: ${id}, Pseudo : ${name}, Bot : ${bot}`)
      .setFooter(`Informations demandées par ${interaction.user.tag} (${interaction.user.id})`, interaction.user.displayAvatarURL())

    member.permissions.toArray().forEach(element => {
      permission.push(element)
    });

    permission.forEach(element => {
      permissions = permissions + `\n ${element}`
    })

    if (member.permissions.toArray().includes('ADMINISTRATOR')) {
      permissions = "ADMINISTRATOR"
    }

    embed.addFields([
      { name: "Permissions", value: `${permissions}`, inline: true },
      { name: "Date de céation du compte", value: `${createDate}`, inline: true },
      { name: "Date de join du serveur", value: `${joinDate}`, inline: true },
      { name: "Status du boost", value: `${premium}`, inline: true },
      { name: "Status dans la Base de données", value: `${setupInfo}` }
    ])

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setURL('https://wiki-discord-france.fandom.com/fr/wiki/Permissions')
          .setLabel("Informations sur les permissions")
          .setStyle("LINK")
      )

    interaction.reply({
      embeds: [embed],
      components:[row]
    })
  }
}
module.exports = Ping