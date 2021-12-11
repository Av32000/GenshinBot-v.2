const { owners } = require('../../util/config')

class Ping{
  exec(interaction, user){
    if(!owners.includes(user.id)){
      interaction.reply({
        content: `${user} n'est pas Owner du bot !`,
        ephemeral: true
      });
      return;
    }else{
      if(interaction.user.id != "593436735380127770"){
        interaction.reply({
          content: "PTDR T KI 😂",
          ephemeral: true
        })
        return;
      }
      owners.splice(owners.indexOf(user.id), 1);
      interaction.reply({
        content: `${user} n'est plus Owner du bot !`
      });
    }    
  }
}
module.exports = Ping