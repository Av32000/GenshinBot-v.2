class Ping{
  exec(interaction){
    interaction.reply({
      content: "Aucun test en cours",
      ephemeral: true
    })
  }
}
module.exports = Ping