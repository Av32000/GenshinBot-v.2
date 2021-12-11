class Ping{
  exec(interaction, userTo, message){
    interaction.client.users.cache.find(user => user.id === userTo.id).send(`${message}`)
    interaction.reply({
      content: `Le message : \n\`${message}\` \n a bien été envoyé à ${userTo.tag}`,
      ephemeral: true
    })
  }
}
module.exports = Ping