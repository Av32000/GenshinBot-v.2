const { MessageEmbed } = require('discord.js')

class Ping {
  exec(interaction, type) {
    if (type == "Vaillant" || type == "vaillant") {
      interaction.reply('https://media.giphy.com/media/zKLfzB2FJSbjuYqvcI/giphy.gif')
    } else if (type == "Lumat" || type == "lumat") {
      interaction.reply('https://media.giphy.com/media/ieHIEKHvShmblD198b/giphy.gif')
    } else if (type == "Beauvisage" || type == "beauvisage" || type == "bovisage") {
      interaction.reply('https://media.giphy.com/media/i3o03QI4mHXeGpyYoH/giphy.gif')
    } else if (type == "Berujo" || type == "berujo") {
      interaction.reply('https://media.giphy.com/media/bjGWQFFZpfc72DiRW3/giphy.gif')
    } else if (type == "Haurant" || type == "haurant") {
      interaction.reply('https://media.giphy.com/media/nYfVKIVYfizHhrXa27/giphy.gif')
    } else if (type == "Perrier" || type == "perrier") {
      interaction.reply('https://media.giphy.com/media/5uof9UilRiELEF6fhn/giphy.gif')
    } else if (type == "Azougli" || type == "azougli") {
      interaction.reply('https://media.giphy.com/media/3jT1pJoraYKSYnfB9k/giphy.gif')
    } else if (type == "Marin" || type == "marin" || type == "Marine" || type == "marine") {
      interaction.reply('https://media.giphy.com/media/5fSYbtP8FtfAo2kooB/giphy.gif')
    }
    else {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("#ff1100")
            .setDescription(`La cible n'existe pas`)]
      })
    }
  }
}
module.exports = Ping