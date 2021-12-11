class Ping{
  exec(interaction, message){
    interaction.channel.send(message)
    interaction.reply({
      content: "Message correctement envoyé",
      ephemeral: true
    })
  }
}
module.exports = Ping