const { userInDuel, completeTeam, duels, usersStart } = require('../../util/config')
const { MessageEmbed } = require('discord.js')
const fonctions = require('../../util/functions')

async function checkStart(adverssaireID, userID, channel, interaction, mise) {
  let func = new fonctions
  let user = channel.client.users.cache.find(user => user.id === userID)
  let adverssaire = channel.client.users.cache.find(user => user.id === adverssaireID)
  let duelChannel;
  if (usersStart.includes(adverssaire)) {
    await interaction.guild.channels.create(`Duel ${user.username} contre ${adverssaire.username}`).then(channel => { duelChannel = channel})
    func.boucleDeCombat(adverssaireID, userID, duelChannel, mise);
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription(`Le duel commence dans ${duelChannel} !`)
      ]
    })
  } else {
    usersStart.push(user)
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription(`${user} le duel va commencer. ${adverssaire} n'a pas encore finis de se préparer`)
      ]
    })
  }
}

module.exports = {
  category: 'Games',
  description: 'Démarre le duel',

  slash: true,
  testOnly: true,

  callback: ({ interaction }) => {
    if (userInDuel.includes(interaction.user.id)) {
      let pret = false;
      for (let c = 0; c < completeTeam.length; c++) {
        if (completeTeam[c].split(":[")[0] == interaction.user.tag) {
          pret = true
          break
        }
      }
      if (pret == false) {
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setDescription("Vous devez préparer votre équipe avant de commencer")
          ]
        })
        return;
      }
      let adverssaire;
      let mise;
      duels.forEach(element => {
        let user1 = element.split('/')[0]
        let user2 = element.split('/')[1].split(':')[0]

        if (user1 == interaction.user.id) {
          for (let i = 0; i < duels.length; i++) {
            let elements = "" + duels[i]
            if (elements.split('/')[0] == user1) {
              adverssaire = elements.split("/")[1].split(':')[0]
              mise = elements.split(':')[1]
            }
          }
        }
        else if (user2 == interaction.user.id) {
          for (let i = 0; i < duels.length; i++) {
            let elements = "" + duels[i]
            if (elements.split('/')[1].split(":")[0] == user2) {
              adverssaire = elements.split("/")[0]
              mise = elements.split(':')[1]
            }
          }
        }
      })
      console.log(adverssaire)
      checkStart(adverssaire, interaction.user.id, interaction.channel, interaction, mise)
    } else {
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setDescription("Vous ne defiez perssone. Tapez /duel pour defiez quelqu'un")
        ]
      })
    }
  },
}