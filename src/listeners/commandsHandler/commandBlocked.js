const { Listener } = require('discord-akairo');

class commandBlocked extends Listener {
    constructor() {
        super('commandBlocked', {
            emitter: 'commandHandler',
            event: 'commandBlocked'
        });
    }

    exec(message, command, reason) {
      message.channel.send(`${message.author}, vous ne pouvez pas utiliser la commande \`${command}\` car : \n\`${reason}\``)
    }
}

module.exports = commandBlocked;