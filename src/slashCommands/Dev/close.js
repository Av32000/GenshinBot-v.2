const {MessageEmbed} = require('discord.js')
const{MessageActionRow, MessageButton} = require('discord.js');

class Ping {
  async exec(interaction) {
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('close')
          .setEmoji('✔️')
          .setLabel("Confirmer !")
          .setStyle("SUCCESS")
      )

    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("#06087a")
          .setDescription(`Etes vous certain de vouloir fermer ce ticket ?`)
      ],
      components: [row]
    })
  }
}
module.exports = Ping