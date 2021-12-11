const {MessageEmbed, MessageAttachment} = require('discord.js')
const fs = require('fs');
const path = require('path');

class Ping{
  async exec(interaction, user , message){
    let today = new Date();

    let messages = [];

    await interaction.channel.messages.cache.forEach(element => {
      messages.push(`[${element.author.username}] ${element.toString()}`)
    });

    await fs.writeFile(path.join(__dirname, "../../util/log.txt"), messages.join('\n'), (err) => {
      if (err) {
        console.log(err);
      }
    });

    const attachement = new MessageAttachment(path.join(__dirname, "../../util/log.txt"))

    const log = new MessageEmbed()
    .setColor("#1ea814")
    .setTitle(`Bug corrigé`)
    .addField("Date", `${today.getDate()}/${today.getMonth()}/${today.getFullYear()} à ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`)
    .setDescription(`Le bug de ${user.tag} a bien été corigé`)

    const logU = new MessageEmbed()
    .setColor("#1ea814")
    .setTitle(`Bug corrigé`)
    .addField("Date", `${today.getDate()}/${today.getMonth()}/${today.getFullYear()} à ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`)
    .setDescription(`Le bug que vous aviez report a bien été corigé`)

    if(message == null){
      log.addField("Message", `\`Aucun message\``)
      logU.addField("Message", `\`Aucun message\``)
    }else{
      log.addField("Message", `\`${message}\``)
      logU.addField("Message", `\`${message}\``)
    }

    user.send({
      embeds : [logU]
    })
    interaction.user.send({
      embeds : [log],
      files: [attachement]
    })

    interaction.reply("Log envoyé")
  }
}
module.exports = Ping