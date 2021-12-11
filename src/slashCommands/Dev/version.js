const {version} = require('../../util/config')

class Ping{
  exec(interaction){
    interaction.reply({
      content: `${version}`,
      ephemeral: true
    });
  }
}
module.exports = Ping