const{MessageActionRow, MessageSelectMenu, MessageEmbed} = require('discord.js');

class Ping {
  async exec(interaction) {
    const row = new MessageActionRow()
      .addComponents(new MessageSelectMenu()
        .setCustomId("selected")
        .setPlaceholder("Merci de choisir votre type de suport !")
        .addOptions([
          {
            label: "Bug Report",
            value: "bug",
            description: 'Permet de report un bug du bot',
            emoji: '🪲'
          },
          {
            label: "Réclamation de Récompense",
            value: "pay",
            description: 'Permet de réclamer une récompense',
            emoji: '💵'
          },
          {
            label: "Signalement membre",
            value: "ban",
            description: 'Permet de signaler un membre',
            emoji: '🤬'
          },
          {
            label: "Question / Sugestion",
            value: "q",
            description: 'Permet de poser une question en raport avec le bot ou de soumettre une sugestion',
            emoji: '❓'
          },

        ])
      )


    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("#ff8000")
          .setTitle(`Support`)
          .setDescription(`Bienvenue sur le support. Merci de choisir votre type de suport`)
          .addField('Pour signaler un membre', "Il est nécéssaire d'avoir une preuve (lien d'un message, screen, rec..)")
          .addField("Pour demander une récompense", "Il est nécéssaire d'avoir une preuve (lien d'un message, screen, rec..)")
          .addField("Pour signaler un bug", "Il faut une description précise du bug.")
          .addField("Pour les questions", "Merci de ne pas poser de questions troll")
      ],
      components: [row]
    })
  }
}
module.exports = Ping